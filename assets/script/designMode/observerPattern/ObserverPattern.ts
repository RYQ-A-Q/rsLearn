import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { AudioConfig } from 'db://assets/RS/core/config/AudioConfig';
import { UIController } from 'db://assets/src/Controller/UiController';
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
    private addNums = 0
    start() {
        this.observer = rs.event.category("ObserverPattern")
        this.observer.on("updateAttribute", this.updateAttributeUI, this)
        this.observer.on("changeHp", this.changeHp, this)
        this.observer.on("changeHp", this.addUpNums, this)
        this.observer.on("changeMp", this.changeMp, this)
        this.observer.on("changeMp", this.addUpNums, this)
        this.observer.on("changeAtk", this.changeAtk, this)
        this.observer.on("changeAtk", this.addUpNums, this)
        this.observer.on("moreAchievement", this.moreAchievement, this)
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
    addUpNums() {
        this.addNums++
        this.observer.emit("updateAttribute")
        rs.event.category("ObserverPattern").emit("moreAchievement")//触发成就检测演示
        ///因为顺序上的特殊处理，这里的成就声音就会是正常逻辑触发，而不是延后
    }
    private changeHp(value: number) {
        observerPatternPlayer.hp += value
    }
    private changeMp(value: number) {
        observerPatternPlayer.mp += value
    }
    private changeAtk(value: number) {
        observerPatternPlayer.atk += value
    }
    moreAchievement() {
        if (this.addNums > 0 && this.addNums % 10 == 0) {
            console.log(`累计加点：${this.addNums}次`);
            UIController.normalMessage(`累计加点：${this.addNums}次`, 2)
            rs.audio.playEffect(AudioConfig.getUi(rs.enum.FileName_audioUi.success2))
        }

    }
}


