
/**RS枚举配置器 */
//值为Json文件中的属性名
class EnumMgr {
    public static readonly instance: EnumMgr = new EnumMgr();
    public readonly FileName_audioBG = {
        main: "main",
        gambel: "gambel",
        game_day: "game_day",
        game_night: "game_night",
        happy: "happy"
    } as const;
    public readonly FileName_audioUi = {
        alive: "alive",
        btn_normalClick: "btn_normalClick",
        btn_switchClick: "btn_switchClick",
        collider: "collider",
        error1: "error_尖锐",
        error2: "error_回响",
        error3: "error_颤抖",
        sad: "sad",
        success1: "success1",
        success2: "success2",
        switch: "switch",
        bell: "敲钟",
        woodenFish: "木鱼",
        cicadaChirp: "蝉鸣",
        crow: "鸡鸣",
    } as const;

    /**系统预制体路径枚举,在rs加载时会创建对应对象池 */
    public readonly FileName_prefabSys = {
        normalMessage: "prefab/ui/base/normalMessage"
    }
}
export const enumMgr = new EnumMgr();