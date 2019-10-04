// link: https://leetcode.com/problems/binary-tree-inorder-traversal/
// tag: 1. binary-tree; 2. stack

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    let result = []
    let helper = (node) => {
        if (!node) return

        if (node.left) {
            helper(node.left)
        }
        result.push(node.val)
        helper(node.right)
    }
    helper(root)
    return result
};

// 迭代解法
var inorderTraversal = function(root) {
    if (!root) return []

    let stack = []
    let result = []
    let curr = root

    while (stack.length || curr) {
        while (curr) {
            stack.push(curr)
            curr = curr.left
        }

        curr = stack.pop()
        result.push(curr.val)
        curr = curr.right
    }

    return result
};
