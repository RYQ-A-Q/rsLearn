import { Sprite } from 'cc';
import { Color } from 'cc';
import { UITransform } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackpackHero')
export class BackpackHero extends Component {
    @property([UITransform])
    private backpackItems: UITransform[] = [];
    @property(UITransform)
    private curTouchUIT: UITransform = null;
    protected onLoad(): void {
        let e = rs.event.category("BackpackHero")
        e.on("playerMove", this.checkCollision, this)
    }
    protected onDestroy(): void {
        rs.event.category("BackpackHero").off("playerMove", this.checkCollision, this)
    }
    start() {

    }

    update(deltaTime: number) {

    }
    /**检查碰撞 */
    private checkCollision() {
        if (!this.curTouchUIT) { return; }
        this.backpackItems.forEach(item => {
            if (item.getBoundingBoxToWorld().intersects(this.curTouchUIT.getBoundingBoxToWorld())) {
                console.log(item.node.name + "碰撞");
                item.getComponent(Sprite).color = new Color("#AAF1A4AF")
            } else {
                item.getComponent(Sprite).color = new Color("#FFFFFFAF")
            }
        });
    }
}


