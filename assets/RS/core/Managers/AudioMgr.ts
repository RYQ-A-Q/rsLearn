import { AssetManager, AudioClip, AudioSource } from "cc";
import { AudioConfig } from "../config/AudioConfig";
import { Node } from "cc";
import { instantiate } from "cc";
/**音效管理器 */
class AudioMgr {
    private audio: AudioSource[] = []
    private audioBg: AudioSource
    public static readonly instance: AudioMgr = new AudioMgr();
    private allAclicp: { [key: string]: AudioClip } = {}
    private bgVolume: number = 1.0
    private effectVolume: number = 1.0
    private audioLength: number = 3
    private _curAudioIndex: number = 0
    private bundle: AssetManager.Bundle
    private get curAudioIndex() {
        return this._curAudioIndex
    }
    private set curAudioIndex(value: number) {
        this._curAudioIndex = value > (this.audioLength - 1) ? 0 : value
    }
    constructor() {
    }
    /**启动初始化 */
    init(config: any, bundle: AssetManager.Bundle, audioSourceGroup: Node) {
        AudioConfig.loadConfig(config)
        this.audioBg = audioSourceGroup.children[0].addComponent(AudioSource)
        for (let i = 0; i < this.audioLength; i++) {
            const newNode = instantiate(audioSourceGroup.children[0])
            this.audio[i] = newNode.getComponent(AudioSource)
            this.audio[i].playOnAwake = false
            this.audio[i].loop = false
            audioSourceGroup.addChild(newNode)
        }
        this.bundle = bundle
        for (const key in rs.enum.FileName_audioUi) {
            const path = AudioConfig.getUi(rs.enum.FileName_audioUi[key]);
            this.bundle?.load(path, AudioClip, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                } else {
                    this.allAclicp[path] = clip;
                }
            })
        }
    }
    /**使用AudioConfig中的方法获取name再进行传入,否则传入bundle下的资源路径
     * @param path 音频路径
     * @param volume 音量
     * @param onShot 是否单次播放
     * @param bundleName 音频所在bundle，不在rs的媒体包中才需要单独写
     * @returns 播放的节点
     */
    public playEffect(path: string, volume: number = 1.0, onShot: boolean = false, bundleName: string = null): Node {
        if (this.allAclicp[path]) {
            console.log("旧的" + path)
            return this.playEffectClip(this.allAclicp[path], onShot, volume);
        } else {
            console.log("新的" + path)
            if (bundleName != null) {
                rs.bundle.getBundle(bundleName).then((bundle) => {
                    if (bundle) {
                        bundle.load(path, AudioClip, (err, clip: AudioClip) => {
                            if (err) {
                                console.log(err);
                            } else {
                                this.allAclicp[path] = clip;
                                return this.playEffectClip(clip, onShot, volume);
                            }
                        })
                    }
                })
            } else {
                this.bundle?.load(path, AudioClip, (err, clip: AudioClip) => {
                    if (err) {
                        console.log(err);
                    } else {
                        this.allAclicp[path] = clip;
                        return this.playEffectClip(clip, onShot, volume);
                    }
                })
            }
        }
    }
    /**传入audios/bg下的音乐名,使用AudioConfig中的方法获取name forecePlay为true时强制播放
     * @param path 音频路径
     * @param volume 音量
     * @param onShot 是否单次播放
     * @param bundleName 音频所在bundle，不在rs的媒体包中才需要单独写
     * @returns 播放的节点
     */
    public playBg(path: string, volume: number = 1.0, forecePlay: boolean = false, bundleName: string = null): Node {
        if (!forecePlay && this.audioBg.playing && this.audioBg.clip?.name == path) { return }
        this.audioBg.stop()
        if (this.allAclicp[path]) {
            this.playBgClip(this.allAclicp[path], volume);
        } else {
            if (bundleName != null) {
                rs.bundle.getBundle(bundleName).then((bundle) => {
                    if (bundle) {
                        bundle.load(path, AudioClip, (err, clip: AudioClip) => {
                            if (err) {
                                console.log(err);
                            } else {
                                this.allAclicp[path] = clip;
                                this.playBgClip(clip, volume);
                            }
                        })
                    }
                })
            } else {
                this.bundle?.load(path, AudioClip, (err, clip: AudioClip) => {
                    if (err) {
                        console.log(err);
                    } else {
                        this.allAclicp[path] = clip;
                        this.playBgClip(this.allAclicp[path], volume);
                    }
                })
            }

        }
        return this.audioBg.node
    }
    private playEffectClip(clip: AudioClip, onShot: boolean, volume: number): Node {
        this.audio[this.curAudioIndex].volume = this.effectVolume * volume;
        this.audio[this.curAudioIndex].loop = false;
        if (onShot) {
            this.audio[this.curAudioIndex].playOneShot(clip)
            return
        }
        this.audio[this.curAudioIndex].clip = clip;
        this.audio[this.curAudioIndex].play();
        const playNode = this.audio[this.curAudioIndex].node
        this.curAudioIndex++
        return playNode
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
    destroyClip(path: string) {
        const clip = this.allAclicp[path];
        if (clip && clip.isValid) {
            if (this.audioBg.clip == clip) {
                this.audioBg.stop();
                this.audioBg.clip = null;
            }
            this.audio.forEach(e => {
                if (e.clip == clip) {
                    e.stop();
                    e.clip = null
                }
            });
            clip.destroy();
            delete this.allAclicp[path];
            console.log(`Audio clip at path "${path}" destroyed.`);
        } else {
            console.warn(`No valid clip found for path "${path}".`);
        }
    }

    destroyAllClips() {
        this.audioBg.stop();
        this.audioBg.clip = null;
        this.audio.forEach(e => {
            e.stop();
            e.clip = null
        });
        for (const key in this.allAclicp) {
            const clip = this.allAclicp[key];
            if (clip && clip.isValid) {
                clip.destroy();
            }
        }
        this.allAclicp = {};
    }

}
export const audioMgr = AudioMgr.instance;