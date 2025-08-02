import { _decorator, CCBoolean, Component, Event, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupWindows')
export class PopupWindows extends Component {
    @property({ displayName: '空白关闭', tooltip: "点击空白处关闭" })
    private touchClose: boolean = false
    @property({ displayName: '禁止点击穿透' })
    private banClick: boolean = false
    onEnable(): void {
        this.handleAddChild()
        this.node.on(Node.EventType.TOUCH_END, this.blockTouch, this);
    }
    onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.blockTouch, this);
    }
    /**用于顶级窗口事件注册 */
    registerEvent(register: boolean = true) {
        if (register) {
            this.node.on(Node.EventType.CHILD_ADDED, this.handleAddChild, this)
            this.node.on(Node.EventType.CHILD_REMOVED, this.handleActiveAction, this);
        } else {
            this.node.off(Node.EventType.CHILD_ADDED, this.handleAddChild, this);
            this.node.off(Node.EventType.CHILD_REMOVED, this.handleActiveAction, this);
        }
    }
    /**事件阻拦 */
    blockTouch(event: Event) {
        event.propagationStopped = true
        if (this.touchClose && !this.banClick) {
            const children = this.node.children.slice(1).reverse();
            for (const child of children) { if (child.active) { child.active = false; break; } }
        }
    }
    /**处理子节点增加后弹窗反馈*/
    handleAddChild() {
        this.node.setSiblingIndex(this.node.parent.children.length - 1)// 设置在最后一位
    }
    /**处理子节点移除后弹窗反馈*/
    handleActiveAction() {
        this.node.active = this.node.children.slice(1).some(child => child.active)
    }
}


