// tag: 1. array
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
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
                helper([...base, tmp], num - tmp, i)
            }
        }
    }

    helper([], target, candidates.length - 1)
    return result
};
