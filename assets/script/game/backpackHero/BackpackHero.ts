import { Sprite } from 'cc';
import { Color } from 'cc';
import { UITransform } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { EventTouch } from 'cc';
import { Draggable, GoodsItem } from './Draggable';
const { ccclass, property } = _decorator;

@ccclass('BackpackHero')
export class BackpackHero extends Component {
    private grid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0))
    @property([UITransform])
    private backpackItems: UITransform[] = [];
    @property(UITransform)
    private curTouchUIT: UITransform = null;
    private curTouchGoodsItem: GoodsItem = null;
    protected onLoad(): void {
        let e = rs.event.category("BackpackHero")
        e.on("playerMove", this.checkCollision, this)
        e.on("placeItem", this.tryPlaceItem, this)
    }
    protected onDestroy(): void {
        rs.event.category("BackpackHero").off("playerMove", this.checkCollision, this)
    }
    start() {

    }

    update(deltaTime: number) {

    }
    private checkCollision(e: EventTouch) {
        this.curTouchUIT = e.target.getComponent(UITransform);
        const draggable = this.curTouchUIT?.node.getComponent(Draggable);
        if (!this.curTouchUIT || !draggable) return;

        this.curTouchGoodsItem = draggable.goodsItem;
        const type = draggable['type'];
        const gridShape = this.curTouchGoodsItem.grid;
        const rows = gridShape.length;
        const cols = gridShape[0].length;

        // 找到第一个碰撞的 backpackItem 的位置
        for (let i = 0; i < this.backpackItems.length; i++) {
            const item = this.backpackItems[i];
            if (item.getBoundingBoxToWorld().intersects(this.curTouchUIT.getBoundingBoxToWorld())) {
                const startRow = Math.floor(i / 4);
                const startCol = i % 4;

                // 先全部重置颜色
                this.backpackItems.forEach(ui => ui.getComponent(Sprite).color = new Color("#FFFFFFAF"));

                // 检查每一个相对格子
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (gridShape[r][c] === 1) {
                            const gridR = startRow + r;
                            const gridC = startCol + c;
                            if (gridR < 4 && gridC < 4) {
                                const gridVal = this.grid[gridR][gridC];
                                const index = gridR * 4 + gridC;
                                const uiItem = this.backpackItems[index];
                                if (gridVal === 0 || gridVal === type) {
                                    uiItem.getComponent(Sprite).color = new Color("#AAF1A4AF"); // 绿色
                                } else {
                                    uiItem.getComponent(Sprite).color = new Color("#F88F8FAF"); // 红色
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    private tryPlaceItem(draggable: Draggable) {
        const type = draggable.type;
        const gridShape = draggable.goodsItem.grid;
        const rows = gridShape.length;
        const cols = gridShape[0].length;

        for (let i = 0; i < this.backpackItems.length; i++) {
            const item = this.backpackItems[i];
            if (item.getBoundingBoxToWorld().intersects(this.curTouchUIT.getBoundingBoxToWorld())) {
                const startRow = Math.floor(i / 4);
                const startCol = i % 4;

                let canPlace = true;

                // 检查是否合法
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (gridShape[r][c] === 1) {
                            const gridR = startRow + r;
                            const gridC = startCol + c;
                            if (gridR >= 4 || gridC >= 4 || this.grid[gridR][gridC] !== 0) {
                                canPlace = false;
                                break;
                            }
                        }
                    }
                    if (!canPlace) break;
                }

                // 放置
                if (canPlace) {
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < cols; c++) {
                            if (gridShape[r][c] === 1) {
                                const gridR = startRow + r;
                                const gridC = startCol + c;
                                this.grid[gridR][gridC] = type;
                                const index = gridR * 4 + gridC;
                                this.backpackItems[index].getComponent(Sprite).color = new Color("#AADDFFFF"); // 浅蓝
                            }
                        }
                    }
                    console.log("放置成功，当前grid：", JSON.stringify(this.grid));
                }

                break;
            }
        }
    }

}


