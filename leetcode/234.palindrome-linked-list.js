// link: https://leetcode.com/problems/palindrome-linked-list/
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
 * @return {boolean}
 */
var isPalindrome = function(head) {
    if (!head || !head.next) return true

    let slow = head
    let fast = head

    // 快慢指针找到中点
    while (fast && fast.next) {
        slow = slow.next
        fast = fast.next.next
    }

    // 链表长度奇数个
    if (fast) {
        slow = slow.next
    }

    // 翻转后半部分链表
    let prev = slow
    let node = slow.next
    let next

    prev.next = null
    while (node) {
        next = node.next
        node.next = prev
        prev = node
        node = next
    }

    while (prev) {
        if (prev.val !== head.val) return false

        prev = prev.next
        head = head.next
    }
    return true
};
