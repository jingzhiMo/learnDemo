// link: https://leetcode-cn.com/problems/linked-list-cycle-ii/
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
var detectCycle = function(head) {
    if (!head || !head.next) return null

    let slow = head
    let fast = head
    let pos = 0

    while (fast && fast.next) {
        slow = slow.next
        fast = fast.next.next

        if (slow === fast) break
    }

    // 没有环
    if (slow !== fast) return null

    while (head !== slow) {
        head = head.next
        slow = slow.next
        pos++
    }

    return slow
};
