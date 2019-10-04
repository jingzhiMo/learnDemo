// link: https://leetcode.com/problems/flatten-binary-tree-to-linked-list/
// tag: 1. binary; 2. single-link
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    // null 或者叶子结点
    if (!root || (!root.left && !root.right)) return root

    let right = flatten(root.right)

    root.right = flatten(root.left)
    root.left = null

    let node = root
    while (node.right) {
        node = node.right
    }
    node.right = right
    return root
};
