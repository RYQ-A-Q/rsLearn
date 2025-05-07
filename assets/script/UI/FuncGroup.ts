import { _decorator, Component, instantiate, Node, Prefab, warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FuncGroup')
export class FuncGroup extends Component {
    @property(Node)
    root: Node
    private virtualList() {
        let path = 'prefab/ui/func/virtualList'
        rs.resources.load(path, Prefab, (err, prefab) => {
            let node = instantiate(prefab)
            if (err || !prefab) {
                warn(`[FuncGroup] 加载虚拟列表失败：${path}`, err)
                return
            }
            this.root.addChild(node)
            node.active = true
        })

    }
}


