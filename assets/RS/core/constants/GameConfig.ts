
/**应用信息 */
export const AppConfig = {
    appName: "漫漫又一夜",
    version: "v1.0.0"
}
export const RSConfig = {
    /**模块bundle名配置，需和实际bundle一致 */
    bundleName: {
        rs: "RS_res",
        audio: "RS_media",
    },
    /**资源路径 */
    path: {
        /**音频路径指引文件 */
        audioPathConfigJSON: "data/config/audioConfig",
        noticeCanvas: "prefab/ui/noticeCanvas"
    },
    /*对象池配置 */
    poolsConfig: {
        /**默认预制体生成大小 */
        size: 10
    }
}