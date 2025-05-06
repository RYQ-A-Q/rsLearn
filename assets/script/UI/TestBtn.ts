import { _decorator, Component } from 'cc';
import { AudioConfig } from '../../RS/core/config/AudioConfig';
const { ccclass, property } = _decorator;

@ccclass('TestBtn')
export class TestBtn extends Component {
    private index = 0
    start() {

    }
    clickBtn() {
        let names = Object.keys(rs.enum.FileName_audioUi)
        this.index = (this.index + 1) % names.length
        rs.audio.playEffect(AudioConfig.getUi(rs.enum.FileName_audioUi[names[this.index]]))
    }
}


