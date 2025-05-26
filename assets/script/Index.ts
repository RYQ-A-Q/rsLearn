import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Index')
export class Index extends Component {
    start() {
        if (!rs.FinishLoad) {
            console.log('加载框架中')
            rs.loader()
        }
    }
}


