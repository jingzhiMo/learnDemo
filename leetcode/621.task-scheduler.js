// link: https://leetcode.com/problems/task-scheduler/submissions/
// tag: 1. array
/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */

var leastInterval = function(tasks, n) {
    let arr = new Array(26).fill(0)
    let baseCode = 'A'.charCodeAt()
    let time = 0
    let sum = tasks.length

    for (let i = 0; i < tasks.length; i++) {
        arr[tasks[i].charCodeAt() - baseCode]++
    }

    arr = arr.filter(num => num !== 0)
    arr.sort((a, b) => b - a)

    while (sum > 0) {
        let len = arr.length
        for (let i = 0; i <= n; i++) {
            if (sum === 0) break
            time++
            if (i >= len) continue
            sum--
            arr[i]--
        }
        arr = arr.filter(num => num !== 0)
        arr.sort((a, b) => b - a)
    }
    return time
}
