import { _decorator, CCBoolean, Component, Event, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupWindows')
export class PopupWindows extends Component {
    @property({ displayName: '空白关闭', tooltip: "点击空白处关闭" })
    private touchClose: boolean = false
    @property({ displayName: '禁止点击穿透' })
    private banClick: boolean = false
    onEnable(): void {
        // if ((this.touchClose || this.banClick)) {
        //     let NoticeCanvas = rs.noticeCanvas
        //     this.node.getComponent(UITransform).width = NoticeCanvas.getComponent(UITransform).width
        //     this.node.getComponent(UITransform).height = NoticeCanvas.getComponent(UITransform).height
        //     NoticeCanvas.insertChild(this.node, NoticeCanvas.children.length - 1)
        //     let NoBgPanel = NoticeCanvas.getChildByName("NoBgPanel")
        //     let guidePanel = NoBgPanel?.getChildByName("guidePanel")
        //     if (guidePanel) {
        //         NoticeCanvas.insertChild(NoBgPanel, NoticeCanvas.children.length - 1)
        //     }
        // }
        // if (!this.touchClose && !this.banClick) {// 两个都不满足，即属于弹窗，每次都设置为最后一个
        //     this.node.parent.insertChild(this.node, this.node.parent.children.length - 1)
        // }
        // this.node.on(Node.EventType.TOUCH_START, this.blockTouch, this);
    }
    blockTouch(event: Event) {
        event.propagationStopped = true
        // if (this.touchClose && !this.banClick) {
        //     const children = this.node.children.slice(1).reverse();
        //     for (const child of children) { if (child.active) { child.active = false; break; } }
        // }
    }
    update(dt: number): void {
        if (this.touchClose || this.banClick) {
            this.node.active = this.node.children.slice(1).some(child => child.active)
        }
    }
    onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.blockTouch, this);
    }
}


