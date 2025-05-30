import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Operate')
export class Operate extends Component {
    addHp() {
        rs.event.category("ObserverPattern").emit("changeHp", 2)
    }
    addMp() {
        rs.event.category("ObserverPattern").emit("changeMp", 0.5)
    }
    addAtk() {
        rs.event.category("ObserverPattern").emit("changeAtk", 1)
    }
}


