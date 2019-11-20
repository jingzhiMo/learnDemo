// tag: 1. array 2. dfs
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b)
    let result = []
    let helper = (base, num, end) => {
        let tmp
        let arr
        for (let i = end; i >= 0; i--) {
            tmp = candidates[i]
            if (num === tmp) {
                result.push([...base, tmp])
            } else if (num > tmp) {
                arr = base.slice(0)
                arr.push(tmp)
                helper([...base, tmp], num - tmp, i - 1)
            }
            while (i - 1 >= 0 && candidates[i - 1] === tmp) {
                i--
            }
        }
    }

    helper([], target, candidates.length - 1)
    return result
};
