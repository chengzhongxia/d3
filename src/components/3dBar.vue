<template lang="pug">
.container
  button(@click='changeData') 改变数据
  svg(viewBox='0,0,300,300', ref='chartRef')
</template>
<script>
import * as d3 from 'd3'
const width = 240, height = 240
let x, y
export default {
  data () {
    return {
      data: [
        { key: '鸡蛋', value: 230 },
        { key: '牛肉', value: 310 },
        { key: '羊肉', value: 280 },
        { key: '鸭蛋', value: 207 },
        { key: '红薯', value: 321 },
      ]
    }
  },
  mounted () {
    this.draw()
  },
  methods: {
    draw () {
      const svg = d3.select(this.$refs.chartRef).append('g').attr('transform', `translate(30,30)`)

      x = d3.scaleBand().range([0, width]).domain(this.data.map(d => d.key)).padding(0.1)
      y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(this.data, d => d.value)])
      const z = d3.scaleOrdinal(d3.schemeCategory10)

      // svg.append('g').attr('class', 'axis-x').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))
      // svg.append('g').attr('class', 'axis-y').call(d3.axisLeft(y))
      svg.append('g').attr('class', 'axis-x').attr('transform', `translate(0,${height})`).append('path').attr('d', () => `M 0,0 h ${width} l ${x.bandwidth() / 4},-10 h ${-width} z`).attr('fill', '#ccc')
      svg.append('g').attr('class', 'axis-y').selectAll('text').data(y.ticks()).enter().append('text').text(d => d).attr('y', d => y(d)).attr('text-anchor', 'middle').attr('dx', '-1em').attr('font-size', 10)

      const slices = svg.append('g').attr('class', 'bar').selectAll('g').data(this.data).enter().append('g').attr('class', 'slice')



      // slices.append('path').attr('d', d => front(d)).attr('fill', 'red')
      slices.append('path').attr('class', 'front').datum(function (d) { this._current = d; return d }).attr('fill', d => d3.hsl(z(d)).brighter(0.7)).transition().duration(1000).attrTween('d', this.frontTween)
      slices.append('path').attr('class', 'side').datum(function (d) { this._current = d; return d }).attr('fill', d => d3.hsl(z(d)).darker(0.5)).transition().duration(1000).attrTween('d', this.sideTween)
      slices.append('path').attr('class', 'top').datum(function (d) { this._current = d; return d }).attr('fill', d => d3.hsl(z(d)).darker(0.2)).transition().duration(1000).attrTween('d', this.topTween)




    },
    changeData () {
      this.data = this.data.map(d => ({ key: d.key, value: Math.round(Math.random() * 250 + 100) }))
      this.transition()
    },
    transition () {
      const slices = d3.select(this.$refs.chartRef).selectAll('.slice').data(this.data)

      slices.select('.front').transition().duration(1000).attrTween('d', function (d) {
        const i = d3.interpolate(this._current, d)
        this._current = d
        return t => `M ${x(d.key)}, ${y(i(t).value)}
                h ${x.bandwidth() / 2}
                v ${y(0) - y(i(t).value)}
                h ${-x.bandwidth() / 2}
                z   `
      })
      slices.select('.side').transition().duration(1000).attrTween('d', function (d) {
        const sx = x(d.key) + x.bandwidth() / 2, sy = y(0), ex = sx + x.bandwidth() / 4, ey = sy - 10
        const i = d3.interpolate(this._current.value, d.value)
        this._current = d
        return t => `M ${sx}, ${sy}
                L ${ex}, ${ey}
                v ${- y(0) + y(i(t))}
                l ${-x.bandwidth() / 4},10
                z
        `
      })

      slices.select('.top').transition().duration(1000).attrTween('d', function (d) {
        const i = d3.interpolate(this._current.value, d.value)
        this._current = d
        return t => `M ${x(d.key)},  ${y(i(t))}
                h ${x.bandwidth() / 2}
                l ${x.bandwidth() / 4}, -10
                h ${-x.bandwidth() / 2}
               `
      })
      
    },
    frontTween (d) {
      const i = d3.interpolate(0, d.value)
      return t => `M ${x(d.key)}, ${y(i(t))}
                h ${x.bandwidth() / 2}
                v ${y(0) - y(i(t))}
                h ${-x.bandwidth() / 2}
                z   `
    },
    sideTween (d) {
      const sx = x(d.key) + x.bandwidth() / 2, sy = y(0), ex = sx + x.bandwidth() / 4, ey = sy - 10
      const i = d3.interpolate(0, d.value)

      return t => `M ${sx}, ${sy}
                L ${ex}, ${ey}
                v ${- y(0) + y(i(t))}
                l ${-x.bandwidth() / 4},10
                z
        `
    },
    topTween (d) {
      const sx = x(d.key)
      const i = d3.interpolate(0, d.value)
      return t => `M ${sx},  ${y(i(t))}
                h ${x.bandwidth() / 2}
                l ${x.bandwidth() / 4}, -10
                h ${-x.bandwidth() / 2}
               `
    }

  },
}
</script>

<style scoped>
.container {
  width: 40vw;
  height: 40vw;
  background: #eee;
}
</style>