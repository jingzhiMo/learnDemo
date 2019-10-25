// link: https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/
// tag: 1. array
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function(nums) {
    let index
    let value
    for (let i = 0; i < nums.length; i++) {
        index = Math.abs(nums[i]) - 1
        value = nums[index]
        
        if (value < 0) continue
        nums[index] = value * -1
    }
    
    let result = []
    
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            result.push(i + 1)
        }
    }
    
    return result
};
