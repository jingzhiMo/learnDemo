// link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
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
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    let quickHead = head
    let node = head

    for (let i = 0; i < n; i++) {
        quickHead = quickHead.next
    }

    // 删除头标签
    if (!quickHead) return head.next

    quickHead = quickHead.next

    while (quickHead) {
        quickHead = quickHead.next
        node = node.next
    }

    node.next = node.next.next

    return head
}

// 快慢指针解法
// 快指针先到达尾部，慢指针到中点；
// 这个时候知道链表的长度，即可删除结点
var removeNthFromEnd = function(head, n) {
    if (!head || !head.next) return null

    let slow = head
    let fast = head
    let len = 0
    let start

    while (fast && fast.next) {
        slow = slow.next
        fast = fast.next.next
        len++
    }

    len *= 2

    // 链表数量为奇数个
    if (fast) {
        len++
    }

    start = len - n - 1

    if (start < 0) return head.next

    let node
    // 删除的节点在后半部分
    if (start >= len / 2) {
        start -= Math.floor(len / 2)
        node = slow
    } else {
        node = head
    }

    while (start > 0) {
        start--
        node = node.next
    }

    node.next = node.next.next

    return head
};
