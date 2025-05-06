import { Node, Prefab, instantiate, warn } from 'cc';

type UIMap = { [key: string]: Node }

export class UIMgr {
    private static _instance: UIMgr
    public static getInstance(): UIMgr {
        if (!this._instance) {
            this._instance = new UIMgr()
        }
        return this._instance
    }

    private _uiCache: UIMap = {}
    private _uiRoot: Node

    private constructor() {
    }
    /**初始化
     * @param uiRoot UI 根节点
     */
    init(uiRoot: Node) {
        this._uiRoot = uiRoot
    }

    /**
     * 打开 UI 窗口
     * @param path prefab 相对路径（基于 rs.resources 资源配置）
     * @param key 缓存 key（可选，默认使用 path）
     * @param callback 加载完成回调
     */
    public open(path: string, key?: string, callback?: (node: Node) => void): void {
        const cacheKey = key || path

        if (this._uiCache[cacheKey]) {
            this._uiCache[cacheKey].active = true
            callback?.(this._uiCache[cacheKey])
            return
        }

        rs.resources.load(path, Prefab, (err, prefab) => {
            if (err || !prefab) {
                warn(`[UIMgr] 加载 UI 失败：${path}`, err)
                return
            }

            const node = instantiate(prefab)
            node.name = cacheKey
            this._uiRoot.addChild(node)
            this._uiCache[cacheKey] = node
            callback?.(node)
        })
    }

    /**
     * 关闭 UI
     * @param key 对应 UI 标识
     * @param destroy 是否销毁节点（默认 false）
     */
    public close(key: string, destroy: boolean = false): void {
        const node = this._uiCache[key]
        if (!node) {
            warn(`[UIMgr] 关闭失败，未找到 UI：${key}`)
            return
        }

        node.active = false
        if (destroy) {
            node.removeFromParent()
            node.destroy()
            delete this._uiCache[key]
        }
    }
    /**
     * 获取已打开的 UI 节点
     */
    public get(key: string): Node | null {
        return this._uiCache[key] || null
    }

    /**
     * 判断 UI 是否存在
     */
    public has(key: string): boolean {
        return !!this._uiCache[key]
    }

    /**
     * 清除所有 UI 缓存
     * @param destroy 是否销毁节点（默认 true）
     */
    public clearAll(destroy: boolean = true): void {
        for (const key in this._uiCache) {
            const node = this._uiCache[key]
            if (destroy && node) {
                node.removeFromParent()
                node.destroy()
            }
        }
        this._uiCache = {}
    }
}
export const uiMgr = UIMgr.getInstance()