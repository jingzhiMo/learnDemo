// link: https://leetcode.com/problems/subarray-sum-equals-k/
// tag: 1. array
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
    let sum = [0]
    let count = 0
    
    for (let i = 1; i <= nums.length; i++) {
        sum[i] = sum[i - 1] + nums[i - 1]
    }
    
    // console.log(sum)
    
    for (let s = 0; s < nums.length; s++) {
        for (let e = s + 1; e <= nums.length; e++) {
            if (sum[e] - sum[s] === k) {
                count++
            }
        }
    }
    return count
};
