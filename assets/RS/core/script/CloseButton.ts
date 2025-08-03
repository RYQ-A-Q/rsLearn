import { Event } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloseButton')
export class CloseButton extends Component {
    @property({ displayName: "关闭目标", tooltip: "不设置时关闭自身" })
    private target: Node

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.closeEvent, this)
    }
    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.closeEvent, this)
    }
    private closeEvent(event: Event) {
        event.propagationStopped = true
        if (!this.target) {
            this.target = this.node
        }
        if (rs.ui.has(this.target.name)) {
            rs.ui.close(this.target.name)
        } else {
            this.target.destroy()
        }
    }
}


