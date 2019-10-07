// link: https://leetcode.com/problems/valid-parentheses/
// tag: 1. stack
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  let stack = []
  let dict = {
    '(': ')',
    '[': ']',
    '{': '}'
  }

  for (let i = 0, len = s.length; i < len; i++) {
    let str = s[i]

    // 符合匹配规则，则弹出
    if (dict[stack[stack.length - 1]] === str) {
      stack.pop()
    } else {
      stack.push(str)
    }
  }

  return !stack.length
};
