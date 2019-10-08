// link: https://leetcode.com/problems/sort-colors/
// tag: 1. sort
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {
    if (!nums.length) return nums

    let head = 0
    let tail = nums.length - 1

    for (let i = 0; i <= tail; i++) {
        if (nums[i] === 0) {
            [nums[i], nums[head]] = [nums[head], nums[i]]
            head++
            continue
        }

        if (nums[i] === 2) {
            [nums[i], nums[tail]] = [nums[tail], nums[i]]
            tail--
            i--
        }
    }

    return nums
};
