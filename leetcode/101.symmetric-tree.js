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
var isSymmetric = function(root) {
    if (!root) return true

    let queue = [root, root]

    while (queue.length) {
        let t1 = queue.shift()
        let t2 = queue.shift()

        if (t1 === null && t2 === null) {
            continue
        }

        if (!t1 || !t2) return false

        // 根节点值不同
        if (t1.val !== t2.val) return false

        queue.push(t1.left)
        queue.push(t2.right)
        queue.push(t1.right)
        queue.push(t2.left)
    }

    return true
};

// 递归解法
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if (!root) return true

    let isMirror = (t1, t2) => {
        if (t1 === null && t2 === null) return true

        if (!t1 || !t2) return false

        if (t1.val !== t2.val) return false

        return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)
    }

    return isMirror(root, root)
};
