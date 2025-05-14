import { _decorator, Component, error, Label, Sprite, SpriteFrame } from 'cc';
import { GoodInfo } from '../../src/item/GoodInfo';
import { UICache } from '../UICache';
const { ccclass, property } = _decorator;

@ccclass('GoodItem')
export class GoodItem extends Component {
    @property({ type: Sprite, displayName: "图标" })
    private icon: Sprite
    @property({ type: Label, displayName: "名称" })
    private itemName: Label
    @property({ type: Label, displayName: "库存" })
    private store: Label

    updateItem(goodInfo: GoodInfo) {
        this.icon.spriteFrame = null
        this.itemName.string = goodInfo.name
        this.store.string = goodInfo.store.toString()
        if (UICache.instance.goodsImg.has(goodInfo.name)) {
            this.icon.spriteFrame = UICache.instance.goodsImg.get(goodInfo.name)
        } else {
            rs.resources.load(`${goodInfo.imgPath}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    error("加载图标失败" + err)
                    this.icon.spriteFrame = null
                } else {
                    UICache.instance.goodsImg.set(goodInfo.name, spriteFrame)
                    this.icon.spriteFrame = spriteFrame
                }
            })
        }
    }
}


