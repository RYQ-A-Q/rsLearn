import { _decorator, Component, instantiate, Node, Prefab, ScrollView, UITransform, Widget } from 'cc';
import { GoodInfo } from '../../src/item/GoodInfo';
import { GoodItem } from './GoodItem';
const { ccclass, property } = _decorator;
@ccclass('VirtualList')
export class VirtualList extends Component {
    @property(ScrollView) scrollView: ScrollView = null!;
    @property(Prefab) itemPrefab: Prefab = null!;

    private data: GoodInfo[] = [
        new GoodInfo("bamboo01", "竹小妖", 10, "img/character/player/bamboo01"),
        new GoodInfo("cat_bean01", "豆猫", 5, "img/character/player/cat_bean01"),
        new GoodInfo("cat01", "猫土憨", 8, "img/character/player/cat01"),
        new GoodInfo("cat02", "猫紫啧", 7, "img/character/player/cat02"),
        new GoodInfo("cat03", "猫冰", 6, "img/character/player/cat03"),
        new GoodInfo("chicken01", "咕咕鸡", 9, "img/character/player/chicken01"),
        new GoodInfo("chickenIkun", "坤鸡", 4, "img/character/player/chickenIkun"),
        new GoodInfo("dog01", "小黄狗", 11, "img/character/player/dog01"),
        new GoodInfo("duck_food01", "小黄鸭", 12, "img/character/player/duck_food01"),
        new GoodInfo("flower_azalea", "索玛花", 13, "img/character/player/flower_azalea"),
        new GoodInfo("flower_earth01", "小土花", 14, "img/character/player/flower_earth01"),
        new GoodInfo("flower_fire01", "四色花", 15, "img/character/player/flower_fire01"),
        new GoodInfo("grass_wood01", "芽芽草", 16, "img/character/player/grass_wood01"),
        new GoodInfo("Home", "小宅", 17, "img/character/player/Home"),
        new GoodInfo("spider01", "蛛幺幺", 18, "img/character/player/spider01"),
        new GoodInfo("trashCan", "垃垃筒", 19, "img/character/player/trashCan"),
        new GoodInfo("tree_wood01", "茂郁树", 20, "img/character/player/tree_wood01"),
        new GoodInfo("tree_wood02", "沙小树", 21, "img/character/player/tree_wood02"),
        new GoodInfo("bigHead_lightBlue", "咕噜", 22, "img/character/enemy/bigHead_lightBlue"),
        new GoodInfo("bigHead_roseRed", "噜咕", 23, "img/character/enemy/bigHead_roseRed"),
        new GoodInfo("bigHead_doctor", "博士", 24, "img/character/enemy/bigHead_doctor"),
        new GoodInfo("bigHead_kid", "顽童", 25, "img/character/enemy/bigHead_kid"),
        new GoodInfo("bigHead_fatTiger", "胖虎", 26, "img/character/enemy/bigHead_fatTiger"),
        new GoodInfo("bigHead_blueEyes", "卧龙", 27, "img/character/enemy/bigHead_blueEyes"),
        new GoodInfo("bigHead_dullPink", "凤雏", 28, "img/character/enemy/bigHead_dullPink"),
        new GoodInfo("bigHead_bigFool", "大傻", 29, "img/character/enemy/bigHead_bigFool"),
        new GoodInfo("bigHead_hunger", "饿耳", 30, "img/character/enemy/bigHead_hunger"),
        new GoodInfo("wideFace_dullGrey", "流民", 31, "img/character/enemy/wideFace_dullGrey"),
        new GoodInfo("wideFace_pioneer", "先锋", 32, "img/character/enemy/wideFace_pioneer"),
        new GoodInfo("wideFace_acturus", "年轻大角", 33, "img/character/enemy/wideFace_acturus"),
        new GoodInfo("wideFace_fool", "大傻", 34, "img/character/enemy/wideFace_fool"),
        new GoodInfo("wideFace_senior", "长者", 35, "img/character/enemy/wideFace_senior"),
        new GoodInfo("limeStone_eagleOwl", "岩雕", 36, "img/character/enemy/limeStone_eagleOwl"),
        new GoodInfo("limeStone_guard", "黑护卫", 37, "img/character/enemy/limeStone_guard"),
        new GoodInfo("limeStone_animaAsh", "灵童", 38, "img/character/enemy/limeStone_animaAsh"),
        new GoodInfo("flsorescence_lion", "魇狮", 39, "img/character/enemy/flsorescence_lion"),
        new GoodInfo("flsorescence_flyEgg", "魇眼", 40, "img/character/enemy/flsorescence_flyEgg"),
        new GoodInfo("flsorescence_evilHorn", "魇大角", 41, "img/character/enemy/flsorescence_evilHorn")
    ]
    private items: Node[] = [];// 池化节点数组
    private itemHeight = 0;// 单个 item 高度

    @property({ displayName: "y间隔" })
    private spacingY = 10; // 间距
    private visibleCount = 0;// 可视+缓冲 数量
    private bufferCount = 2;
    private startIndex = 0; // 当前第一个数据索引
    async onEnable() {
        this.init();
        this.scrollView.node.on('scrolling', this.onScroll, this);
    }
    onDisable() {
        this.scrollView.node.off('scrolling', this.onScroll, this);
    }
    private init() {
        const content = this.scrollView.content;
        // 2. 读取 item 尺寸 & 间距
        const tmp = instantiate(this.itemPrefab);
        content.addChild(tmp);
        const ui = tmp.getComponent(UITransform)!;
        this.itemHeight = ui.height;
        tmp.removeFromParent();
        // 3. 计算需要的节点数
        const viewH = this.scrollView.node.getComponent(UITransform)!.height;
        this.visibleCount = Math.ceil(viewH / (this.itemHeight + this.spacingY));
        this.visibleCount = Math.min(this.visibleCount + this.bufferCount * 2, this.data.length);
        // 4. 清空老节点，创建可复用节点
        content.removeAllChildren();
        this.items = [];
        for (let i = 0; i < this.visibleCount; i++) {
            const node = instantiate(this.itemPrefab);
            let widget = node.getComponent(Widget);
            if (!widget) {
                widget = node.addComponent(Widget);
            }
            widget.isAlignHorizontalCenter = true
            content.addChild(node);
            this.items.push(node);
        }
        // 5. 设定 content 总高度
        const totalHeight = this.data.length * (this.itemHeight + this.spacingY) - this.spacingY;
        content.getComponent(UITransform)!.height = totalHeight;
        // 6. 第一次渲染
        this.startIndex = 0;
        this.refreshItems();
    }

    private onScroll() {
        const offsetY = this.scrollView.getScrollOffset().y;
        const step = this.itemHeight + this.spacingY;
        const rawIndex = Math.floor(offsetY / step);
        // 最大起始索引
        const maxStart = Math.max(0, this.data.length - this.visibleCount);
        const targetStart = Math.min(
            maxStart,
            Math.max(0, rawIndex - this.bufferCount)
        );

        if (targetStart !== this.startIndex) {
            this.startIndex = targetStart;
            this.refreshItems();
        }
    }
    /** 根据 startIndex 更新 items 的位置 & 数据 */
    private refreshItems() {
        for (let i = 0; i < this.items.length; i++) {
            const dataIdx = this.startIndex + i;
            const node = this.items[i];
            if (dataIdx < this.data.length) {
                node.active = true;
                node.setPosition(node.position.x, - (dataIdx * (this.itemHeight + this.spacingY) + this.itemHeight / 2));
                node.getComponent(GoodItem)!.updateItem(this.data[dataIdx]);
            } else {
                node.active = false;
            }
        }
    }
}
