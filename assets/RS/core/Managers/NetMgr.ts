/**网络管理 */
class NetMgr {
    public static readonly instance: NetMgr = new NetMgr();
    private constructor() { }
    public async get(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        } catch (error) {
                            resolve(xhr.responseText);
                        }
                    } else {
                        reject(new Error(`HTTP GET Error: ${xhr.status}`));
                    }
                }
            };
            xhr.send();
        });
    }

    public async post(url: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(`HTTP POST Error: ${xhr.status}`));
                    }
                }
            };
            xhr.send(JSON.stringify(data));
        });
    }
}
export const netMgr = NetMgr.instance;
