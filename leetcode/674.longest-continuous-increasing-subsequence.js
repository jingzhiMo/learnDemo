// tag: 1. array 2. dp
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function(nums) {
    if (!nums.length) return 0

    let i = 1
    let j = 0
    let maxLen = 1

    for (; i < nums.length; i++) {
        if (nums[i] <= nums[i - 1]) {
            maxLen = Math.max(maxLen, i - j)
            j = i
        }
    }

    maxLen = Math.max(maxLen, i - j)
    return maxLen
};
