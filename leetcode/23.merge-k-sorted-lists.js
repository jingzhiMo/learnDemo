// link: https://leetcode.com/problems/merge-k-sorted-lists/
// tag: 1. linked-list; 2. sort
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    if (!lists.length) return null

    let half = Math.floor(lists.length / 2)

    let mergeTwoList = (l1, l2) => {
        if (!l1) return l2
        if (!l2) return l1

        let head
        let node

        if (l1.val < l2.val) {
            head = l1
            l1 = l1.next
        } else {
            head = l2
            l2 = l2.next
        }

        node = head
        while (l1 && l2) {
            if (l1.val < l2.val) {
                node.next = l1
                l1 = l1.next
            } else {
                node.next = l2
                l2 = l2.next
            }
            node = node.next
        }

        if (!l1) {
            node.next = l2
        } else {
            node.next = l1
        }

        return head
    }
    let merge = (start, end) => {
        if (start === end) return lists[start]

        let mid = start + Math.floor((end - start) / 2)

        return mergeTwoList(merge(start, mid), merge(mid + 1, end))
    }

    return merge(0, lists.length - 1)
};
