import { assetManager, AssetManager, director, error, instantiate, JsonAsset, log, Node, Prefab, warn } from "cc";
import { AppConfig, RSConfig } from "./core/constants/GameConfig";
import { UIPanelType } from "./core/constants/SysEnums";
import { assetMgr } from "./core/Managers/AssetMgr";
import { audioMgr } from "./core/Managers/AudioMgr";
import { bundleMgr } from "./core/Managers/BundleMgr";
import { enumMgr } from "./core/Managers/EnumMgr";
import { netMgr } from "./core/Managers/NetMgr";
import { poolsMgr } from "./core/Managers/PoolsMgr";
import { sceneMgr } from "./core/Managers/SceneMgr";
import { uiMgr } from "./core/Managers/UIMgr";

/**框架类 */
class RS {
    /**音频管理器 */
    public audio = audioMgr
    /**枚举管理器 */
    public enum = enumMgr
    /**资源管理器 */
    public asset = assetMgr
    public ui = uiMgr
    /**对象池管理器 */
    public pools = poolsMgr
    /**分包管理器 */
    public bundle = bundleMgr
    /**场景管理器 */
    public scene = sceneMgr
    /**网络管理器 */
    public net = netMgr
    /**框架默认分包 */
    resources: AssetManager.Bundle
    /**应用信息 */
    appConfig = AppConfig
    /**框架设置 */
    config = RSConfig
    /**是否完成加载 */
    FinishLoad: boolean = false
    /**消息通知和弹窗画布 */
    noticeCanvas: Node = null

    constructor() {
    }
    /**启动初始化 */
    async loader() {
        if (this.FinishLoad) { return }
        await new Promise<void>((resolve, reject) => {
            assetManager.loadBundle(this.config.bundleName.rs, (err, bd) => {
                if (err) {
                    warn("加载Rs_res Bundle失败" + err)
                } else {
                    this.resources = bd
                    this.resources.load(this.config.path.noticeCanvas, Prefab, (err, prefab) => {
                        if (err) {
                            error(err);
                            reject()
                        } else {
                            let newNode = instantiate(prefab)
                            newNode.parent = director.getScene()
                            director.addPersistRootNode(newNode)
                            this.noticeCanvas = newNode
                            this.ui.init({
                                [UIPanelType.Block]: newNode.children[1],
                                [UIPanelType.BanClick]: newNode.children[2],
                                [UIPanelType.Popup]: newNode.children[3],
                                [UIPanelType.NoBg]: newNode.children[4],
                            })
                            prefab.decRef()
                        }
                    })
                    resolve()
                }
            })
        })
        await new Promise<void>((resolve, reject) => {//媒体资源包
            this.resources.load(this.config.path.audioPathConfigJSON, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    error("音频配置初始化错误" + err);
                    reject(err)
                } else {
                    assetManager.loadBundle(rs.config.bundleName.audio, (err, bd) => {
                        if (err) {
                            error(`加载${rs.config.bundleName.audio} Bundle失败` + err)
                            reject(err)
                        } else {
                            this.audio.init(jsonAsset.json, bd)
                            this.FinishLoad = true
                            resolve()
                        }
                    })
                }
            })
        })
        await new Promise<void>((resolve, reject) => {//默认对象池
            Object.keys(enumMgr.FileName_prefabSys).forEach(key => {
                this.resources.load(enumMgr.FileName_prefabSys[key], Prefab, (err, prefab) => {
                    if (err) {
                        error(err);
                        reject(err)
                    } else {
                        this.pools.preload(key, prefab)
                        prefab.decRef()
                        resolve()
                    }
                })
            })
        })
        log("框架初始化完成")
    }
}

declare global {
    interface Window {
        rs: RS;
    }
    var rs: RS;
}
window.rs = new RS()
