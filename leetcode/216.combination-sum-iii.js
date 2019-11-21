// tag: 1. array 2. dfs
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function(k, n) {
    let num = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let result = []

    let helper = (base, count, sum, start) => {
        for (let i = start; i < 9; i++) {
            let distance = sum - num[i]
            if (distance === 0) {
                if (count === 1) {
                    result.push([...base, num[i]])
                }
                break
            } else if (distance > 0) {
                helper([...base, num[i]], count - 1, distance, i + 1)
            } else {
                break
            }
        }
    }
    helper([], k, n, 0)
    return result
};
