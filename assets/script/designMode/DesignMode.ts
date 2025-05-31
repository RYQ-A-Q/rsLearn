import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DesignMode')
export class DesignMode extends Component {
    @property(Node)
    emptyNode: Node;
    start() {

    }
    private openGame(path: string) {
        this.emptyNode.destroyAllChildren()
        rs.resources.load(path, (err, prefab: Prefab) => {
            if (err) {
                console.error("加载预制体失败: ", err);
                return;
            }
            const gameNode = instantiate(prefab);
            this.emptyNode.addChild(gameNode);
            gameNode.setPosition(0, 0, 0);
            gameNode.active = true
        })
    }
    private openCommandPattern() {// 命令模式
        this.openGame("prefab/ui/designMode/commandPattern")
    }
    private openObserverPattern() {//观察者模式
        this.openGame("prefab/ui/designMode/observerPattern")
    }
    private openSingletonPattern() {//单例模式
        this.openGame("prefab/ui/designMode/singletonPattern")
    }
}


