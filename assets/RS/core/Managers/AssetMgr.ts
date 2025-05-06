import { Asset, assetManager } from "cc";
import { bundleMgr } from "./BundleMgr";
/**资源管理器 */
class AssetMgr {
    private cache: Map<string, Asset> = new Map(); // 资源缓存
    public static readonly instance: AssetMgr = new AssetMgr();

    private constructor() { }

    /**
     * 加载单个资源
     * @param bundleName 资源所在的 bundle 名称，默认为 "RS_res"
     * @param path 资源路径
     * @param type 资源类型（Prefab、SpriteFrame、AudioClip、JsonAsset等）
     * @param onProgress 进度回调 (progress: number) => void
     * @returns Promise<Asset>
     */
    public async load<T extends Asset>(
        bundleName: string = "RS_res",
        path: string,
        type: new () => T,
        onProgress?: (progress: number) => void
    ): Promise<T> {
        // 如果资源已缓存，直接返回
        if (this.cache.has(path)) {
            return this.cache.get(path) as T;
        }

        // 获取 Bundle
        const bundle = await bundleMgr.getBundle(bundleName);
        if (!bundle) {
            throw new Error(`加载失败: 资源包 ${bundleName} 不存在`);
        }

        return new Promise<T>((resolve, reject) => {
            bundle.load(
                path,
                type,
                (finished: number, total: number) => {
                    if (onProgress) {
                        onProgress(finished / total);
                    }
                },
                (err, asset) => {
                    if (err) {
                        console.error(`资源加载失败: ${path}`, err);
                        reject(err);
                    } else {
                        this.cache.set(path, asset); // 存入缓存
                        resolve(asset);
                    }
                }
            );
        });
    }

    /**
     * 批量加载多个资源，并提供整体进度
     * @param bundleName 资源所在的 bundle 名称
     * @param assets 资源信息列表 [{ path: string, type: new () => T }]
     * @param onProgress 整体进度回调 (progress: number) => void
     * @returns Promise<Asset[]>
     */
    public async loadBatch<T extends Asset>(
        bundleName: string = "RS_res",
        assets: { path: string; type: new () => T }[],
        onProgress?: (progress: number) => void
    ): Promise<T[]> {
        const total = assets.length;
        let loaded = 0;
        let results: T[] = [];

        const updateProgress = () => {
            if (onProgress) {
                onProgress(loaded / total);
            }
        };

        for (const asset of assets) {
            try {
                const result = await this.load(bundleName, asset.path, asset.type, updateProgress);
                results.push(result);
                loaded++;
                updateProgress();
            } catch (error) {
                console.error(`资源加载失败: ${asset.path}`, error);
            }
        }

        return results;
    }

    /**
     * 释放资源
     * @param path 资源路径
     */
    public release(path: string) {
        if (this.cache.has(path)) {
            const asset = this.cache.get(path);
            asset?.decRef();
            this.cache.delete(path);
            console.log(`资源已释放: ${path}`);
        }
    }

    /**
     * 释放整个 Bundle 下的所有资源
     * @param bundleName 资源包名称
     */
    public releaseBundle(bundleName: string) {
        const bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.releaseAll();
            console.log(`已释放 Bundle: ${bundleName}`);
        }
    }
}

export const assetMgr = AssetMgr.instance;
