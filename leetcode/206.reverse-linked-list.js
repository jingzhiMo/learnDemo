// link: https://leetcode.com/problems/reverse-linked-list/
// tag: 1. link-list
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    if (!head || !head.next) return head

    let prev = head
    let node = head.next
    let next

    prev.next = null
    while (node) {
        next = node.next
        node.next = prev
        prev = node
        node = next
    }

    return prev
};

// 递归方法
var reverseList = function(head) {
    if (!head || !head.next) return head

    // 翻转后的新指针头
    let newHead = reverseList(head.next)

    // 先形成环状，为翻转后指针的的尾部
    head.next.next = head
    // 再断开当前的指针
    head.next = null
    return newHead
};
