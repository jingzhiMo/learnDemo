// link: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
// tag: 1. array
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    let helper = (left, right) => {
        if (right < left) return -1

        let mid = Math.floor((left + right) / 2)

        if (nums[mid] === target) return mid

        if (nums[mid] > target) return helper(left, mid - 1)

        return helper(mid + 1, right)
    }
    let pos = helper(0, nums.length - 1)

    if (pos === -1) return [-1, -1]

    let start
    let end
    let i = pos

    // 找到结束下标
    while (nums[i] === target) {
        i++
    }

    end = i - 1
    i = pos

    // 找到开始下标
    while (nums[i] === target) {
        i--
    }
    start = i + 1

    return [start, end]
}
