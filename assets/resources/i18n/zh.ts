
const win = window as any;

export const languages = {
    // Data
    "test": {
        "a": "测试",
        "b": "测试2",
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh = languages;
