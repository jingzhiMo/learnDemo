// link:
// tag: 1. DFS 2. array
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands =  function(grid) {
    if (!grid.length) return 0

    let row = grid.length
    let column = grid[0].length
    let expand = (r, c) => {
        if (r < 0 || r >= row) return false
        if (c < 0 || c >= column) return false
        // 已经走过该点
        if (grid[r][c] === "2") return false

        let result = grid[r][c] === "1"

        // 置为已经过
        grid[r][c] = "2"

        if (!result) return false

        // top, right, bottom, left
        expand(r - 1, c)
        expand(r, c + 1)
        expand(r + 1, c)
        expand(r, c - 1)

        return result
    }

    let count = 0
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            // 还没有路过该点
            if (grid[i][j] !== "2" && expand(i, j)) {
                count++
            }
        }
    }

    return count
};
