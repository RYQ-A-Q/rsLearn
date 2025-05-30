import { _decorator, Component, Node } from 'cc';
import { UIController } from 'db://assets/src/Controller/UiController';
import { observerPatternPlayer } from './ObserverPattern';
const { ccclass, property } = _decorator;
@ccclass('Message')
export class Message extends Component {
    onLoad(): void {
        rs.event.category("ObserverPattern").on("changeHp", this.hp, this)
        rs.event.category("ObserverPattern").on("changeMp", this.mp, this)
        rs.event.category("ObserverPattern").on("changeAtk", this.atk, this)
    }
    onDestroy(): void {
        rs.event.category("ObserverPattern").off("changeHp", this.hp, this)
        rs.event.category("ObserverPattern").off("changeMp", this.mp, this)
        rs.event.category("ObserverPattern").off("changeAtk", this.atk, this)
    }

    ///
    ///因为通知顺序不定，所以在这里演示的时候会出现满足条件但是没有弹对应消息的情况，这也是观察者模式的弊端
    ///所以对于数值变化检测的事件，应该在完成数值变化后再按事件检测先后发送其它的相关事件检测
    ///

    private hp() {
        if (observerPatternPlayer.hp % 5 == 0) {
            UIController.normalMessage(`生命值到达了${observerPatternPlayer.hp}`, 0.5)
        }
    }
    private mp() {
        if (observerPatternPlayer.mp % 3 == 0) {
            UIController.normalMessage(`魔力值到达了${observerPatternPlayer.mp}`, 0.5)
        }
    }
    private atk() {
        if (observerPatternPlayer.atk % 6 == 0) {
            UIController.normalMessage(`攻击力到达了${observerPatternPlayer.atk}`, 0.5)
        }
    }
}


