// tag: 1. array
/**
 * @param {number[][]} trips
 * @param {number} capacity
 * @return {boolean}
 */
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
