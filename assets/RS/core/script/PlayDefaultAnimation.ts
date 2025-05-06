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
            this.node.removeFromParent()
            rs.pools.put(this.name, this.node)
        } else {
            if (this.isDestroy) {
                this.node.destroy()
            } else {
                this.node.active = false
            }
        }
    }

}


