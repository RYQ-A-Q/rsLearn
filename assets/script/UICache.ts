import { SpriteFrame } from "cc";

export class UICache {
    public goodsImg: Map<string, SpriteFrame> = new Map()
    public static readonly instance: UICache = new UICache()
    private constructor() { }
}
