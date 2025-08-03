import { _decorator, Component, Layout, math, Node, screen, tween, Tween, UIOpacity, UITransform, view, Widget } from 'cc';
const { ccclass, property, executionOrder } = _decorator;
/**自动化适配,自身挂载widget，设置对齐响应为ALWAYS，并且设置屏幕占比，左右顶底均设置百分比，锁死，
 * 注意！！！ 其下一级子类除满铺背景外尽量不使用widget的全拉伸（四点全设置），容易出现适配后布局错误，
 * 子节点使用widget的单边对齐的话，请设置ALWAYS模式，否则会出问题
 * 子节点背景的widget也设置为AlWAYS，且left、right、top、bottom均设置为0
 * 如果设置了countNodes，则只计算countNodes列表中的节点宽高
 * 不使用countNodes时，自动使用已激活的子节点（排除excludeNodes列表节点）
 */
@ccclass('AutomaticAdaptation')
export class AutomaticAdaptation extends Component {
    private isHorizontal: boolean = false;
    private selfLayout: Layout
    private selfWidget: Widget
    private isAutoIng: boolean = false;
    private oldResolution: math.Size = new math.Size(1, 1)
    @property({ displayName: "是否打印信息" })
    private isPrintInfo: boolean = false;
    @property({ displayName: "忽略自身布局组件" })
    private ignoreLayout: boolean = false;
    @property({ displayName: "取更大比例", tooltip: "基本上都为为false" })
    private selectGreater: boolean = false;
    @property({ type: [Node], displayName: "排除节点", tooltip: "不参与计算宽高的子节点" })
    private excludeNodes: Node[] = []
    @property({ type: [Node], displayName: "计算节点", tooltip: "参与计算的节点，如果设置了计算节点列表，则忽略排除节点" })
    private countNodes: Node[] = []
    private uiOpacity: UIOpacity
    private tweenCache: Tween<UIOpacity> = null
    start() {

        this.uiOpacity = this.node.getComponent(UIOpacity);
        if (!this.uiOpacity) {
            this.uiOpacity = this.node.addComponent(UIOpacity);
        }
        this.selfWidget = this.node.getComponent(Widget);
        if (!this.selfWidget || this.selfWidget.alignMode != Widget.AlignMode.ALWAYS) {
            console.warn("AutomaticAdaptation:挂载的widget组件的alignMode请设置为ALWAYS")
            console.log(this.node.name + ":请将widget组件的alignMode设置为ALWAYS")
            return
        }
        if (this.selfWidget.left < 0 || this.selfWidget.right < 0 || this.selfWidget.top < 0 || this.selfWidget.bottom < 0) {
            console.warn("AutomaticAdaptation:widget组件的left、right、top、bottom为负")
            console.log(this.node.name + ":请将widget组件的left、right、top、bottom设置为正数")
            return
        }
        if (this.isPrintInfo) {
            console.log(`${this.node.name}— ${this.selfWidget.left}:${this.selfWidget.right};${this.selfWidget.top}:${this.selfWidget.bottom}`)
        }
        this.selfLayout = this.node.getComponent(Layout);
        screen.on('window-resize', this.prePareAdjust, this);
        this.prePareAdjust();
        rs.event.category("gameAction_autoAdaptation").on("refresh", this.autoAdjustPanel, this)
        this.uiOpacity.opacity = 0
        this.tweenCache = tween(this.uiOpacity)
            .to(0.3, { opacity: 255 }, { easing: 'backOut' })
    }
    onDestroy(): void {
        if (this.tweenCache) {
            this.tweenCache.stop();
        }
        screen.off('window-resize', this.prePareAdjust, this);
        rs.event.category("gameAction_autoAdaptation").off("refresh", this.autoAdjustPanel, this)
        this.unscheduleAllCallbacks()
    }
    onEnable(): void {
        this.autoAdjustPanel()
    }

    update(deltaTime: number) {
        if (!this.oldResolution.equals(screen.resolution)) {
            this.autoAdjustPanel()
        }
    }
    private prePareAdjust() {
        if (this.isAutoIng) {
            return
        }
        this.unscheduleAllCallbacks()
        this.isAutoIng = true
        // this.scheduleOnce(() => {
        this.autoAdjustPanel()
        // }, 0.1)
    }
    private autoAdjustPanel() {
        if (this.tweenCache) {
            this.tweenCache.start()
        }
        if (this.isPrintInfo) {
            console.log(`屏幕${screen.resolution.width.toFixed(1)}:${screen.resolution.height.toFixed(1)}`)
        }
        if (screen.resolution.width > screen.resolution.height * 1.2) {//横版
            this.isHorizontal = true
        } else {
            this.isHorizontal = false
        }
        this.node.setScale(1, 1, 1)
        if (this.isHorizontal) {
            if (this.selfLayout && !this.ignoreLayout) {
                this.selfLayout.type = Layout.Type.HORIZONTAL
            }
            this.scheduleOnce(() => {
                this.calucateHorizontal()
                this.scheduleOnce(() => {
                    this.calucateHorizontal()
                    this.isAutoIng = false
                    this.oldResolution.set(screen.resolution.width, screen.resolution.height)
                }, 0.1)
            }, 0.2)

        } else {//竖版
            if (this.selfLayout && !this.ignoreLayout) {
                this.selfLayout.type = Layout.Type.VERTICAL
            }
            this.scheduleOnce(() => {
                this.calucateVertical()
                this.scheduleOnce(() => {
                    this.calucateVertical()
                    this.oldResolution.set(screen.resolution.width, screen.resolution.height)
                    this.isAutoIng = false
                }, 0.1)
            }, 0.2)
        }
    }
    /**横版适配计算，请在改变布局或者响应的后一帧/后一段时间内执行 */
    private calucateHorizontal() {
        let children: Node[] = []
        if (this.countNodes.length == 0) {
            children = this.node.children.filter(child => !this.excludeNodes.includes(child));
            children = children.filter(child => child.active)
        } else {
            children = this.countNodes
        }
        if (children.length == 0) {
            return
        }
        let realGame_height = children.reduce((max, child) => {//高度取子节点最高height
            const ui = child.getComponent(UITransform);
            if (this.isPrintInfo) {
                console.log(`${child.name}:${ui.height}`)
            }
            return ui ? Math.max(max, ui.height) : max;
        }, 0);
        let realGame_width = children.reduce((sum, child) => {//宽度取子节点总width
            const ui = child.getComponent(UITransform);
            return ui ? (sum + ui.width) : sum;
        }, 0);
        if (this.selfLayout && !this.ignoreLayout) {
            realGame_width += this?.selfLayout?.spacingX ?? 0
        }
        // let gamePanel_height = this.node.getComponent(UITransform).height
        // let gamePanel_width = this.node.getComponent(UITransform).width
        let gamePanel_height = view.getVisibleSize().height * (1 - this.selfWidget.top - this.selfWidget.bottom)
        let gamePanel_width = view.getVisibleSize().width * (1 - this.selfWidget.left - this.selfWidget.right)
        if (this.isPrintInfo) {
            console.log(`${this.node.name}:高宽：${realGame_height}:${realGame_width};面板：${gamePanel_height}:${gamePanel_width}`)
        }
        let scaleRatio_height = gamePanel_height / realGame_height//如果小于1,则说明高度实际超范围了
        let scaleRatio_width = gamePanel_width / realGame_width//如果小于1,则说明宽度实际超范围了
        let realScaleRatio = Math.min(scaleRatio_width, scaleRatio_height)
        if (this.selectGreater) {
            realScaleRatio = Math.max(scaleRatio_width, scaleRatio_height)
        }
        if (this.isPrintInfo) {
            console.log(`${this.node.name}:宽高${scaleRatio_width}:${scaleRatio_height};${realScaleRatio}`)
        }
        this.node.setScale(realScaleRatio, realScaleRatio, 1)//等比缩放
        this.scheduleOnce(() => {
            if (this.selfLayout && !this.ignoreLayout) {
                let paddingValue = (this.node.getComponent(UITransform).width - realGame_width) / 2
                this.selfLayout.paddingLeft = Math.max(0, paddingValue)
            }
        })
        if (this.isPrintInfo) {
            console.log(`${this.node.name}:横版-${realScaleRatio}`)
        }
    }
    /**竖版适配计算 */
    private calucateVertical() {
        let children: Node[] = []
        if (this.countNodes.length == 0) {
            children = this.node.children.filter(child => !this.excludeNodes.includes(child));
            children = children.filter(child => child.active)
        } else {
            children = this.countNodes
        }
        if (children.length == 0) {
            return
        }
        let realGame_height = children.reduce((max, child) => {//高度取子节点总height
            const ui = child.getComponent(UITransform);
            return ui ? (max + ui.height) : max;
        }, 0);
        let realGame_width = children.reduce((max, child) => {//宽度取子节点最大width
            const ui = child.getComponent(UITransform);
            return ui ? Math.max(max, ui.width) : max;
        }, 0);
        if (this.selfLayout && !this.ignoreLayout) {
            realGame_height += this?.selfLayout?.spacingY ?? 0
        }
        let gamePanel_height = view.getVisibleSize().height * (1 - this.selfWidget.top - this.selfWidget.bottom)
        let gamePanel_width = view.getVisibleSize().width * (1 - this.selfWidget.left - this.selfWidget.right)
        let scaleRatio_height = gamePanel_height / realGame_height//如果小于1,则说明实际超范围了
        let scaleRatio_width = gamePanel_width / realGame_width//如果小于1,则说明实际超范围了
        let realScaleRatio = Math.min(scaleRatio_width, scaleRatio_height)//适配小的一边
        if (this.selectGreater) {
            realScaleRatio = Math.max(scaleRatio_width, scaleRatio_height)
        }
        if (this.isPrintInfo) {
            console.log(`${this.node.name}-高宽：${realGame_height}:${realGame_width};面板：${gamePanel_height}:${gamePanel_width}`)
        }
        if (this.isPrintInfo) {
            console.log(`${this.node.name}:${scaleRatio_width}:${scaleRatio_height};${realScaleRatio}`)
        }
        this.node.setScale(realScaleRatio, realScaleRatio, 1)//等比缩放
        if (this.isPrintInfo) {
            console.log(`${this.node.name}:竖版-${realScaleRatio}`)
        }
    }
}


