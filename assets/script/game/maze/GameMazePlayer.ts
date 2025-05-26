import { _decorator, Component, Event, EventKeyboard, EventTouch, Input, input, KeyCode, Node, tween, Vec2, Vec3 } from 'cc';
import { UIController } from 'db://assets/src/Controller/UiController';
const { ccclass, property } = _decorator;

@ccclass('GameMazePlayer')
export class GameMazePlayer extends Component {
    @property({ type: Node })
    mazeContainer: Node = null;
    cameraNode: Node = null;
    cellSize: number = 40;
    private mazeData: number[][] = [];
    private playerPos: Vec3 = new Vec3(0, 0, 0);
    private touchStart: Vec2;
    private touchEnd: Vec2;

    onLoad() {
        if (!this.cameraNode) {
            const camera = this.node.scene.getChildByName("Canvas").getChildByName("Camera");//注意迁移项目的话需要修改
            if (camera) {
                console.log("初始化相机节点" + camera.name)
                this.cameraNode = camera;
            }
        }
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.parent.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    protected onDisable(): void {
        this.cameraNode.setPosition(0, 0, 0);
    }
    onDestroy() {
        this.cameraNode.setPosition(0, 0, 0);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * 初始化玩家位置和迷宫数据
     * @param startX 起始点的地图x坐标
     * @param startY 起始点的地图y坐标
     * @param mazeData 地图数据
     * @param cellSize 格子大小
     */
    initPlayer(startX: number, startY: number, mazeData: number[][], cellSize: number) {
        this.cellSize = cellSize;
        this.playerPos.set(startX * this.cellSize, -startY * this.cellSize, 0);
        this.node.setPosition(this.playerPos);
        this.mazeData = mazeData;

        // 初始化相机位置
        if (this.cameraNode) {
            this.cameraNode.setWorldPosition(this.node.worldPosition);
        }
    }

    private onTouchStart(event: EventTouch) {
        this.touchStart = event.getLocation()
    }

    private onTouchEnd(event: EventTouch) {
        this.touchEnd = event.getLocation()
        const deltaX = this.touchEnd.x - this.touchStart.x;
        const deltaY = this.touchEnd.y - this.touchStart.y;
        // 判断滑动方向
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 水平方向滑动
            if (deltaX > 0) {
                this.onKeyDown({ keyCode: KeyCode.ARROW_RIGHT } as EventKeyboard);
            } else {
                this.onKeyDown({ keyCode: KeyCode.ARROW_LEFT } as EventKeyboard);
            }
        } else {
            // 垂直方向滑动
            if (deltaY > 0) {
                this.onKeyDown({ keyCode: KeyCode.ARROW_UP } as EventKeyboard);
            } else {
                this.onKeyDown({ keyCode: KeyCode.ARROW_DOWN } as EventKeyboard);
            }
        }
    }
    /**控制按钮事件 */
    private onControllerKeyDown(event: Event, dir: string) {
        switch (dir) {
            case "up":
                this.onKeyDown({ keyCode: KeyCode.ARROW_UP } as EventKeyboard);
                break;
            case "down":
                this.onKeyDown({ keyCode: KeyCode.ARROW_DOWN } as EventKeyboard);
                break;
            case "left":
                this.onKeyDown({ keyCode: KeyCode.ARROW_LEFT } as EventKeyboard);
                break;
            case "right":
                this.onKeyDown({ keyCode: KeyCode.ARROW_RIGHT } as EventKeyboard);
                break;
            default:
                return;
        }
    }

    private onKeyDown(event: EventKeyboard) {
        let newX = this.playerPos.x;
        let newY = this.playerPos.y;
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
                newY += this.cellSize;
                break;
            case KeyCode.ARROW_DOWN:
                newY -= this.cellSize;
                break;
            case KeyCode.ARROW_LEFT:
                newX -= this.cellSize;
                break;
            case KeyCode.ARROW_RIGHT:
                newX += this.cellSize;
                break;
            default:
                return;
        }

        const mazeX = Math.floor(newX / this.cellSize);
        const mazeY = Math.floor(-newY / this.cellSize); // 修正y坐标为负方向
        if (mazeY >= 0 && mazeY < this.mazeData.length && mazeX >= 0 && mazeX < this.mazeData[0].length) {
            if (this.mazeData[mazeX][mazeY] === 0) {
                this.playerPos.set(newX, newY, 0);
                this.node.setPosition(this.playerPos);
                // 更新相机位置
                if (this.cameraNode) {
                    if (Vec3.distance(this.node.worldPosition, this.cameraNode.worldPosition) > 200) {
                        tween(this.cameraNode).to(0.5, { worldPosition: this.node.worldPosition }).start();
                    }
                }
            }
        } else {
            UIController.normalMessage("已是迷宫边缘");
        }
        this.node.emit("move", mazeX, mazeY);
    }
}
