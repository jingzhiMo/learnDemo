// link: https://leetcode.com/problems/minimum-path-sum/
// tag: 1. dp 2. array
/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    let getValue = (r, c) => {
        if (r < 0) return Infinity

        if (c < 0) return Infinity

        return grid[r][c]
    }
    let m = grid.length
    let n = grid[0].length

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i === 0 && j === 0) continue

            grid[i][j] = Math.min(getValue(i - 1, j), getValue(i, j - 1)) + grid[i][j]
        }
    }

    return grid[m - 1][n - 1]
};
