import { Prefab, Event } from 'cc';
import { NodeEventType } from 'cc';
import { instantiate } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component {
    @property({ type: Label })
    noticeLabel: Label;
    @property({ type: Node })
    routerNode: Node;
    @property({ type: Node })
    emptyNode: Node;
    start() {

    }

    update(deltaTime: number) {

    }

    private openGame(path: string) {
        this.emptyNode.destroyAllChildren()
        rs.resources.load(path, (err, prefab: Prefab) => {
            if (err) {
                console.error("加载游戏预制体失败: ", err);
                return;
            }
            const gameNode = instantiate(prefab);
            this.emptyNode.addChild(gameNode);
            gameNode.setPosition(0, 0, 0);
            gameNode.active = true
            gameNode.on(Node.EventType.ACTIVE_CHANGED, this.changeSelfState, this);
            this.changeSelfState(null);
        })
    }
    private openMaze() {
        this.openGame("prefab/ui/game/Maze")
    }
    private openBackpackHero(){
        this.openGame("prefab/ui/game/BackpackHero")
    }
    private changeSelfState(e: Node) {
        if (e == null) {
            this.node.active = false
            this.noticeLabel.node.active = false;
            this.routerNode.active = false;
            return
        } else {
            this.node.active = !e.active
            this.noticeLabel.node.active = !e.active
            this.routerNode.active = !e.active
        }
    }
}


