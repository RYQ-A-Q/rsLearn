import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
interface attribute {
    hp: number;
    mp: number;
    atk: number
}
export let observerPatternPlayer: attribute = { hp: 3, mp: 1, atk: 1 }
@ccclass('ObserverPattern')
export class ObserverPattern extends Component {
    @property({ type: [Label] })
    arrtibuteLabel: Label[] = []
    private observer: any
    start() {
        this.observer = rs.event.category("ObserverPattern")
        this.observer.on("updateAttribute", this.updateAttributeUI, this)
        this.observer.on("changeHp", this.changeHp, this)
        this.observer.on("changeMp", this.changeMp, this)
        this.observer.on("changeAtk", this.changeAtk, this)
        this.updateAttributeUI()
    }
    protected update(dt: number): void {
        this.updateAttributeUIAllways()
    }
    protected onDestroy(): void {
        rs.event.category("ObserverPattern").clear()//清除事件记录
    }
    private updateAttributeUIAllways() {
        this.arrtibuteLabel[3].string = `${observerPatternPlayer.hp}`
        this.arrtibuteLabel[4].string = `${observerPatternPlayer.mp}`
        this.arrtibuteLabel[5].string = `${observerPatternPlayer.atk}`
    }
    private updateAttributeUI() {
        this.arrtibuteLabel[0].string = `${observerPatternPlayer.hp}`
        this.arrtibuteLabel[1].string = `${observerPatternPlayer.mp}`
        this.arrtibuteLabel[2].string = `${observerPatternPlayer.atk}`
    }
    private changeHp(value: number) {
        observerPatternPlayer.hp += value
        this.observer.emit("updateAttribute")
    }
    private changeMp(value: number) {
        observerPatternPlayer.mp += value
        this.observer.emit("updateAttribute")
    }
    private changeAtk(value: number) {
        observerPatternPlayer.atk += value
        this.observer.emit("updateAttribute")
    }


}


