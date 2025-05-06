import { _decorator, Component } from 'cc';
import { UIController } from '../../src/Controller/UiController';
const { ccclass, property } = _decorator;

@ccclass('BtnGroup')
export class BtnGroup extends Component {
    private normalMessage() {
        UIController.normalMessage("你好")
    }
}


