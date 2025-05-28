import { _decorator, Component, Tween, tween, v3, Vec3, Quat, v3 as vec3, Node, quat } from "cc";
const { ccclass, property } = _decorator;

@ccclass('GameActor')
export class GameActor extends Component {

    private activeTween: Tween<Node> | null = null;

    private originalPosition: Vec3 = new Vec3();
    private originalRotation: Vec3 = new Vec3();

    constructor(name: string) {
        super();
    }
    protected onLoad(): void {
        this.recordOriginalTransform();
    }
    private stopCurrentTween() {
        if (this.activeTween) {
            this.activeTween.stop();
            this.activeTween = null;
        }
    }

    private recordOriginalTransform() {
        this.originalPosition.set(this.node.position);
        this.originalRotation.set(this.node.eulerAngles);
    }

    jump() {
        console.log(`${this.node.name} jumps!`);
        this.stopCurrentTween();

        const jumpHeight = 100;
        const upPos = vec3(this.node.x, this.node.y + jumpHeight, this.originalPosition.z);

        this.activeTween = tween(this.node)
            .to(0.35, { position: upPos }, { easing: 'quadOut' })
            .to(0.4, { position: this.originalPosition }, { easing: 'quadIn' })
            .call(() => this.activeTween = null)
            .start();
    }

    attack() {
        console.log(`${this.node.name} attacks!`);
        this.stopCurrentTween();

        const spin = this.originalRotation.clone();
        spin.z += 720; // 转两圈

        this.activeTween = tween(this.node)
            .to(0.6, { eulerAngles: spin }, { easing: 'quadOut' })
            .to(0.45, { eulerAngles: this.originalRotation }, { easing: 'quadIn' })
            .call(() => this.activeTween = null)
            .start();
    }

    undoJump() {
        console.log(`${this.node.name} undo jump.`);
        this.stopCurrentTween();
        this.node.setPosition(this.originalPosition);
    }

    undoAttack() {
        console.log(`${this.node.name} undo attack.`);
        this.stopCurrentTween();
        this.node.setRotationFromEuler(this.originalRotation);
    }
}
