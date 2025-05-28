import { input } from 'cc';
import { GameActor } from './GameActor';
import { InputHandler } from './InputHandler';
import { _decorator, Component, Node } from 'cc';
import { Input } from 'cc';
import { EventKeyboard } from 'cc';
import { KeyCode } from 'cc';
import { Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CommandPattern')
export class CommandPattern extends Component {
    private controlKeyCode: KeyCode[] = [KeyCode.KEY_J, KeyCode.KEY_A, KeyCode.KEY_Z]
    private inputHandler: InputHandler;
    @property(Label)
    notice: Label
    @property(Label)
    commonListList: Label
    @property(Label)
    keyTips: Label
    @property(GameActor)
    actor: GameActor
    onLoad() {
        this.commonListList.string = "当前无操作";
        this.inputHandler = new InputHandler(this.actor);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.keyTips.string = `${this.keyCodeToChar(this.controlKeyCode[0])}跳   ${this.keyCodeToChar(this.controlKeyCode[1])}攻击   ${this.keyCodeToChar(this.controlKeyCode[2])}撤回`
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case this.controlKeyCode[0]:
                this.jump();
                break;
            case this.controlKeyCode[1]:
                this.attack();
                break;
            case this.controlKeyCode[2]:
                this.undoLast()
                break;
        }
    }
    private jump() {
        this.inputHandler.handleInput('j');
        this.notice.string = "最新动作：跳"
        this.updateCommandList();
    }
    private attack() {
        this.inputHandler.handleInput('a');
        this.notice.string = "最新动作：攻击"
        this.updateCommandList();
    }
    private undoLast() {
        this.inputHandler.undoLast();
        this.notice.string = "最新动作：撤回"
        this.updateCommandList();
    }
    private updateCommandList() {
        if (this.inputHandler.commandNames.length > 10) {
            this.inputHandler.commandNames.splice(0, 5)
            this.inputHandler.commandNames.splice(0, 5)
        }
        this.commonListList.string = this.inputHandler.commandNames.join('\n');
    }
    private changeKeyCodeEvent(event: EventKeyboard) {
        let control: "jump" | "attack" | "undo"
        if (event.target.name == "jump-mod") {
            control = "jump"
        } else if (event.target.name == "attack-mod") {
            control = "attack"
        } else {
            control = "undo"
        }
        this.notice.string = `请输入新的按键，以响应${control}事件`
        input.once(Input.EventType.KEY_DOWN, (event) => {
            this.modControlKeyCode(event.keyCode, control);
        }, this);
    }
    private modControlKeyCode(key: KeyCode, control: "jump" | "attack" | "undo") {
        switch (control) {
            case "jump":
                this.controlKeyCode[0] = key;
                break;
            case "attack":
                this.controlKeyCode[1] = key;
                break;
            case "undo":
                this.controlKeyCode[2] = key;
                break;
        }
        this.notice.string = "按键修改成功" + this.keyCodeToChar(key) + "  " + control
        this.keyTips.string = `${this.keyCodeToChar(this.controlKeyCode[0])}跳   ${this.keyCodeToChar(this.controlKeyCode[1])}攻击   ${this.keyCodeToChar(this.controlKeyCode[2])}撤回`
    }
    private keyCodeToChar(keyCode: KeyCode): string {
        const map: { [key: number]: string } = {
            [KeyCode.KEY_A]: 'A',
            [KeyCode.KEY_B]: 'B',
            [KeyCode.KEY_C]: 'C',
            [KeyCode.KEY_D]: 'D',
            [KeyCode.KEY_E]: 'E',
            [KeyCode.KEY_F]: 'F',
            [KeyCode.KEY_G]: 'G',
            [KeyCode.KEY_H]: 'H',
            [KeyCode.KEY_I]: 'I',
            [KeyCode.KEY_J]: 'J',
            [KeyCode.KEY_K]: 'K',
            [KeyCode.KEY_L]: 'L',
            [KeyCode.KEY_M]: 'M',
            [KeyCode.KEY_N]: 'N',
            [KeyCode.KEY_O]: 'O',
            [KeyCode.KEY_P]: 'P',
            [KeyCode.KEY_Q]: 'Q',
            [KeyCode.KEY_R]: 'R',
            [KeyCode.KEY_S]: 'S',
            [KeyCode.KEY_T]: 'T',
            [KeyCode.KEY_U]: 'U',
            [KeyCode.KEY_V]: 'V',
            [KeyCode.KEY_W]: 'W',
            [KeyCode.KEY_X]: 'X',
            [KeyCode.KEY_Y]: 'Y',
            [KeyCode.KEY_Z]: 'Z',
            [KeyCode.SPACE]: "空格",
            [KeyCode.ARROW_UP]: "上 ",
            [KeyCode.ARROW_DOWN]: "下 ",
            [KeyCode.ARROW_LEFT]: "左 ",
            [KeyCode.ARROW_RIGHT]: "右 "
        };
        return map[keyCode] || keyCode.toString();
    }

}

