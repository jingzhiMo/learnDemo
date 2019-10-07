// link: https://leetcode.com/problems/decode-string/
// tag: 1. stack 2. string
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
    let num = 0
    let str = ''
    // 可以改为一个栈，每次是元组方式加入：[1, 'a', 2, 'c']，每次pop，则pop两次
    let strStack = []
    let numStack = []
    let tmp
    let result = ''

    for (let i = 0; i < s.length; i++) {
        tmp = s[i]

        // 左中括号
        if (tmp === '[') {
            strStack.push(str)
            numStack.push(num)
            str = ''
            num = 0
        } else if (tmp === ']') {
            // 出栈
            num = numStack.pop()
            str = str.repeat(num)

            str = strStack.pop() + str
            // 没有嵌套的字符串，则拼接到结果中
            if (!numStack.length) {
                result += str
                str = ''
            }
            num = 0
        } else if (/\d/.test(tmp)) {
            // 是数字
            num = num * 10 + parseInt(tmp)
        } else {
            str += tmp
        }
    }
    return result + str
};
