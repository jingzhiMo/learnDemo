// link: https://leetcode.com/problems/unique-paths/
// tag: 1. dp 2. Array
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
    let dp = []

    let getValue = (i, j) => {
        if (i < 0) return 0

        if (j < 0) return 0

        return dp[i][j]
    }
    for (let r = 0; r < n; r++) {
        dp[r] = new Array(m).fill(0)
    }
    dp[0][0] = 1
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < m; c++) {
            dp[r][c] = dp[r][c] + getValue(r - 1, c) + getValue(r, c - 1)
        }
    }

    return dp[n - 1][m - 1]
};
