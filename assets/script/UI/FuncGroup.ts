import { _decorator, Camera, Component, EventTouch, Input, input, instantiate, Label, Node, Prefab, UITransform, warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FuncGroup')
export class FuncGroup extends Component {
    @property(UITransform)
    canvasUIT: UITransform
    @property(Camera)
    camara: Camera
    @property(Node)
    root: Node
    @property({ type: Label })
    noticeLabeL: Label
    private virtualList() {
        let path = 'prefab/ui/func/virtualList'
        rs.resources.load(path, Prefab, (err, prefab) => {
            let node = instantiate(prefab)
            if (err || !prefab) {
                warn(`[FuncGroup] 加载虚拟列表失败：${path}`, err)
                return
            }
            this.root.addChild(node)
            node.active = true
        })
    }
    private registerGlobalTouch() {
        input.on(Input.EventType.TOUCH_START, this.globalTouch, this)
    }
    private globalTouch(e: EventTouch) {
        this.noticeLabeL.string = `当前点击UI坐标：${e.getUILocation()},
        画布下位置${this.canvasUIT.convertToNodeSpaceAR(e.getUILocation().toVec3())}
        功能按钮面板位置${this.node.getComponent(UITransform).convertToNodeSpaceAR(e.getUILocation().toVec3())}
        `
    }
    private unRegisterGlobalTouch() {
        input.off(Input.EventType.TOUCH_START, this.globalTouch, this)
    }
}


