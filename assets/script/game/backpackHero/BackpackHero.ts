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
    start() {

    }

    update(deltaTime: number) {
        this.checkCollision()

    }
    /**检查碰撞 */
    private checkCollision() {
        if (!this.curTouchUIT) { return; }
        this.backpackItems.forEach(item => {
            if (item.getBoundingBoxToWorld().intersects(this.curTouchUIT.getBoundingBoxToWorld())) {
                console.log(item.name + "碰撞");
                item.getComponent(Sprite).color = new Color("#AAF1A4AF")
            } else {
                item.getComponent(Sprite).color = new Color("#FFFFFFAF")
            }
        });
    }
}


