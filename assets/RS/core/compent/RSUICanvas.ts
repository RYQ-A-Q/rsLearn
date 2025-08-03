import { _decorator, Component, Node } from 'cc';
import { PopupWindows } from '../script/PopupWindows';
const { ccclass, property } = _decorator;
/**rs框架UI画布 */
@ccclass('RSUICanvas')
export class RSUICanvas extends Component {
    @property({ type: Node, displayName: '普通弹窗父节点' })
    popParent: Node
    @property({ type: Node, displayName: '顶级弹窗父节点' })
    topParent: Node
    @property({ type: [Node], displayName: '普通弹窗父列表' })
    popWindowsPar: Node[] = []
    @property({ type: [Node], displayName: '顶级弹窗父列表' })
    topWindowsPar: Node[] = []
    @property({ type: Node, displayName: '消息弹窗父节点' })
    toastParent: Node
    @property({ type: Node, displayName: '音效节点组' })
    audioSourceGroup: Node

    onLoad(): void {
        this.registerEvent(true)
    }
    protected onDestroy(): void {
        this.registerEvent(false)
    }
    start() {
    }
    registerEvent(register: boolean) {
        const nodeList = [...this.popWindowsPar, ...this.topWindowsPar]
        nodeList.forEach(windowNode => {
            const popWindows = windowNode.getComponent(PopupWindows);
            if (!popWindows) {
                console.warn(windowNode.name + '没有添加PopupWindows组件')
                return
            }
            popWindows.registerEvent(register)
        });
    }

    update(deltaTime: number) {

    }
}


