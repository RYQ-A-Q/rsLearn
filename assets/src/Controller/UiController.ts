import { UIPanelType } from "../../RS/core/constants/SysEnums";
import { NormalMessage } from "../../RS/core/script/NormalMessage";

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
}