import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VerifyPanel')
export class VerifyPanel extends Component {
    @property(Label)
    title: Label = null;
    @property(Label)
    content: Label = null;
    @property(Node)
    yesBtn: Node = null;
    @property(Node)
    cancelBtn: Node = null;
    private callback: (isConfirmed: boolean) => void = null;
    /**已经回调标识 */
    hadCallback: boolean = false;
    private currentTween: any = null;
    protected onEnable(): void {
        this.playPopUpAnim()
    }
    private playPopUpAnim() {
        if (this.currentTween) {
            this.currentTween.stop()
            this.currentTween = null
        }

        this.node.setScale(new Vec3(0.4, 0.4, 1))
        this.currentTween = tween(this.node)
            .to(0.2, { scale: new Vec3(1.05, 1.05, 1) }, { easing: 'backOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.currentTween = null
            })
            .start()
    }
    /**
     * 初始化面板
     * @param title 标题文本
     * @param content 内容文本
     * @param callback 回调函数，参数为是否确认
     */
    init(title: string, content: string, callback: (isConfirmed: boolean) => void) {
        this.title.string = title;
        this.content.string = content;
        this.callback = callback;
        this.hadCallback = false
        this.yesBtn.off(Node.EventType.TOUCH_END);
        this.cancelBtn.off(Node.EventType.TOUCH_END);
        this.yesBtn.on(Node.EventType.TOUCH_END, this.onYesClicked, this);
        this.cancelBtn.on(Node.EventType.TOUCH_END, this.onCancelClicked, this);
    }

    private onYesClicked() {
        if (this.callback) {
            this.callback(true);
            this.hadCallback = true
        }
        this.closePanel();
    }

    private onCancelClicked() {
        if (this.callback) {
            this.callback(false);
            this.hadCallback = true
        }
        this.closePanel();
    }

    private closePanel() {
        this.node.active = false
        if (this.currentTween) {
            this.currentTween.stop()
            this.currentTween = null
        }
    }
    protected onDisable(): void {
        if (!this.hadCallback) {
            this.callback(false)
        }
    }
    onDestroy(): void {
        if (!this.hadCallback) {
            this.callback(false)
        }
        if (this.currentTween) {
            this.currentTween.stop()
            this.currentTween = null
        }
    }
}
