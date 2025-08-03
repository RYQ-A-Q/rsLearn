import { _decorator, Animation, CCBoolean, Component } from 'cc';
// import { DataController } from '../../Controller/DataController';
const { ccclass, property } = _decorator;

@ccclass('PlayDefaultAnimation')
export class PlayDefaultAnimation extends Component {
    @property(Animation)
    selfAni: Animation
    @property(CCBoolean)
    isDestroy: boolean = true
    onEnable(): void {
        if (!this.selfAni) {
            this.selfAni = this.getComponent(Animation)
        }
        this.selfAni.play(this.selfAni.defaultClip.name)
    }
    recycle() {
        this.selfAni.stop()
        if (rs.pools.has(this.node.name)) {
            this.node.active = false
            this.node.removeFromParent()
        } else {
            if (this.isDestroy) {
                if (rs.ui.has(this.node.name)) {
                    rs.ui.close(this.node.name)
                } else {
                    this.node.destroy()
                }
            } else {
                this.node.active = false
            }
        }
    }

}


