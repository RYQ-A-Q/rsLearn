import { UIPanelType } from "../../RS/core/constants/SysEnums";
import { NormalMessage } from "../../RS/core/script/NormalMessage";
import { VerifyPanel } from "../../RS/core/script/VerifyPanel";

export class UIController {
    private static _instance: UIController = new UIController();
    public static instance() { return this._instance }

    /**普通消息通知 */
    public static normalMessage(message: string, duration: number = 0.3) {
        rs.ui.open("normalMessage", "prefab/ui/base/normalMessage", UIPanelType.NoBg, (node) => {
            if (node) {
                node.getComponent(NormalMessage).show(message, duration)
            }
        })
    }
    /**普通确认面板 */
    public static verifyPanel(title: string = "", content: string = "确认吗", callback: (isConfirmed: boolean) => void = () => { }) {
        rs.ui.open("verifyPanel", "prefab/ui/base/verifyPanel", UIPanelType.Block, (node) => {
            if (node) {
                node.getComponent(VerifyPanel).init(title, content, callback)
            }
        })
    }
}