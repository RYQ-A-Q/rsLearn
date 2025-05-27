import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Arithmetic } from '../UI/Arithmetic';
import { Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapRandomPoints')
export class MapRandomPoints extends Component {
    @property({ min: 1, max: 100 })
    pointNums: number = 10
    @property(Prefab)
    pointPrefab: Prefab
    pointList: Node[] = []
    onLoad(): void {
        for (let i = 0; i < this.pointNums; i++) {
            let point = instantiate(this.pointPrefab)
            point.active = false
            this.node.addChild(point)
            this.pointList.push(point)
        }
    }
    private randomPoints() {
        this.pointList.forEach(point => point.active = false)
        const randomPositions = Arithmetic.generateRandomPositions(9, 9, this.pointNums);
        console.log(`生成${randomPositions.length}个：`);
        console.log(randomPositions);
        randomPositions.forEach((pos, index) => {
            this.pointList[index].setPosition(
                -200 + pos[1] * 50,//置左+位移
                200 - pos[0] * 50, 0)//置下+位移
            this.pointList[index].active = true
            this.pointList[index].children[0].getComponent(Label).string = index + 1 + ""
        });
    }
}


