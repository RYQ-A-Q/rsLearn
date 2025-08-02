import { Vec3 } from 'cc';
import { view } from 'cc';
import { UIOpacity } from 'cc';
import { UITransform } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property({ type: [Node], displayName: "测试" })
    testNode: Node[] = [];
    @property({ type: Node, displayName: "测试2" })
    testTempNode: Node;
    start() {
        // this.scheduleOnce(() => {
        //     this.move()
        // }, 1)
        this.init()
    }

    update(deltaTime: number) {
        // this.testNode.children.forEach((e) => {
        //     e.setPosition(e.position.x - 1 * deltaTime * 100, 0)
        // })
        // this.testTempNode.setPosition(this.testTempNode.position.x - 1 * deltaTime * 100, 0)
        // if(this.testTempNode.position.x<-300){
        //     this.testTempNode.setPosition(400,0)
        // }
    }
    move() {
        // this.testNode
        // this.testNode.children.forEach((e, i) => {
        //     tween(e)
        //         .to(i, {
        //             position: new Vec3(-70.752, 0, 0)
        //         })
        //         .start();
        // });
        // this.testNode.forEach((e, index) => {
        //     tween(e)
        //         .to(157 - index * 20, {
        //             position: new Vec3(-e.getComponent(UITransform).width, 0, 0)
        //         }, {
        //             easing: 'linear'
        //         })
        //         .start();
        // });

    }
    init() {
        this.testTempNode.active = true
        let size = view.getVisibleSize()
        this.testTempNode.getComponent(UITransform).setContentSize(size.width, size.height)
    }
    // 向上翻页后淡出消失
    flipUpAndFadeOut() {
        const duration = 1.0; // 翻页动画持续时间
        const targetY = this.testTempNode.parent.getComponent(UITransform).height + this.testTempNode.getComponent(UITransform).height; // 翻到屏幕外的 y 位置

        // 获取 UIOpacity 组件
        const uiOpacity = this.testTempNode.getComponent(UIOpacity);

        // 使用 tween 动画实现位置和透明度的变化
        tween(this.testTempNode)
            .to(duration, { position: new Vec3(this.testTempNode.position.x, targetY, 0) }, { easing: 'linear' }) // 向上移动
            .start();

        tween(uiOpacity)
            .to(duration, { opacity: 0 }, { easing: 'linear' }) // 逐渐变透明
            .call(() => {
                this.testTempNode.active = false; // 动画结束后隐藏节点
            })
            .start();
    }

    // 向中心放大旋转并淡入显示
    flipDownAndFadeIn() {
        const duration = 0.8;

        // 确保节点激活并重置初始状态
        this.testTempNode.active = true;

        // 获取 UIOpacity 组件
        let uiOpacity = this.testTempNode.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.testTempNode.addComponent(UIOpacity);
        }
        uiOpacity.opacity = 0;

        // 初始透明、缩小、旋转
        this.testTempNode.setScale(new Vec3(0, 0, 0));
        // this.testTempNode.angle=-480
        this.testTempNode.setPosition(0, 0, 0); // 居中

        // 并行动画：透明度+缩放+旋转
        tween(this.testTempNode)
            .to(duration, {
                scale: new Vec3(1, 1, 1),
                angle: 0
            }, { easing: 'cubicOut' })
            .start();
        tween(uiOpacity)
            .to(2, { opacity: 255 }, { easing: 'sineOut' })
            .start();
    }
}


