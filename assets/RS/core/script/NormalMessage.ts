import { UITransform } from 'cc';
import { RichText } from 'cc';
import { _decorator, Component, Label, Node, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NormalMessage')
export class NormalMessage extends Component {
    @property(RichText)
    private text: RichText
    @property({ type: [UITransform], displayName: "0背景 1文本" })
    private UITList: UITransform[] = []

    private _stayDuration: number = 1;
    private _currentTween: Tween<Node> = null;

    /**
     * 显示消息
     * @param message 显示内容
     * @param duration 停留时间（秒），默认0.5
     */
    public show(message: string, duration: number = 0.5) {
        this.stopAni();
        this._stayDuration = duration;
        this.text.string = message;
        this.UITList[0].setContentSize(this.UITList[1].contentSize.width * 4, this.UITList[1].contentSize.width)
        this.playShowAnim();
    }

    private playShowAnim() {
        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
        }

        this.node.active = true;
        this.node.scale = new Vec3(0, 0, 1); // 初始缩放为0

        this._currentTween = tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }) // 弹出效果
            .delay(this._stayDuration) // 停留
            .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })  // 收回
            .call(() => {
                this._currentTween = null;
                this.node.active = false;
            })
            .start();
    }
    onDisable(): void {
        this.stopAni();
    }
    /** 中断动画 */
    private stopAni() {
        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
        }
    }
}
