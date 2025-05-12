/**
 * 算法工具类，包含常见的排序与查找算法
 */
export class Arithmetic {
    /**
     * 生成指定长度和范围的随机整数数组
     * @param length 数组长度
     * @param max 最大随机值（不包含）
     * @returns 随机整数数组
     */
    static generateRandomArray(length: number, max: number): number[] {
        return Array.from({ length }, () => Math.floor(Math.random() * max));
    }

    /**
     * 冒泡排序算法
     * @param arr 输入的数组
     * @returns 排序后的新数组
     */
    static bubbleSort(arr: number[]): number[] {
        const res = [...arr];
        for (let i = 0; i < res.length - 1; i++) {
            for (let j = 0; j < res.length - 1 - i; j++) {
                if (res[j] > res[j + 1]) [res[j], res[j + 1]] = [res[j + 1], res[j]];
            }
        }
        return res;
    }

    /**
     * 快速排序算法（递归实现）
     * @param arr 输入的数组
     * @returns 排序后的新数组
     */
    static quickSort(arr: number[]): number[] {
        if (arr.length <= 1) return arr;
        const pivot = arr[0];
        const left = arr.slice(1).filter(n => n <= pivot);
        const right = arr.slice(1).filter(n => n > pivot);
        return [...this.quickSort(left), pivot, ...this.quickSort(right)];
    }

    /**
     * 插入排序算法
     * @param arr 输入的数组
     * @returns 排序后的新数组
     */
    static insertionSort(arr: number[]): number[] {
        const res = [...arr];
        for (let i = 1; i < res.length; i++) {
            let key = res[i], j = i - 1;
            while (j >= 0 && res[j] > key) {
                res[j + 1] = res[j];
                j--;
            }
            res[j + 1] = key;
        }
        return res;
    }

    /**
     * 线性查找（顺序查找）算法
     * @param arr 输入数组
     * @param target 要查找的目标值
     * @returns 目标值在数组中的索引，找不到返回 -1
     */
    static linearSearch(arr: number[], target: number): number {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === target) return i;
        }
        return -1;
    }

    /**
     * 二分查找算法（数组需先排序）
     * @param arr 已排序的数组
     * @param target 要查找的目标值
     * @returns 目标值的索引，找不到返回 -1
     */
    static binarySearch(arr: number[], target: number): number {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    /**
     * 演示所有排序与查找算法
     * - 自动生成随机数组
     * - 打印排序前后对比
     * - 打印查找结果
     * @param length 数组长度（默认 10）
     * @param max 随机数最大值（默认 100）
     */
    static demoAll(length = 10, max = 100): void {
        const original = this.generateRandomArray(length, max);
        const target = original[Math.floor(Math.random() * length)];

        console.log("原始数组:", original);

        // 排序
        console.log("冒泡排序:", this.bubbleSort(original));
        console.log("快速排序:", this.quickSort(original));
        console.log("插入排序:", this.insertionSort(original));

        // 查找（注意：二分查找要求排序）
        const sorted = this.quickSort(original);
        console.log(`线性查找 ${target}:`, this.linearSearch(original, target));
        console.log(`二分查找 ${target}（排序后）:`, this.binarySearch(sorted, target));
    }
}
