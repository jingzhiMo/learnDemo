// link: https://leetcode.com/problems/longest-substring-without-repeating-characters/
// tag: 1. string
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let max = 0
    let map = {}

    for (let i = 0, j = 0; i < s.length; i++) {
        let str = s[i]

        if (map[str]) {
            j = Math.max(map[str], j)
        }

        map[str] = i + 1
        max = Math.max(i - j + 1, max)
    }

    // console.log('max', max)
    return max
};
