/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    let arr = []
    let len = 0
    let i
    let j

    for (let num of nums) {
        i = 0
        j = len

        while(i < j) {
            let mid = Math.floor((i + j) / 2)

            if (arr[mid] < num) {
                i = mid + 1
            } else {
                j = mid
            }
        }
        arr[i] = num

        if(len === j) {
            len++
        }
    }
    return len
};
