export class GoodInfo {
    public code: string = '';
    public name: string = '';
    public store: number = 1;
    public imgPath: string = '';
    constructor(code: string, name: string, store: number, imgPath?: string) {
        this.code = code
        this.name = name;
        this.store = store;
        this.imgPath = imgPath ?? name;
    }
}