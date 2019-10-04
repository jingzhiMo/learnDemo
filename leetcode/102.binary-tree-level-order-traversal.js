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

var root = {
    val: 3,
    left: {
        val: 9,
        left: null,
        right: null
    },
    right: {
        val: 20,
        left: {
            val: 15,
            left: null,
            right: null
        },
        right: {
            val: 7,
            left: null,
            right: null
        }
    }
}
