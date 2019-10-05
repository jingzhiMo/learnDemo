// link: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
// tag: 1. binary-tree
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    if (!preorder.length) return null

    let val = preorder[0]
    let i
    // 找到左节点的所有数
    for (i = 0; i < inorder.length; i++) {
        if (inorder[i] === val) break
    }

    return {
        val,
        left: buildTree(preorder.slice(1, i + 1), inorder.slice(0, i)),
        right: buildTree(preorder.slice(i + 1), inorder.slice(i + 1))
    }
};
