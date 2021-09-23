import * as d3 from 'd3'
export default class {
  constructor(svg, baseColor, highCount) {
    this.svg = svg
    this.baseColor = baseColor || '#2d3c41'
    this.highCount = highCount || '#5D858D'
  }
  draw(id, percent, options) {
    this.options = Object.assign({ cx: 0, cy: 0, rx: 70, ry: 45, h: 8, ir: 0.5 }, options)

    const count = Math.round((percent / 100) * 32)

    const _data = d3
      .pie()
      .sort(null)
      .value(d => d.value)(Array(32).fill({ value: 1 }))

    const slices = this.svg
      .append('g')
      .attr('id', id)
      .attr('transform', `translate(${this.options.cx},${this.options.cy})`)
      .attr('class', 'slices')

    const group = slices
      .selectAll('g')
      .data(_data)
      .enter()
      .append('g')
      .each(function(d) {
        this._current = d
      })

    group
      .append('path')
      .attr('class', 'top')
      .attr('d', d => this.pieTop(d, this.options.rx, this.options.ry, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return this.highCount
        } else {
          return this.baseColor
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)

    group
      .append('path')
      .attr('class', 'inner')
      .attr('d', d => this.pieInner(d, this.options.rx, this.options.ry, this.options.h, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return this.highCount
        } else {
          return this.baseColor
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)

    group
      .append('path')
      .attr('class', 'outer')
      .attr('d', d => this.pieOuter(d, this.options.rx, this.options.ry, this.options.h))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return this.highCount
        } else {
          return this.baseColor
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)
      .attr('fill-opacity', 0.9)

    group
      .append('path')
      .attr('class', 'side-left')
      .attr('d', d => this.pieSideLeft(d, this.options.rx, this.options.ry, this.options.h, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return d3.hsl(this.highCount).darker(.2)
        } else {
          return d3.hsl(this.baseColor).darker(.2)
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)
      .attr('fill-opacity', 0.9)

    group
      .append('path')
      .attr('class', 'side-right')
      .attr('d', d => this.pieSideRight(d, this.options.rx, this.options.ry, this.options.h, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return d3.hsl(this.highCount).darker(.2)
        } else {
          return d3.hsl(this.baseColor).darker(.2)
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)
      .attr('fill-opacity', 0.9)
  }

  changePercent(id, percent) {
    const count = Math.round((percent / 100) * 32)

    this.svg
      .select('#' + id)
      .selectAll('.top')
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return this.highCount
        } else {
          return this.baseColor
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)

    this.svg.select('#' + id)
      .selectAll('.inner')
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return this.highCount
        } else {
          return this.baseColor
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)

    this.svg.select('#' + id)
      .selectAll('.outer')
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return this.highCount
        } else {
          return this.baseColor
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)
      .attr('fill-opacity', 0.9)

    this.svg.select('#' + id)
      .selectAll('.side-left')
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return d3.hsl(this.highCount).darker(.2)
        } else {
          return d3.hsl(this.baseColor).darker(.2)
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)
      .attr('fill-opacity', 0.9)

    this.svg.select('#' + id)
      .selectAll('.side-right')
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else if (i < count) {
          return d3.hsl(this.highCount).darker(.2)
        } else {
          return d3.hsl(this.baseColor).darker(.2)
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(10)
      .delay((d, i) => 10 * i)
      .attr('opacity', 1)
      .attr('fill-opacity', 0.9)
  }

  init(id, options) {
    this.options = Object.assign({ cx: 0, cy: 0, rx: 90, ry: 60, h: 10, ir: 0.5 }, options)

    const _data = d3
      .pie()
      .sort(null)
      .value(d => d.value)(Array(32).fill({ value: 1 }))

    const slices = this.svg
      .append('g')
      .attr('id', id)
      .attr('transform', `translate(${this.options.cx},${this.options.cy})`)
      .attr('class', 'slices')

    const group = slices
      .selectAll('g')
      .data(_data)
      .enter()
      .append('g')
      .each(function(d) {
        this._current = d
      })

    group
      .append('path')
      .attr('class', 'top')
      .attr('d', d => this.pieTop(d, this.options.rx, this.options.ry, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else {
          return this.baseColor
        }
      })

    group
      .append('path')
      .attr('class', 'inner')
      .attr('d', d => this.pieInner(d, this.options.rx, this.options.ry, this.options.h, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else {
          return this.baseColor
        }
      })

    group
      .append('path')
      .attr('class', 'outer')
      .attr('d', d => this.pieOuter(d, this.options.rx, this.options.ry, this.options.h))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else {
          return this.baseColor
        }
      })
      .attr('fill-opacity', 0.9)

    group
      .append('path')
      .attr('class', 'side-left')
      .attr('d', d => this.pieSideLeft(d, this.options.rx, this.options.ry, this.options.h, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else {
          return d3.hsl(this.baseColor).darker(1)
        }
      })
      .attr('fill-opacity', 0.9)

    group
      .append('path')
      .attr('class', 'side-right')
      .attr('d', d => this.pieSideRight(d, this.options.rx, this.options.ry, this.options.h, this.options.ir))
      .attr('fill', (d, i) => {
        if (i % 2) {
          return 'transparent'
        } else {
          return d3.hsl(this.baseColor).darker(1)
        }
      })
      .attr('fill-opacity', 0.9)
  }

  pieTop(d, rx, ry, ir) {
    if (d.startAngle - d.endAngle === 0) return 'M 0,0'
    const sx = rx * Math.cos(d.startAngle - Math.PI / 2), // 开始点坐标 sx,sy
      sy = ry * Math.sin(d.startAngle - Math.PI / 2),
      ex = rx * Math.cos(d.endAngle - Math.PI / 2), // 结束点坐标 ex,ey
      ey = ry * Math.sin(d.endAngle - Math.PI / 2)

    return `M ${sx}, ${sy}
            A ${rx},${ry}, 0, ${d.endAngle - d.startAngle > Math.PI ? '1' : '0'}, 1, ${ex}, ${ey}
            L ${ex * ir}, ${ey * ir}
            A ${rx * ir},${ry * ir}, 0, ${d.endAngle - d.startAngle > Math.PI ? '1' : '0'}, 0, ${sx * ir}, ${sy * ir}
            z
    `
  }
  pieOuter(d, rx, ry, h) {
    // 外截面：角度大于Math.PI，即椭圆的上半部分（即第一象限、第四象限），是看不到的，所以为Math.PI。下半部分可以看到，就取对应的值
    const startAngle = d.startAngle - Math.PI / 2
    const endAngle = d.endAngle - Math.PI / 2

    const sx = rx * Math.cos(startAngle),
      sy = ry * Math.sin(startAngle),
      ex = rx * Math.cos(endAngle),
      ey = ry * Math.sin(endAngle)

    return `M ${sx}, ${sy}
            A ${rx}, ${ry}, 0, 0, 1, ${ex}, ${ey}
            L ${ex}, ${ey + h}
            A ${rx}, ${ry}, 0, 0, 0, ${sx}, ${sy + h}
            z
    `
  }
  pieInner(d, rx, ry, h, ir) {
    const startAngle = d.startAngle - Math.PI / 2,
      endAngle = d.endAngle - Math.PI / 2

    const sx = rx * ir * Math.cos(startAngle), // 开始坐标sx,sy
      sy = ry * ir * Math.sin(startAngle),
      ex = rx * ir * Math.cos(endAngle), // 结束坐标 ex,ey
      ey = ry * ir * Math.sin(endAngle)

    return `M ${sx}, ${sy}
            A ${rx * ir}, ${ry * ir}, 0, 0, 1, ${ex}, ${ey}
            L ${ex}, ${ey + h}
            A ${rx * ir}, ${ry * ir}, 0, 0, 1, ${sx}, ${sy + h}
            z
    `
  }
  pieSideLeft(d, rx, ry, h, ir) {
    const endAngle = d.endAngle - Math.PI / 2

    const ex = rx * Math.cos(endAngle), // 结束坐标 ex,ey
      ey = ry * Math.sin(endAngle)

    return `M ${ex}, ${ey}
            L ${ex * ir}, ${ey * ir}
            L ${ex * ir}, ${ey * ir + h}
            L ${ex}, ${ey + h}
            z
    `
  }
  pieSideRight(d, rx, ry, h, ir) {
    const startAngle = d.startAngle - Math.PI / 2

    const sx = rx * Math.cos(startAngle), // 结束坐标 ex,ey
      sy = ry * Math.sin(startAngle)

    return `M ${sx}, ${sy}
            L ${sx * ir}, ${sy * ir}
            L ${sx * ir}, ${sy * ir + h}
            L ${sx}, ${sy + h}
            z
    `
  }
}
