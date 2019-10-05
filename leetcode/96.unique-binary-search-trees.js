// link: https://leetcode.com/problems/unique-binary-search-trees/
// tag: 1. binary-tree; 2. math
/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function(n) {
    // 注意是数组的长度是：n + 1，不是 n
    let arr = new Array(n + 1).fill(0)

    arr[0] = 1
    arr[1] = 1

    for (let i = 2; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            arr[i] += arr[j - 1] * arr[i - j]
        }
    }

    return arr[n]
};
