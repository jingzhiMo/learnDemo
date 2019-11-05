// link: https://leetcode.com/problems/maximum-product-subarray/
// tag: 1. array 2. dynamic progrmaing
/**
 * @param {number[]} nums
 * @return {number}
 */
// 时间复杂度为O(n^2)
var maxProduct = function(nums) {
    let max = -Infinity

    for (let i = 0; i < nums.length; i++) {
        let sum = nums[i]

        max = Math.max(max, sum)
        for (let j = i + 1; j < nums.length; j++) {
            sum *= nums[j]
            max = Math.max(max, sum)
        }
    }
    return max
};

// 时间复杂度为O(n)
var maxProduct = function(nums) {
    let max = -Infinity
    let tmpMax = 1
    let tmpMin = 1

    for (let i = 0; i < nums.length; i++) {
        let val = nums[i]

        if (val < 0) {
            [tmpMax, tmpMin] = [tmpMin, tmpMax]
        }

        tmpMax = Math.max(tmpMax * val, val)
        tmpMin = Math.min(tmpMin * val, val)

        max = Math.max(tmpMax, max)
    }
    return max
};
