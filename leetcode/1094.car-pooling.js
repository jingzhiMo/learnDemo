// tag: 1. array
/**
 * @param {number[][]} trips
 * @param {number} capacity
 * @return {boolean}
 */
// 方案一：先对数据进行排序
var carPooling = function(trips, capacity) {
    trips.sort((a, b) => a[1] - b[1])
    let queue = [] // ['end', 'capacity']

    for (let i = 0; i < trips.length; i++) {
        let pos = trips[i][1]

        // 查看是否有客需要下，优先下客
        for (let j = 0; j < queue.length; j++) {
            if (queue[j][0] <= pos) {
                capacity += queue[j][1]
                queue.splice(j, 1)
                j--
            }
        }

        // 满员
        if (capacity < trips[i][0]) {
            return false
        }

        // 再上客
        queue.push([trips[i][2], trips[i][0]])
        capacity -= trips[i][0]
    }

    return true
};

// 方案二：遍历存储上下车的点
var carPooling = function(trips, capacity) {
    let queue = new Array(1001).fill(0)

    for (let i = 0; i < trips.length; i++) {
        queue[trips[i][1]] += trips[i][0]
        queue[trips[i][2]] -= trips[i][0]
    }

    for (let i = 1; i < 1001; i++) {
        queue[i] += queue[i - 1]

        if (queue[i] > capacity) return false
    }

    return true
}
