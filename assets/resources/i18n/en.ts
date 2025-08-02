
const win = window as any;

export const languages = {
    // Data
      "test": {
        "a": "test",
        "b": "test2",
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
