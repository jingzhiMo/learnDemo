// tag: 1. array; 2. math
/**
 * @param {number[]} nums
 * @return {number}
 */
// 空间复杂度为 O(n) 时间复杂度为 O(n)
var missingNumber = function(nums) {
    let arr = new Array(nums.length + 1)

    for (let i = 0; i < nums.length; i++) {
        arr[nums[i]] = true
    }

    for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) return i
    }
};

/**
 * @param {number[]} nums
 * @return {number}
 */
// 空间复杂度为 O(1) 时间复杂度为 O(n)
var missingNumber = function(nums) {
    let sum = (nums.length + 1) * nums.length / 2
    let count = 0

    for (let i = 0; i < nums.length; i++) {
        count += nums[i]
    }

    return sum - count
};
