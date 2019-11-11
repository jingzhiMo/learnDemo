// tag: 1. array 2. dfs
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    let row = board.length
    let column = board[0].length
    let wordLength = word.length

    let helper = (i, j, index) => {
        if (index === wordLength) return true
        // 越界
        if (i < 0 || j < 0 || i >= row || j >= column) return false

        // 已访问过
        if (board[i][j].length === 2) return false

        // 数值不同
        if (board[i][j] !== word[index]) return false

        // 标识已经走过该点
        board[i][j] += '_'
        // 上右下左地遍历
        let nextIndex = index + 1

        if (helper(i - 1, j, nextIndex)) return true

        if (helper(i, j + 1, nextIndex)) return true

        if (helper(i + 1, j, nextIndex)) return true

        if (helper(i, j - 1, nextIndex)) return true

        // 还原数据
        board[i][j] = word[index]
        return false
    }
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            if (board[i][j] === word[0]) {
                if (helper(i, j, 0, -1, -1)) return true
            }
        }
    }

    return false
};
