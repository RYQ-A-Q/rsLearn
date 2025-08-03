import { AssetManager, director } from 'cc';
import { bundleMgr } from './BundleMgr';
/**场景管理器 */
class SceneMgr {
    public static readonly instance: SceneMgr = new SceneMgr();
    /**加载并运行指定场景
     * @param sceneName 场景名称
     * @param bundleName 包名,默认为RS_res
     */
    loadScene(sceneName: string, bundleName: string = 'RS_res') {
        bundleMgr.getBundle(bundleName).then((bundle: AssetManager.Bundle) => {
            if (bundle) {
                bundle.loadScene(sceneName, (err, sceneAsset) => {
                    if (err) {
                        console.error(`未找到场景: ${sceneName}`, err);
                        return;
                    }
                    director.runScene(sceneAsset);
                });
            } else {
                console.error(`未找到 Bundle : ${bundleName}`);
            }
        }).catch((error) => {
            console.error(`Error loading bundle: ${bundleName}`, error);
        });
    }
    /**
  * 预加载指定场景，加载成功后返回场景名
  * @param sceneName 场景名称
  * @param bundleName 包名，默认为 RS_res
  * @returns 加载成功的场景名
  */
    async preLoadScene(sceneName: string, bundleName: string = 'RS_res'): Promise<string> {
        try {
            const bundle = await bundleMgr.getBundle(bundleName);
            if (!bundle) {
                console.error(`未找到 Bundle: ${bundleName}`);
                return
            }
            return await new Promise<string>((resolve, reject) => {
                bundle.preloadScene(sceneName, (err) => {
                    if (err) {
                        console.error(`预加载场景失败: ${sceneName}`, err);
                        reject(err);
                    } else {
                        console.log(`预加载成功: ${sceneName}`);
                        resolve(sceneName);
                    }
                });
            });
        } catch (error) {
            console.error(`预加载出错: ${sceneName}`, error);
            throw error;
        }
    }

}

export const sceneMgr = SceneMgr.instance;
