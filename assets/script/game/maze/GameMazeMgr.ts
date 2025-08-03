import { _decorator, Component, instantiate, Label, Node, Prefab, UITransform, Vec3 } from 'cc';
import { AudioConfig } from 'db://assets/RS/core/config/AudioConfig';
import { GameMazePlayer } from './GameMazePlayer';
import { UIController } from 'db://assets/src/Controller/UiController';
const { ccclass, property } = _decorator;

@ccclass('GameMazeMgr')
export class GameMazeMgr extends Component {
    @property({ type: Prefab })
    private wallPrefab: Prefab = null;
    @property({ type: Prefab })
    private pathPrefab: Prefab = null;
    @property({ type: Prefab })
    private exitPrefab: Prefab = null;
    @property({ type: Node })
    private mazeContainer: Node = null;
    @property({ type: Node })
    private playerNode: Node = null;
    private playerUIT: UITransform
    @property({ type: UITransform })
    private maskUIT: UITransform
    //限定时间
    limitTime: number = 360
    begainTime: number = 0;
    /**正在失败选择标识 */
    isDefeatSelect: boolean = false;
    private cellSize: number = 60;
    private mazeWidth: number = 21;
    private mazeHeight: number = 21;
    private exitPosition: { x: number, y: number } = { x: 0, y: 0 };

    start() {
        rs.audio.playBg(AudioConfig.getBGM(rs.enum.FileName_audioBG.normalBg), 1, true)
        this.playerUIT = this.playerNode.getComponent(UITransform)
        let size = this.node.scene.getChildByName("Canvas").getComponent(UITransform).contentSize
        this.maskUIT.node.children[0].getComponent(UITransform).setContentSize(size.width * 2, size.height * 2)
        this.generateMaze();
    }
    onDisable(): void {
        this.unscheduleAllCallbacks()
    }
    private generateMaze() {
        // 清理旧迷宫节点
        this.mazeContainer.children.forEach(child => child.destroy());

        // 生成迷宫数据
        const generator = new MazeGenerator(this.mazeWidth, this.mazeHeight);
        const mazeData = generator.getMaze();
        this.exitPosition = generator.getExitPosition();
        const startX = Math.floor(this.mazeWidth / 2);
        const startY = Math.floor(this.mazeHeight / 2);
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                const isWall = mazeData[x][y] === 1; // 墙壁是1，路径是0
                const prefab = isWall ? this.wallPrefab : this.pathPrefab;
                const cell = instantiate(prefab);
                const startX = Math.floor(this.mazeWidth / 2);
                const startY = Math.floor(this.mazeHeight / 2);
                mazeData[startY][startX] = 0;
                // 设置节点大小和位置
                const uiTransform = cell.getComponent(UITransform);
                if (uiTransform) {
                    uiTransform.setContentSize(this.cellSize, this.cellSize);
                }
                // 设置位置
                cell.setPosition(new Vec3(x * this.cellSize, -y * this.cellSize, 0));
                cell.parent = this.mazeContainer;

                // 如果是出口位置，则使用特殊标记
                if (x === this.exitPosition.x && y === this.exitPosition.y) {
                    const exitCell = instantiate(this.exitPrefab);
                    exitCell.setPosition(new Vec3(x * this.cellSize, -y * this.cellSize, 0));
                    exitCell.parent = this.mazeContainer;
                }
            }
        }
        this.playerNode.getComponent(GameMazePlayer).initPlayer(startX, startY, mazeData, this.cellSize);
        this.playerNode.on("move", this.checkVictory, this)
        this.checkVictory(startX, startY)
    }
    /**每次移动时触发 */
    checkVictory(posX: number, posY: number): boolean {
        if (this.exitPosition.x == posX && this.exitPosition.y == posY) {
            UIController.normalMessage("恭喜你，你到达了出口！")
            rs.audio.playEffect(AudioConfig.getUi(rs.enum.FileName_audioUi.success1))
            return true;
        }
        this.maskUIT.setContentSize(this.playerUIT.contentSize.width + this.cellSize, this.playerUIT.contentSize.height + this.cellSize)
        this.maskUIT.anchorPoint = this.playerUIT.anchorPoint;
        this.maskUIT.node.position = this.playerNode.position;
        return false
    }
    reOpen() {
        this.generateMaze()

        UIController.normalMessage("迷宫已重置,玩家已重置")
    }
}
/**迷宫生成器 */
class MazeGenerator {
    private width: number;
    private height: number;
    private maze: number[][];
    private exitPosition: { x: number, y: number } = { x: 0, y: 0 };

    constructor(width: number, height: number) {
        this.width = width % 2 == 0 ? width + 1 : width;
        this.height = height % 2 == 0 ? height + 1 : height;
        this.maze = [];
        this.generateMaze();
    }
    private generateMaze() {
        // 初始化迷宫，1是墙，0是路径
        for (let x = 0; x < this.width; x++) {
            this.maze[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.maze[x][y] = 1; // 初始为墙
            }
        }

        // 从(1, 1)开始生成迷宫
        this.carvePath(1, 1);

        // 随机选择一个出口位置
        this.exitPosition = this.chooseExit();

        // 设置迷宫的出口
        const { x, y } = this.exitPosition;
        this.maze[x][y] = 0; // 出口位置设为路径
    }
    // 随机选择一个出口位置
    private chooseExit(): { x: number, y: number } {
        const edge = Math.floor(Math.random() * 4);
        let exitX = 0;
        let exitY = 0;
        switch (edge) {
            case 0: // 上
                exitX = Math.floor(Math.random() * this.width);
                exitY = 0;
                break;
            case 1: // 下
                exitX = Math.floor(Math.random() * this.width);
                exitY = this.height - 1;
                break;
            case 2: // 左
                exitX = 0;
                exitY = Math.floor(Math.random() * this.height);
                break;
            case 3: // 右
                exitX = this.width - 1;
                exitY = Math.floor(Math.random() * this.height);
                break;
        }
        let pos = { x: exitX, y: exitY }
        if ((pos.x == 0 && pos.y == 0) || (pos.x == this.width - 1 && pos.y == this.height - 1) || (pos.x == this.width - 1 && pos.y == 0) || (pos.x == 0 && pos.y == this.height - 1)) {
            pos = this.chooseExit();
        }
        return pos;
    }
    private carvePath(x: number, y: number) {
        const directions = [
            { dx: 0, dy: -1 }, // 上
            { dx: 0, dy: 1 },  // 下
            { dx: -1, dy: 0 }, // 左
            { dx: 1, dy: 0 },  // 右
        ];

        // 确保只在奇数坐标雕刻路径
        if (x % 2 === 1 && y % 2 === 1) {
            this.maze[x][y] = 0; // 标记路径
        }

        // 随机打乱方向
        directions.sort(() => Math.random() - 0.5);

        for (const direction of directions) {
            const nx = x + direction.dx * 2;
            const ny = y + direction.dy * 2;

            // 检查边界和有效性
            if (this.isValidCarvingPosition(nx, ny)) {
                // 打通当前点和下一个点之间的墙
                this.maze[x + direction.dx][y + direction.dy] = 0;
                this.carvePath(nx, ny);
            }
        }
    }

    private isValidCarvingPosition(x: number, y: number): boolean {
        // 确保位置在迷宫范围内且是奇数坐标
        return x > 0 && y > 0 &&
            x < this.width - 1 &&
            y < this.height - 1 &&
            x % 2 === 1 &&
            y % 2 === 1 &&
            this.maze[x][y] === 1;
    }

    // 获取迷宫数据
    public getMaze(): number[][] {
        return this.maze;
    }

    // 获取出口位置
    public getExitPosition(): { x: number, y: number } {
        return this.exitPosition;
    }
}
