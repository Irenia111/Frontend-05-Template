/*
 * 1. 建表
 * 2. 匹配
 */

 function kmp (source, pattern) {
     let table = new Array(pattern.length).fill(0)
    // 计算table
    {
        let i = 1, j = 0
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                i++, j++
                table[i] = j
            } else {
                //不匹配的情况
                if (j > 0) {
                    // 如果之前有重复的模式，就回退到之前的位置
                    j = table[j]
                } else {
                    // 继续查找，回退到一开始的位置
                    i++

                }
            }
        }
    }

    //匹配
    {
        let i = 0, j =0
        // j 对应pattern i对应source
        while (i < source.length) {
            
            if (pattern[j] === source[i]) {
                i++, j++
            } else {
                // 未匹配，回退
                if (j > 0) {
                    j = table[j]
                } else {
                    i++
                }
            }

            if (j === pattern.length) {
                return true
            }

            return false
        }
    }
 }

 kmp("sdfjykafdfdabc", 'abc')