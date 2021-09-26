<template lang="pug">
.container
  svg(viewBox='0,0,300,300', ref='chartRef')
</template>
<script>
import * as d3 from 'd3'
export default {
  mounted () {
    this.draw()
  },
  methods: {
    draw () {
      const width = 240, height = 240
      const data = [
        { key: '鸡蛋', value: 230 },
        { key: '牛肉', value: 310 },
        { key: '羊肉', value: 280 },
        { key: '鸭蛋', value: 207 },
        { key: '红薯', value: 321 },
      ]
      const svg = d3.select(this.$refs.chartRef).append('g').attr('transform', `translate(30,30)`)

      const x = d3.scaleBand().range([0, width]).domain(data.map(d => d.key)).padding(0.1)
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, d => d.value)])
      const z = d3.scaleOrdinal(d3.schemeCategory10)

      // svg.append('g').attr('class', 'axis-x').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))
      // svg.append('g').attr('class', 'axis-y').call(d3.axisLeft(y))
      svg.append('g').attr('class', 'axis-x').attr('transform', `translate(0,${height})`).append('path').attr('d', () => `M 0,0 h ${width} l ${x.bandwidth() / 4},-10 h ${-width} z`).attr('fill', '#ccc')
      svg.append('g').attr('class', 'axis-y').selectAll('text').data(y.ticks()).enter().append('text').text(d => d).attr('y', d => y(d)).attr('text-anchor', 'middle').attr('dx', '-1em').attr('font-size', 10)

      const slices = svg.append('g').attr('class', 'bar').selectAll('g').data(data).enter().append('g')



      // slices.append('path').attr('d', d => front(d)).attr('fill', 'red')
      slices.append('path').attr('fill', d => d3.hsl(z(d)).brighter(0.7)).transition().duration(1000).attrTween('d', frontTween)
      slices.append('path').attr('fill', d => d3.hsl(z(d)).darker(0.5)).transition().duration(1000).attrTween('d', sideTween)
      slices.append('path').attr('fill', d => d3.hsl(z(d)).darker(0.2)).transition().duration(1000).attrTween('d', topTween)


      function frontTween (d) {
        const sx = x(d.key)
        const i = d3.interpolate(0, d.value)
        return t => `M ${sx}, ${y(i(t))}
                h ${x.bandwidth() / 2}
                v ${y(0) - y(i(t))}
                h ${-x.bandwidth() / 2}
                z   `
      }

      function sideTween (d) {
        const sx = x(d.key) + x.bandwidth() / 2, sy = y(0), ex = sx + x.bandwidth() / 4, ey = sy - 10
        const i = d3.interpolate(0, d.value)

        return t => `M ${sx}, ${sy}
                L ${ex}, ${ey}
                v ${- y(0) + y(i(t))}
                l ${-x.bandwidth() / 4},10
                z
        `
      }

      function topTween (d) {
        const sx = x(d.key)
        const i = d3.interpolate(0, d.value)
        return t => `M ${sx},  ${y(i(t))}
                h ${x.bandwidth() / 2}
                l ${x.bandwidth() / 4}, -10
                h ${-x.bandwidth() / 2}
               `
      }

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