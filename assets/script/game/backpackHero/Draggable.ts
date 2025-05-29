import { _decorator, Component, EventTouch, Input, UITransform, Vec3, input } from 'cc';
const { ccclass, property } = _decorator;
export class GoodsItem {
    /**放置占格：二维数组，如 [[1, 0], [1, 0]] 表示两行两列的 L 形 */
    grid: number[][] = [[1, 0], [1, 0]];
}

@ccclass('Draggable')
export class Draggable extends Component {
    @property({ max: 4, min: 1, step: 1 })
    type: number = 1
    private uiTransform: UITransform;
    private isDragging: boolean = false;
    goodsItem: GoodsItem = new GoodsItem();
    lv: number = 0
    onLoad() {
        this.uiTransform = this.node.parent.getComponent(UITransform);
        this.registerDragEvents();
        this.initGoodItem()
    }
    initGoodItem() {
        if (this.type == 1) {
            this.goodsItem.grid = [[1, 0, 0, 0]];
        } else if (this.type == 2) {
            this.goodsItem.grid = [[1, 0], [1, 0]]; // 2行1列
        } else if (this.type == 3) {
            this.goodsItem.grid = [[1, 1], [1, 0]];
        } else if (this.type == 4) {
            this.goodsItem.grid = [[1, 1], [1, 1]];
        }
    }


    private registerDragEvents() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(e: EventTouch) {
        this.isDragging = true;
    }

    private onTouchMove(e: EventTouch) {
        if (!this.isDragging) return;

        const touchPos = e.getUILocation().toVec3();
        const localPos = this.uiTransform.convertToNodeSpaceAR(touchPos);
        this.node.setPosition(localPos);
        rs.event.category("BackpackHero").emit("playerMove", e)
    }

    private onTouchEnd(e: EventTouch) {
        this.isDragging = false;
        rs.event.category("BackpackHero").emit("placeItem", this);
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
