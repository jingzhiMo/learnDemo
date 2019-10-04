// link: https://leetcode.com/problems/validate-binary-search-tree/
// tag: 1. binary-tree

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
    let helper = (node, min, max) => {
        if (!node) return true

        let val = node.val

        if (val <= min || val >= max) return false

        if (node.left && val < node.left.val) return false

        if (node.right && val > node.right.val) return false

        return helper(node.left, min, val) && helper(node.right, val, max)
    }
    return helper(root, -Infinity, Infinity)
};

// 中序处理，正确的二叉搜索树，中序获取的时候，是一个递增的过程
var isValidBST = function(root) {
    if (!root) return true

    let value = -Infinity
    let helper = (node) => {
        if (!node) return true

        if (node.left && !helper(node.left)) {
            return false
        }
        if (value >= node.val) {
            return false
        } else {
            value = node.val
        }

        return helper(node.right)
    }

    return helper(root)
};
