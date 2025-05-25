import { _decorator, Component, Node, Prefab, UITransform, instantiate, Vec3, EventTouch, tween } from 'cc';
const { ccclass, property } = _decorator;

type NodeInfo = {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    parent?: NodeInfo;
};

@ccclass('MapPanel')
export class MapPanel extends Component {
    @property(Node)
    private mapContainer: Node;

    @property(Node)
    private player: Node;

    @property(Prefab)
    private obstacle: Prefab;

    @property(UITransform)
    private mapUIT: UITransform;

    private map: number[][] = [];
    private mapWidth: number = 0;
    private mapHeight: number = 0;
    private cols: number = 0;
    private rows: number = 0;
    private nodeList: Node[] = [];

    onLoad(): void {
        this.mapContainer.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    start() {
        this.mapWidth = this.mapContainer.getComponent(UITransform).width;
        this.mapHeight = this.mapContainer.getComponent(UITransform).height;
        const cellSize = 50;
        this.cols = Math.floor(this.mapWidth / cellSize);
        this.rows = Math.floor(this.mapHeight / cellSize);
        this.map = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

        this.generateRandomMap();
    }

    private generateRandomMap() {
        this.nodeList.forEach(node => node.destroy());
        this.nodeList = [];
        this.map = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        let nums = Math.floor(Math.random() * 10 + 20);
        for (let i = 0; i < nums; i++) {
            const x = Math.floor(Math.random() * this.cols);
            const y = Math.floor(Math.random() * this.rows);
            if (this.map[y][x] === 1) continue; // 已有障碍跳过

            this.map[y][x] = 1; // 设置为障碍

            const obs = instantiate(this.obstacle);
            obs.setPosition(x * 50 - this.mapWidth / 2, y * 50 - this.mapHeight / 2);
            this.mapContainer.addChild(obs);
            this.nodeList.push(obs);
        }
    }

    private touchEnd(e: EventTouch) {
        const localPos = this.mapUIT.convertToNodeSpaceAR(e.getUILocation().toVec3());
        const tx = Math.floor((localPos.x + this.mapWidth / 2) / 50);
        const ty = Math.floor((localPos.y + this.mapHeight / 2) / 50);

        const px = Math.floor((this.player.position.x + this.mapWidth / 2) / 50);
        const py = Math.floor((this.player.position.y + this.mapHeight / 2) / 50);

        if (this.map[ty]?.[tx] === 1) {
            console.warn("目标是障碍！");
            return;
        }

        const path = this.findPath([px, py], [tx, ty]);
        this.moveAlongPath(path);
    }

    private findPath(start: [number, number], end: [number, number]): [number, number][] {
        const heuristic = (x: number, y: number) => Math.abs(x - end[0]) + Math.abs(y - end[1]);
        const open: NodeInfo[] = [];
        const closed: boolean[][] = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));

        const startNode: NodeInfo = {
            x: start[0],
            y: start[1],
            g: 0,
            h: heuristic(start[0], start[1]),
            f: 0,
        };
        startNode.f = startNode.g + startNode.h;
        open.push(startNode);

        const getNeighbors = (x: number, y: number) => {
            const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            const result: [number, number][] = [];
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < this.cols && ny < this.rows && this.map[ny][nx] === 0) {
                    result.push([nx, ny]);
                }
            }
            return result;
        };

        while (open.length > 0) {
            open.sort((a, b) => a.f - b.f);
            const current = open.shift()!;
            closed[current.y][current.x] = true;

            if (current.x === end[0] && current.y === end[1]) {
                const path: [number, number][] = [];
                let node: NodeInfo | undefined = current;
                while (node) {
                    path.unshift([node.x, node.y]);
                    node = node.parent;
                }
                return path;
            }

            for (const [nx, ny] of getNeighbors(current.x, current.y)) {
                if (closed[ny][nx]) continue;

                const g = current.g + 1;
                const h = heuristic(nx, ny);
                const existing = open.find(n => n.x === nx && n.y === ny);
                if (!existing || g < existing.g) {
                    const neighbor: NodeInfo = { x: nx, y: ny, g, h, f: g + h, parent: current };
                    if (!existing) open.push(neighbor);
                }
            }
        }

        return [];
    }

    private moveAlongPath(path: [number, number][]) {
        if (path.length < 2) return;

        tween(this.player).stop();
        let t = tween(this.player);
        for (let i = 1; i < path.length; i++) {
            const [x, y] = path[i];
            const pos = new Vec3(x * 50 - this.mapWidth / 2, y * 50 - this.mapHeight / 2);
            t = t.to(0.2, { position: pos });
        }
        t.start();
    }
}
