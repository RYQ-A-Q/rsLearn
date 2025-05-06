import { AssetManager, AudioClip, AudioSource } from "cc";
import { AudioConfig } from "../config/AudioConfig";
/**音效管理器 */
class AudioMgr {
    private audio: AudioSource[] = []
    private audioBg: AudioSource = new AudioSource();
    public static readonly instance: AudioMgr = new AudioMgr();
    private allAclicp: { [key: string]: AudioClip } = {}
    private bgVolume: number = 1.0
    private effectVolume: number = 1.0
    private audioLength: number = 10
    private _curAudioIndex: number = 0
    private bundle: AssetManager.Bundle
    private get curAudioIndex() {
        return this._curAudioIndex
    }
    private set curAudioIndex(value: number) {
        this._curAudioIndex = value > (this.audioLength - 1) ? 0 : value
    }
    constructor() {
        for (let i = 0; i < this.audioLength; i++) {
            this.audio.push(new AudioSource());
        }

    }
    /**启动初始化 */
    init(config: any, bundle: AssetManager.Bundle) {
        AudioConfig.loadConfig(config)
        this.bundle = bundle
    }
    /**使用AudioConfig中的方法获取name再进行传入,否则传入bundle下的资源路径 */
    public playEffect(path: string, volume: number = 1.0) {
        if (this.allAclicp[path]) {
            this.playEffectClip(this.allAclicp[path], volume);
        } else {
            this.bundle?.load(path, AudioClip, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                } else {
                    this.allAclicp[path] = clip;
                    this.playEffectClip(clip, volume);
                }
            })
        }
    }
    /**传入audios/bg下的音乐名,使用AudioConfig中的方法获取name forecePlay为true时强制播放 */
    public playBg(name: string, volume: number = 1.0, forecePlay: boolean = false) {
        if (!forecePlay && this.audioBg.playing && this.audioBg.clip?.name == name) { return }
        this.audioBg.stop()
        if (this.allAclicp[name]) {
            this.playBgClip(this.allAclicp[name], volume);
        } else {
            this.bundle?.load(name, AudioClip, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                } else {
                    clip.name = name;
                    this.allAclicp[name] = clip;
                    this.playBgClip(this.allAclicp[name], volume);
                }
            })
        }
    }
    private playEffectClip(clip: AudioClip, volume: number) {
        this.audio[this.curAudioIndex].clip = clip;
        this.audio[this.curAudioIndex].volume = this.effectVolume * volume;
        this.audio[this.curAudioIndex].loop = false;
        this.audio[this.curAudioIndex].play();
        this.curAudioIndex++
    }
    private playBgClip(clip: AudioClip, volume: number) {
        this.audioBg.clip = clip;
        this.audioBg.volume = this.bgVolume * volume;
        this.audioBg.loop = true;
        this.audioBg.play();
    }
    public stopBg() {
        this.audioBg.stop();
    }
    /**设置全局背景音总量 */
    public setGlobalBgVolume(volume: number) {
        this.audioBg.volume = this.bgVolume = volume
    }
    /**设置全局音效音总量 */
    public setGlobalEffectVolume(volume: number) {
        this.audio.forEach(element => {
            element.volume = this.effectVolume = volume;
        });
    }
}
export const audioMgr = AudioMgr.instance;