export interface IStorageEncryption {
    decrypt(str: string): string;
    encrypt(str: string): string;
    encryptKey(str: string): string;
}