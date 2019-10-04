// link: https://leetcode.com/problems/binary-tree-level-order-traversal/
// tag: binary-tree
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if (!root) return []

    let result = []
    let queue = [root]
    let curr

    while (queue.length) {
        let levelResult = []
        // 队列层级对应的元素数量
        let size = queue.length

        for (let i = 0; i < size; i++) {
            let node = queue.shift()

            levelResult.push(node.val)

            if (node.left) {
                queue.push(node.left)
            }

            if (node.right) {
                queue.push(node.right)
            }
        }
        result.push(levelResult)
    }
    return result
};

// 递归解法
var levelOrder = function(root) {
    if (!root) return []

    let result = []

    let helper = (node, level) => {
        if (!result[level]) {
            result[level] = []
        }

        result[level].push(node.val)

        if (node.left) {
            helper(node.left, level + 1)
        }

        if (node.right) {
            helper(node.right, level + 1)
        }
    }
    helper(root, 0)
};
