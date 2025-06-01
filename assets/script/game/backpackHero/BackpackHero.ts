import { _decorator, Component, UITransform, Sprite, Color, EventTouch } from 'cc';
import { Draggable, GoodsItem } from './Draggable';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackpackHero')
export class BackpackHero extends Component {
    private grid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));

    @property([UITransform])
    private backpackItems: UITransform[] = [];

    private backpackArray: UITransform[][] = Array.from({ length: 4 }, () => Array(4).fill(null));

    @property(UITransform)
    private curTouchUIT: UITransform = null;

    private curTouchGoodsItem: GoodsItem = null;
    private curDraggable: Draggable = null;
    private lastValidPos: { x: number, y: number } = null;

    protected onLoad(): void {
        let e = rs.event.category("BackpackHero");
        e.on("playerMove", this.checkCollision, this);
        e.on("placeItem", this.tryPlaceItem, this);
    }

    protected onDestroy(): void {
        let e = rs.event.category("BackpackHero");
        e.off("playerMove", this.checkCollision, this);
        e.off("placeItem", this.tryPlaceItem, this);
    }

    start() {
        this.init();
    }

    init() {
        this.grid.forEach((item, i) => {
            item.forEach((_, j) => {
                this.backpackArray[i][j] = this.backpackItems[i * this.grid.length + j];
            });
        });
        this.updateGridColors();
    }

    private updateGridColors() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const sprite = this.backpackArray[i][j].node.getComponent(Sprite);
                sprite.color = this.grid[i][j] === 0 ? Color.WHITE : new Color(150, 200, 255); // 浅蓝色
            }
        }
    }

    private checkCollision(e: EventTouch) {
        console.log(`当前触摸` + e.target.name)
        this.curTouchUIT = e.target.getComponent(UITransform);
        const draggable = this.curTouchUIT?.node.getComponent(Draggable);
        if (!this.curTouchUIT || !draggable) return;

        this.curTouchGoodsItem = draggable.goodsItem;
        this.curDraggable = draggable;

        let found = false;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const targetTransform = this.backpackArray[row][col];
                if (this.curTouchUIT.getBoundingBoxToWorld().intersects(targetTransform.getBoundingBoxToWorld())) {
                    console.log("碰撞到" + targetTransform.node.name + "," + row + "," + col)
                    this.lastValidPos = { x: row, y: col };
                    this.showCollisionPreview(row, col);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }

    private showCollisionPreview(startRow: number, startCol: number) {
        const shape = this.curTouchGoodsItem.grid;
        const rows = shape.length;
        const cols = shape[0].length;
        let canPlace = true;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const gridVal = shape[i][j];
                const r = startRow + i;
                const c = startCol + j;

                if (gridVal === 1) {
                    if (r >= 4 || c >= 4 || this.grid[r][c] !== 0) {
                        canPlace = false;
                    }
                }
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const sprite = this.backpackArray[i][j].node.getComponent(Sprite);
                if (this.grid[i][j] !== 0) {
                    sprite.color = new Color(150, 200, 255); // 浅蓝
                } else {
                    sprite.color = Color.WHITE;
                }
            }
        }

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                const gridVal = shape[i][j];
                const r = startRow + i;
                const c = startCol + j;

                if (gridVal === 1 && r < 4 && c < 4) {
                    const sprite = this.backpackArray[r][c].node.getComponent(Sprite);
                    sprite.color = canPlace ? new Color(150, 255, 150) : new Color(255, 150, 150); // 绿或红
                }
            }
        }
    }

    private tryPlaceItem(draggable: Draggable) {
        if (!draggable) return;

        // 1️⃣ 清除旧占位（无论成不成功都要清）
        this.clearPreviousPlacement(draggable);

        // 🟥 没有有效放置点，回退
        if (!this.lastValidPos) {
            draggable.resetPosition();
            return;
        }

        const shape = draggable.goodsItem.grid;
        const type = draggable.type;
        const rows = shape.length;
        const cols = shape[0].length;
        const { x: startRow, y: startCol } = this.lastValidPos;
        let canPlace = true;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const gridVal = shape[i][j];
                const r = startRow + i;
                const c = startCol + j;

                if (gridVal === 1) {
                    if (r >= 4 || c >= 4 || this.grid[r][c] !== 0) {
                        canPlace = false;
                    }
                }
            }
        }

        if (canPlace) {
            // ✅ 设置新占位信息
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const gridVal = shape[i][j];
                    const r = startRow + i;
                    const c = startCol + j;
                    if (gridVal === 1) {
                        this.grid[r][c] = type;
                    }
                }
            }

            // ✅ 设置节点位置使其居中放置
            const centerPos = this.getCenterWorldPos(startRow, startCol, shape);
            draggable.node.setWorldPosition(centerPos);
        } else {
            // ❌ 无法放置，回退
            draggable.resetPosition();
        }

        // 🔁 统一刷新
        this.updateGridColors();
        this.lastValidPos = null;
    }
    private clearPreviousPlacement(draggable: Draggable) {
        const shape = draggable.goodsItem.grid;
        const type = draggable.type;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === type) {
                    // 检查该处是否可能属于当前拖动物品
                    // 防止误清除同类型其他物品（可扩展添加唯一 ID 解决）
                    this.grid[row][col] = 0;
                }
            }
        }
    }
    private getCenterWorldPos(startRow: number, startCol: number, shape: number[][]): Vec3 {
        const rows = shape.length;
        const cols = shape[0].length;

        // 计算格子中心的 worldPosition（以左上角为起点）
        const centerRow = startRow + rows / 2;
        const centerCol = startCol + cols / 2;

        // 格子对象
        const gridTransform = this.backpackArray[Math.floor(centerRow)][Math.floor(centerCol)];

        // 获取该格子在世界空间的中心位置
        return gridTransform.node.getWorldPosition();
    }

}
