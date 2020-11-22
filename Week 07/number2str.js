function StringToNumber (str) {
    let res = 0
    const hexNum = '0123456789abcdef'
    const octNum = '01234567'
    const binNum = '01'
    if (str.startsWith('0x')) {
      for (let i = 2; i < str.length; i++) {
        res += Number(hexNum.indexOf(str.charAt[i])) * 16 ** (str.length - i - 1)
      }
      
    } else if (str.startsWith('0o')) {
      for (let i = 2; i < str.length; i++) {
        res += Number(octNum.indexOf(str.charAt[i])) * 8 ** (str.length - i - 1)
      }
    } else if (str.startsWith('0b')) {
      for (let i = 2; i < str.length; i++) {
        res += Number(binNum.indexOf(str.charAt[i])) * 2 ** (str.length - i - 1)
      }
    } else {
      res = Number(str)
    }
    return res
  }
  
  function NumberToString (num, numration = 10) {
    let str = ''
    
    const systermOfNumration = {
      16: '0123456789abcdef',
      10: '0123456789',
      8: '01234567',
      2: '01'
    }
    
    while (num > 0) {
      let s = num % numration
      let sStr = systermOfNumration[numration].charAt(s)
      /* 这里搞反了
      str += sStr
      */
      str = sStr + str
      num = Math.floor(num / numration)
    }
    
    return str
  }

  console.log(NumberToString (10000, 8))
  console.log(NumberToString (10000, 16))
  console.log(NumberToString (10000, 10))
