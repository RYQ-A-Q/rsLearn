import { _decorator, Component, director, Node } from 'cc';
import { SceneEnum } from '../../src/config/SceneEnum';
const { ccclass, property } = _decorator;
/**主场景跳转 */
@ccclass('SceneLoader')
export class SceneLoader extends Component {
    @property({ type: SceneEnum, displayName: "场景名" })
    sceneName: SceneEnum = SceneEnum.start;
    start() {
        this.node.on(Node.EventType.TOUCH_END, this.loadScene, this);

    }
    loadScene() {
        director.loadScene(this.sceneName)
    }
}


