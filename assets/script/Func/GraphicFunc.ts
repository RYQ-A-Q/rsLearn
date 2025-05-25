import { _decorator, Component, Node, EventTouch, UITransform, Vec2, Vec3, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GraphicFunc')
export class GraphicFunc extends Component {
    @property({ type: Graphics })
    G: Graphics;

    @property({ type: UITransform })
    nodeUIT: UITransform;

    private isDragging: boolean = false;

    onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.dragNode_start, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.dragNode_move, this);
        this.node.on(Node.EventType.TOUCH_END, this.dragNode_end, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.dragNode_end, this);
    }

    start() {
        this.init();
    }

    private dragNode_start(e: EventTouch) {
        this.isDragging = true;

        const localPos = this.nodeUIT.convertToNodeSpaceAR(e.getUILocation().toVec3());
        this.G.moveTo(localPos.x, localPos.y);
    }

    private dragNode_move(e: EventTouch) {
        if (!this.isDragging) return;

        const localPos = this.nodeUIT.convertToNodeSpaceAR(e.getUILocation().toVec3());
        this.G.lineTo(localPos.x, localPos.y);
        this.G.stroke();
    }

    private dragNode_end(e: EventTouch) {
        this.isDragging = false;
    }

    init() {
        this.G.clear(); // 清空画布
    }
}
