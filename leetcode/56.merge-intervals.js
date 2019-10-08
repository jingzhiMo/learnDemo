// link: https://leetcode.com/problems/merge-intervals/
// tag: 1. array 2. sort
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    if (!intervals.length) return []

    if (intervals.length === 1) return intervals
    intervals = intervals.sort((a, b) => {
        if (a[0] === b[0]) return a[1] - b[1]

        return a[0] - b[0]
    })

    let base = intervals[0]
    let result = []

    for (let i = 1; i < intervals.length; i++) {
        // 区间不连续
        if (base[1] < intervals[i][0]) {
            result.push(base)
            base = intervals[i]
        } else {
            base[1] = Math.max(intervals[i][1], base[1])
        }
    }
    result.push(base)
    return result
};
