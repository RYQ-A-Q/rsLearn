import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('newTest')
export class newTest extends Component {
    cd: number = 10
    time: number = 0;
    isPause: boolean = false;
    start() {
        if (!rs.FinishLoad) {
            console.log('加载框架中')
            rs.loader()
        }
    }
    changePauseStatus() {
        this.isPause = !this.isPause
    }
    countdowntimer() {
        console.log('倒计时开始')
        this.time = this.cd
        this.schedule(this.countdown, 1)
    }
    countdown() {
        if (this.isPause) {
            return
        }
        console.log('倒计时')
        this.time--
        if (this.time <= 0) {
            console.log('倒计时结束')
            this.unschedule(this.countdown)
        }
    }
}


