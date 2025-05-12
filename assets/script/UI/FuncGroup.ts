import { _decorator, Camera, Component, EventTouch, Input, input, instantiate, Label, Node, Prefab, UITransform, Vec2, Vec3, warn } from 'cc';
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
    @property(Node)
    testNode: Node
    @property([Node])
    dragTestNodeList: Node[] = []

    ///临时变量区
    private testNodeParentUIT: UITransform
    private isDragging: boolean = false; // 是否正在拖动
    private lastTouchPos: Vec3 = Vec3.ZERO; // 初始触摸位置
    start(): void {
        this.testNodeParentUIT = this.testNode.parent.getComponent(UITransform);
    }
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
    /**显示触摸信息 */
    private globalTouch(e: EventTouch) {
        this.noticeLabeL.string = `当前点击UI坐标：${e.getUILocation()},
        画布下位置${this.canvasUIT.convertToNodeSpaceAR(e.getUILocation().toVec3())}
        功能按钮面板位置${this.node.getComponent(UITransform).convertToNodeSpaceAR(e.getUILocation().toVec3())}
        `
    }
    private unRegisterGlobalTouch() {
        input.off(Input.EventType.TOUCH_START, this.globalTouch, this)
    }
    /**注册拖动节点 */
    private registerDragNode() {
        this.testNode.on(Node.EventType.TOUCH_START, this.dragNode_start, this)
        this.testNode.on(Node.EventType.TOUCH_MOVE, this.dragNode_move, this)
        this.testNode.on(Node.EventType.TOUCH_END, this.dragNode_end, this)
        this.testNode.on(Node.EventType.TOUCH_CANCEL, this.dragNode_end, this)
    }
    /**开始拖动节点 */
    private dragNode_start(e: EventTouch) {
        this.isDragging = true
    }
    /**持续拖动节点 */
    private dragNode_move(e: EventTouch) {
        let pos: Vec2 = new Vec2()
        if (this.isDragging) {
            let newPos = this.testNodeParentUIT.convertToNodeSpaceAR(e.getUILocation().toVec3())
            this.testNode.setPosition(newPos)
        }
        let colliderNode = ""
        let rect1 = this.testNode.getComponent(UITransform).getBoundingBoxToWorld();
        this.dragTestNodeList.forEach(element => {
            let rect2 = element.getComponent(UITransform).getBoundingBoxToWorld()
            if (rect1.intersects(rect2)) {
                colliderNode += element.name + " "
            }
        });
        this.noticeLabeL.string = `节点位置(父)：${this.testNode.position}
        世界位置${this.testNode.worldPosition}
        碰撞到 ${colliderNode}`
    }
    /**结束拖动节点 */
    private dragNode_end(e: EventTouch) {
        this.isDragging = false
    }

    /**取消拖动节点 */
    private unRegisterDragNode() {
        this.testNode.off(Node.EventType.TOUCH_START, this.dragNode_start, this)
        this.testNode.off(Node.EventType.TOUCH_MOVE, this.dragNode_move, this)
        this.testNode.off(Node.EventType.TOUCH_END, this.dragNode_end, this)
        this.testNode.off(Node.EventType.TOUCH_CANCEL, this.dragNode_end, this)
        this.testNode.setPosition(300, 500)
    }

}


