import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Index')
export class Index extends Component {
    start() {
        if (!rs.FinishLoad) {
            rs.loader()
        }
    }
}


