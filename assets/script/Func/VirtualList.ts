import { _decorator, Component, instantiate, Layout, Node, Prefab, ScrollView, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VirtualList')
export class VirtualList extends Component {
    @property(Prefab)
    itemPrefab: Prefab = null;
    @property({ type: ScrollView, displayName: "滚动视图" })
    scrollView: ScrollView = null;
    @property({ type: Node, displayName: "展示视图", tooltip: "控制显示的那个" })
    viewPanel: Node = null;
    protected onEnable(): void {
        this.init();
    }
    private init() {
        let nums = this.privatecalculateVisibleCount(this.scrollView, this.viewPanel, this.itemPrefab)
        for (let i = this.scrollView.content.children.length; i < nums; i++) {
            let item = instantiate(this.itemPrefab);
            item.active = false
            this.scrollView.content.addChild(item);
        }
    }
    updateList() {

    }
    /**
    * 计算滚动视图中在可视区域内最多可以容纳多少个 item（含缓冲）
    */
    private privatecalculateVisibleCount(scrollView: ScrollView, viewPanel: Node, itemPrefab: Prefab, buffer: number = 2): number {
        /**展示的总窗口 */
        const viewTransform = viewPanel.getComponent(UITransform);
        const layout = scrollView.content.getComponent(Layout);
        let contentNode = scrollView.content;
        if (!viewTransform || !layout) {
            console.warn('scrollView 或 列表 节点结构不完整');
            return
        }
        /**实际显示高度 */
        let viewHeight = viewTransform.height - layout.paddingTop - layout.paddingBottom;
        /**实际显示宽度 */
        let viewWidth = viewTransform.width - layout.paddingLeft - layout.paddingRight;

        // 创建一次 Item 实例，测量尺寸后销毁
        const tempItem = instantiate(this.itemPrefab);
        contentNode.addChild(tempItem);
        const itemTransform = tempItem.getComponent(UITransform);
        const itemWidth = itemTransform.width;
        const itemHeight = itemTransform.height;
        tempItem.active = false

        const spacingX = layout.spacingX;
        const spacingY = layout.spacingY;

        let visibleCount = 0;

        switch (layout.type) {
            case Layout.Type.VERTICAL:
                {
                    const singleHeight = itemHeight + spacingY;
                    visibleCount = Math.ceil((viewHeight + spacingY) / singleHeight) + buffer;
                }
                break;
            case Layout.Type.HORIZONTAL:
                {
                    const singleWidth = itemWidth + spacingX;
                    visibleCount = Math.ceil((viewWidth + spacingX) / singleWidth) + buffer;
                }
                break;
            case Layout.Type.GRID:
                {
                    const constraint = layout.constraint; // FIXED_ROW 或 FIXED_COL
                    const constraintNum = layout.constraintNum;

                    if (constraint === Layout.Constraint.FIXED_ROW) {
                        // 固定行数，按列滚动（横向）
                        const colCount = Math.ceil((viewWidth + spacingX) / (itemWidth + spacingX));
                        visibleCount = colCount * constraintNum + buffer;
                    } else {
                        // FIXED_COL，固定列数，按行滚动（纵向）
                        const rowCount = Math.ceil((viewHeight + spacingY) / (itemHeight + spacingY));
                        visibleCount = rowCount * constraintNum + buffer;
                    }
                }
                break;
        }

        return visibleCount;
    }
}
