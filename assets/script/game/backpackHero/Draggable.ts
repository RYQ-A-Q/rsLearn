import { _decorator, Component, EventTouch, Input, UITransform, Vec3, input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draggable')
export class Draggable extends Component {
    private uiTransform: UITransform;
    private isDragging: boolean = false;

    onLoad() {

        this.uiTransform = this.node.parent.getComponent(UITransform);
        this.registerDragEvents();
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
        rs.event.category("BackpackHero").emit("playerMove",e)
    }

    private onTouchEnd(e: EventTouch) {
        this.isDragging = false;
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
