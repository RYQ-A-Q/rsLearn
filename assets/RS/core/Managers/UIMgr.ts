import { Node, Prefab, instantiate, log, warn } from 'cc';
import { UIPanelType } from '../constants/SysEnums';
import { assetManager } from 'cc';
import { NormalMessage } from '../script/NormalMessage';
import { VerifyPanel } from '../script/VerifyPanel';

type UIMap = { [key: string]: Node }

export class UIMgr {
    private static _instance: UIMgr = new UIMgr();
    private _panelRoots: Record<UIPanelType, Node> = {} as any
    public static getInstance(): UIMgr {
        return this._instance
    }

    private _uiCache: UIMap = {}
    private _uiRoot: Node

    private constructor() {
    }
    /**初始化
     * @param uiRoot UI 根节点
     */
    init(panelRoots: Record<UIPanelType, Node>) {
        this._panelRoots = panelRoots
    }

    /**
     * 打开 UI 窗口
     * @param name ui名称
     * @param path 路径
     * @param type 挂载容器类型
     * @param callback 加载完成回调，返回目标节点
     */
    public open(name: string, path: string, type: UIPanelType = UIPanelType.toast, callback?: (node: Node) => void): void {
        if (!this._panelRoots[type]) {
            warn(`[UIMgr] 未找到指定的挂载容器：${type}`)
            return
        }
        const cacheKey = name
        if (rs.pools.has(cacheKey)) {//优先考虑对象池
            let node = rs.pools.get(cacheKey)
            node.active = true
            this._panelRoots[type].addChild(node)
            this._panelRoots[type].active = true
            callback?.(node)
            return
        }

        if (this._uiCache[cacheKey] && (!this._uiCache[cacheKey]?.active || this._uiCache[cacheKey]?.parent == null)) {//已经存在并且是不激活状态
            this._uiCache[cacheKey].active = true
            this._panelRoots[type].addChild(this._uiCache[cacheKey])
            this._panelRoots[type].active = true
            callback?.(this._uiCache[cacheKey])
            return
        }

        rs.resources.load(path, Prefab, (err, prefab) => {
            if (err || !prefab) {
                warn(`[UIMgr] 加载 UI 失败：${name + path}`, err)
                return
            }
            const node = instantiate(prefab)
            this._panelRoots[type].addChild(node)
            node.active = true
            this._panelRoots[type].active = true
            this._uiCache[cacheKey] = node
            prefab.decRef()//保证没有资源引用
            callback?.(node)
        })
    }
    /**普通消息通知
     * @param message 消息文本
     * @param duration 显示时长
     */
    public showToast(message: string, duration: number = 0.8) {
        this.open("normalToast", "prefab/ui/base/normalToast", UIPanelType.toast, (node) => {
            if (node) {
                node.getComponent(NormalMessage).show(message, duration)
            }
        })
    }
    /**普通确认面板
     * @param title 标题
     * @param content 内容
     * @param callback 回调函数，参数为是否确认 true为确认
     */
    public showVerifyPanel(title: string = "请确认", content: string = "确认吗", callback: (isConfirmed: boolean) => void = () => { }) {
        this.open("normalVerifyPanel", "prefab/ui/base/normalVerifyPanel", UIPanelType.top_touchBan, (node) => {
            if (node) {
                node.getComponent(VerifyPanel).init(title, content, callback)
            }
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
            if (!rs.pools.has(key)) {
                node.destroy()
            }
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
                if (!rs.pools.has(key)) {
                    node.destroy()
                }
            }
        }
        this._uiCache = {}
    }
}
export const uiMgr = UIMgr.getInstance()