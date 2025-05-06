import { AssetManager, director } from 'cc';
import { bundleMgr } from './BundleMgr';
/**场景管理器 */
class SceneMgr {
    public static readonly instance: SceneMgr = new SceneMgr();
    /**加载指定场景
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
}

export const sceneMgr = SceneMgr.instance;
