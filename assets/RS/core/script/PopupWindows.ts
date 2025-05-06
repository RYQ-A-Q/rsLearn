import { _decorator, CCBoolean, Component, director, Event, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupWindows')
export class PopupWindows extends Component {
    @property(CCBoolean)
    private closeChild: boolean = false
    @property(CCBoolean)
    private banClick: boolean = false
    @property(CCBoolean)
    private autoSize: boolean = true
    onEnable(): void {
        if ((this.closeChild || this.banClick) && this.autoSize) {
            let NoticeCanvas = director.getScene().getChildByName("NoticeCanvas")
            this.node.getComponent(UITransform).width = NoticeCanvas.getComponent(UITransform).width
            this.node.getComponent(UITransform).height = NoticeCanvas.getComponent(UITransform).height
            NoticeCanvas.insertChild(this.node, NoticeCanvas.children.length - 1)
            let NoBgPanel = NoticeCanvas.getChildByName("NoBgPanel")
            let guidePanel = NoBgPanel?.getChildByName("guidePanel")
            if (guidePanel) {
                NoticeCanvas.insertChild(NoBgPanel, NoticeCanvas.children.length - 1)
            }
        }
        if (!this.closeChild && !this.banClick) {// 两个都不满足，即属于弹窗，每次都设置为最后一个
            this.node.parent.insertChild(this.node, this.node.parent.children.length - 1)
        }
        this.node.on(Node.EventType.TOUCH_START, this.blockTouch, this);
    }
    blockTouch(event: Event) {
        event.propagationStopped = true
        if (this.closeChild && !this.banClick) {
            const children = this.node.children.slice(1).reverse();
            for (const child of children) { if (child.active) { child.active = false; break; } }
        }
    }
    update(dt: number): void {
        if (this.closeChild || this.banClick) {
            this.node.active = this.node.children.slice(1).some(child => child.active)
        }
    }
    onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.blockTouch, this);
    }
}


