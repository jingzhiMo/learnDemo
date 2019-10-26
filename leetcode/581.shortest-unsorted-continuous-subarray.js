// link: https://leetcode.com/problems/shortest-unsorted-continuous-subarray/
// tag: 1. array
// 第一种方法思路：每个值只要大于左边的最大值，小于右边的最小值，则这个位置有效；否则无效
// left, right 分别存储每个位置的最大值与最小值
/**
 * @param {number[]} nums
 * @return {number}
 */
var findUnsortedSubarray = function(nums) {
    let left = []
    let right = []
    let min = Infinity
    let max = -Infinity
    let len = nums.length - 1
    let j

    for (let i = 0, j = len; i < nums.length;) {
        left[i] = max
        right[j] = min
        min = Math.min(min, nums[j])
        max = Math.max(max, nums[i])
        i++
        j--
    }

    let start = 0
    let end = nums.length - 1
    while (start < end) {
        let val = nums[start]

        // 数据有效
        if (val >= left[start] && val <= right[start]) {
            start++
        } else {
            break
        }
    }
    while (start < end) {
        let val = nums[end]

        // 数据有效
        if (val >= left[end] && val <= right[end]) {
            end--
        } else {
            break
        }
    }
    return end > start ? end - start + 1 : 0
};


// 第二种方法思路：先对数组进行排序；如果排序后，排序前后的数组，相同下标的值不等，那么这个位置就是需要更改
var findUnsortedSubarray = function(nums) {
    let cloneNums = nums.slice(0)
    let start = nums.length - 1
    let end = 0

    nums.sort((a, b) => a - b)

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== cloneNums[i]) {
            start = Math.min(i, start)
            end = Math.max(i, end)
        }
    }

    return end > start ? end - start + 1 : 0
};
