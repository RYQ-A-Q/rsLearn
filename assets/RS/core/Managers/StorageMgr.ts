import { sys, error, warn } from "cc";
import { DEV } from "cc/env";
import { IStorageEncryption } from "../common/lib";

class StorageMgr {
    private _id: string = "";
    private _security: IStorageEncryption | null = null;

    /** 是否启用加密（DEV 环境关闭加密） */
    private get encrypted(): boolean {
        return !DEV;
    }

    /** 初始化：设置ID前缀和加密方式 */
    init(id: string, security: IStorageEncryption) {
        this._id = id;
        this._security = security;
    }

    private getKey(key: string): string {
        if (!this._id) return key;
        return `${this._id}_${key}`;
    }

    set(key: string, value: any): void {
        if (!key) {
            error("存储的 key 不能为空");
            return;
        }

        let storeKey = this.getKey(key);
        if (this.encrypted && this._security) {
            storeKey = this._security.encryptKey(storeKey);
        }

        if (value === null || value === undefined) {
            warn("值为空，自动移除该键值对");
            this.remove(key);
            return;
        }

        if (typeof value === "function") {
            error("不能存储 function 类型");
            return;
        }

        // 统一转换为字符串
        if (typeof value === "object") {
            try {
                value = JSON.stringify(value);
            } catch (e) {
                error(`对象序列化失败: ${e}`);
                return;
            }
        } else {
            value = String(value);
        }

        if (this.encrypted && this._security) {
            value = this._security.encrypt(value);
        }

        sys.localStorage.setItem(storeKey, value);
    }

    get(key: string, defaultValue: any = ""): string {
        if (!key) {
            error("key不能为空");
            return null!;
        }

        let storeKey = this.getKey(key);
        if (this.encrypted && this._security) {
            storeKey = this._security.encryptKey(storeKey);
        }

        let str = sys.localStorage.getItem(storeKey);
        if (str && this.encrypted && this._security) {
            str = this._security.decrypt(str);
        }

        return str ?? defaultValue;
    }

    getNumber(key: string, defaultValue: number = 0): number {
        const str = this.get(key);
        return str === "0" ? 0 : parseInt(str) || defaultValue;
    }

    getBoolean(key: string): boolean {
        return this.get(key) === "true";
    }

    getJson<T = any>(key: string, defaultValue: T = {} as T): T {
        try {
            const str = this.get(key);
            return (str && JSON.parse(str)) || defaultValue;
        } catch (e) {
            warn(`解析JSON失败: ${e}`);
            return defaultValue;
        }
    }

    remove(key: string): void {
        if (!key) {
            error("key不能为空");
            return;
        }

        let storeKey = this.getKey(key);
        if (this.encrypted && this._security) {
            storeKey = this._security.encryptKey(storeKey);
        }

        sys.localStorage.removeItem(storeKey);
    }

    clear(): void {
        sys.localStorage.clear();
    }
}

export const storageMgr = new StorageMgr();
