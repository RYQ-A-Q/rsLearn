import { AudioClip } from 'cc';
import { AudioSource } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { UIController } from 'db://assets/src/Controller/UiController';
const { ccclass, property } = _decorator;
/**懒汉式单例 */
class musicMgr_lazy {
    private static instance: musicMgr_lazy = null;
    private constructor() {
        console.log("musicMgr_Lazy创建实例");
        this.music = new AudioSource();
    }
    private music: AudioSource
    public static getInstance(): musicMgr_lazy {
        if (this.instance == null) {
            this.instance = new musicMgr_lazy();
        }
        return this.instance;
    }
    public playMusic(path: string) {
        rs.asset.load(path, AudioClip, () => { }, "RS_media").then((clip: AudioClip) => {
            this.music.playOneShot(clip);
        })
    }
}
/**饿汉式单例 */
class musicMgr_eager {
    private static instance: musicMgr_eager = new musicMgr_eager();
    private constructor() {
        console.log("musicMgr_eager创建实例");
        this.music = new AudioSource();
    }
    private music: AudioSource
    public static getInstance(): musicMgr_eager {
        return this.instance;
    }
    public playMusic(path: string) {
        rs.asset.load(path, AudioClip, () => { }, "RS_media").then((clip: AudioClip) => {
            this.music.playOneShot(clip);
        })
    }
}
@ccclass('SingletonPattern')
export class SingletonPattern extends Component {
    start() {
        console.warn("注意观察两个单例构造执行的时间，饿加载会在代码保存后执行前就构造，懒加载则是在使用时才构造")
    }
    onPlayMusic1() {
        musicMgr_lazy.getInstance().playMusic("audios/ui/木鱼");
    }
    onPlayMusic2() {
        musicMgr_lazy.getInstance().playMusic("audios/ui/success2");
    }
    onPlayMusic3() {
        musicMgr_eager.getInstance().playMusic("audios/ui/sad");
    }
    onPlayMusic4() {
        musicMgr_eager.getInstance().playMusic("audios/ui/switch");
    }
}


