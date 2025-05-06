import { _decorator, Component } from 'cc';
import { UIController } from '../../src/Controller/UiController';
const { ccclass, property } = _decorator;

@ccclass('BtnGroup')
export class BtnGroup extends Component {
    private normalMessage() {
        UIController.normalMessage("你好")
    }
    private verifyPanel() {
        UIController.verifyPanel("提示", "确定要删除吗？", (isConfirmed) => {
            if (isConfirmed) {
                UIController.normalMessage("确定")
            } else {
                UIController.normalMessage("取消")
            }
        })
    }
}


