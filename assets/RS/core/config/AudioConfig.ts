/**使用该类的方法获取路径后传入AudioMgr使用 */
export class AudioConfig {
    private static config: any;
    /**初始化音频配置 */
    public static loadConfig(config: any) {
        AudioConfig.config = config;
    }
    /** 根据名字获取Bgm，name为配置json文件中的键名,新增文件时请先增加rs.enum.FileName_audioBG中的枚举名字 */
    public static getBGM(name: (typeof rs.enum.FileName_audioBG)[keyof typeof rs.enum.FileName_audioBG]): string {
        return AudioConfig.config?.bg?.[name] ?? "";
    }
    /** 根据名字获取Ui音效，name为配置json文件中的键名,新增文件时请先增加rs.enum.FileName_audioUi中的枚举名字 */
    public static getUi(name: (typeof rs.enum.FileName_audioUi)[keyof typeof rs.enum.FileName_audioUi]): string {
        return AudioConfig.config?.ui?.[name] ?? "";
    }

}    
