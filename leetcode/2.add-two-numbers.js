// link: https://leetcode.com/problems/add-two-numbers/
// tag: 1. linked-list 2. math
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    let head = {}
    let node = head
    let pre
    let isTen = 0

    while (l1 && l2) {
        node.val = l1.val + l2.val + isTen
        isTen = node.val >= 10 ? 1 : 0
        node.val = node.val % 10
        l1 = l1.next
        l2 = l2.next
        pre = node
        node.next = {}
        node = node.next
    }
    pre.next = null

    if (!l1) {
        l1 = l2
    }

    pre.next = l1
    node = l1

    while (isTen && node) {
        node.val = node.val + isTen
        isTen = node.val >= 10 ? 1 : 0
        node.val = node.val % 10
        pre = node
        node = node.next
    }

    if (isTen) {
        pre.next = {
            val: 1,
            next: null
        }
    }

    return head
};
