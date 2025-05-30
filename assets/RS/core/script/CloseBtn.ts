import { _decorator, Component, Event, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloseBtn')
export class CloseBtn extends Component {
    @property({ displayName: "用于关闭自身", tooltip: "是否关闭自身节点，为true时关闭自身，false时关闭父节点" })
    private isCloseSelf: boolean = false
    @property({ displayName: "是否直接销毁目标" })
    private destroyTarget: boolean = true
    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.closeEvent, this)
    }
    private closeEvent(event: Event) {
        if (this.isCloseSelf) {
            this.node.active = false
        } else {
            this.node.parent.active = false
        }
        event.propagationStopped = true
        if (this.destroyTarget) {
            if (this.isCloseSelf) {
                this.node.destroy()
            }else {
                this.node.parent.destroy()
            }
        }
    }
}


