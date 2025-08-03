import { _decorator, Button, CCFloat, Enum, EventTouch } from 'cc';
import { AudioConfig } from '../config/AudioConfig';
import { enumMgr } from '../Managers/EnumMgr';
const { ccclass, property } = _decorator;
@ccclass('ButtonExt_Normal')
export class ButtonExt_Normal extends Button {
    @property({ displayName: "是否开启音效" })
    switchAudio: boolean = true;
    @property({ type: Enum(rs.enum.FileName_audioUi) })
    clickAudio: string = enumMgr.FileName_audioUi.btn_normalClick;
    @property({ type: CCFloat, min: 0, max: 1, displayName: "音量" })
    volume: number = 1;
    _onTouchBegan(event?: EventTouch): void {
        if (this.switchAudio) {
            rs.audio.playEffect(AudioConfig.getUi(rs.enum.FileName_audioUi[this.clickAudio]), this.volume, true)
        }
        super._onTouchBegan(event);
    }
}


