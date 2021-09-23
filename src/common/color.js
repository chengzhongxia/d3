export default class {
  constructor() {}
  static darker(color, level) {
    const r = /^\#?([0-9A-Fa-f]{3}){1}([0-9A-Fa-f]{3})?$/
    if (!r.test(color)) {
      alert('输入错误的颜色hex值！')
      return
    }
    const rbgs = this.HexToRgb(color)
    const hexs = rbgs?.map(rgb => Math.floor(rgb * (1 - level)))
    if (hexs) {
      return this.RgbToHex(hexs[0], hexs[1], hexs[2])
    } else {
      return color
    }
  }

  static lighter(color, level) {
    const r = /^\#?([0-9A-Fa-f]{3}){1}([0-9A-Fa-f]{3})?$/
    if (!r.test(color)) {
      alert('输入错误的颜色hex值！')
      return
    }
    const rbgs = HexToRgb(color)
    const hexs = rbgs?.map(rgb => Math.floor((255 - rgb) * level) + rgb)
    if (hexs) {
      return RgbToHex(hexs[0], hexs[1], hexs[2])
    } else {
      return color
    }
  }

  static RgbToHex(a, b, c) {
    const r = /^\d{1,3}$/
    if (!r.test(a.toString()) || !r.test(b.toString()) || !r.test(c.toString())) {
      alert('输入错误的颜色rbg值！')
    }
    const hexs = [a.toString(16), b.toString(16), c.toString(16)]
    const hex = hexs.map(hex => (hex.length > 1 && hex) || '0' + hex).join('')
    // const hex = hexs.map(hex => hex.length>1 || '0'+hex).reduce((t,v)=>`${t}${v}`)
    return '#' + hex
  }

  static HexToRgb(color) {
    const r = /^\#?([0-9A-Fa-f]{3}){1}([0-9A-Fa-f]{3})?$/
    if (!r.test(color)) {
      alert('输入错误的颜色hex值！')
    }
    color = color.replace('#', '')

    const hexs = color.match(/../g)
    const rgbs = hexs?.map(hex => parseInt(hex, 16))
    return rgbs
  }
}
