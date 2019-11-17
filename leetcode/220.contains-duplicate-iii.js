// tag: 1. array
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} t
 * @return {boolean}
 */
// 时间复杂度为 O(n^2)
var containsNearbyAlmostDuplicate = function(nums, k, t) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (Math.abs(nums[j] - nums[i]) <= t && Math.abs(j - i) <= k) {
                return true
            }
        }
    }

    return false
};

// 时间复杂度为 O(n*k)
var containsNearbyAlmostDuplicate = function(nums, k, t) {
    while (k >= 0) {
        for (let i = k; i < nums.length; i++) {
            if (Math.abs(nums[i] - nums[i - k]) <= t && i !== i -k) {
                return true
            }
        }
        k--
    }

    return false
};
