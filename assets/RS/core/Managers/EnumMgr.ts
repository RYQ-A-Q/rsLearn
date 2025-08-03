
/**RS枚举配置器 */
//值为Json文件中的属性名
class EnumMgr {
    public static readonly instance: EnumMgr = new EnumMgr();
    public readonly FileName_audioBG = {
        normalBg: "normalBg"
    } as const;
    /**将在初始化时预加载 */
    public readonly FileName_audioUi = {
        alive: "alive",
        btn_normalClick: "btn_normalClick",
        btn_switchClick: "btn_switchClick",
        error: "error",
        success1: "success1",
        success2: "success2",
    } as const;

    /**系统预制体路径枚举,在rs加载时会创建对应对象池 */
    public readonly FileName_prefabSys = {
        normalToast: "prefab/ui/base/normalToast"
    }
}
export const enumMgr = new EnumMgr();