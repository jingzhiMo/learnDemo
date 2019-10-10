// link: https://leetcode.com/problems/string-to-integer-atoi/submissions/
// tag: 1. math 2. string
/**
 * @param {string} str
 * @return {number}
 */
const MAX = Math.pow(2, 31) - 1
const MIN = -Math.pow(2, 31)
var myAtoi = function(str) {
    str = str.trim()
    if (!str.length) return 0

    let minus = 1
    let i = 0
    let p = /\d/
    let head = str[0]
    let num = 0

    if (head === '-') {
        minus = -1
        i++
    } else if (head === '+') {
        i++
    }

    while (i < str.length) {
        let s = str[i]

        if (!p.test(s)) break

        num = num * 10 + parseInt(s)
        i++
    }

    // console.log('num', num, minus)
    // 正数
    if (minus > 0) {
        return num > MAX ? MAX : num
    } else {
        num *= -1
        return num < MIN ? MIN : num
    }
};
