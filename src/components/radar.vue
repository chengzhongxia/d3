<template>
  <svg width="1000" height="600" ref="chartRef" style="background:#fefefe;"></svg>
</template>
<script>
import * as d3 from 'd3'
const margin = { top: 60, left: 90, bottom: 30, right: 90 }
const width = 1000 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom
const colors = ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
export default {
  data () {
    return {
      data: []
    }
  },
  watch: {
    data () {
      this.drawChart()
    }
  },
  created () {
    this.data = [
      {
        className: '甲班',
        chinese: 88,
        math: 92,
        physics: 90,
        chemistry: 88,
        english: 98,
      },
      {
        className: '乙班',
        chinese: 67,
        math: 78,
        physics: 80,
        chemistry: 72,
        english: 74,
      },
      {
        className: '丙班',
        chinese: 77,
        math: 83,
        physics: 68,
        chemistry: 69,
        english: 65,
      },
      {
        className: '丁班',
        chinese: 72,
        math: 67,
        physics: 62,
        chemistry: 67,
        english: 68,
      },
    ]
  },
  methods: {
    drawChart () {
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(500, 300)`)
      const legend = {
        chinese: '语文',
        math: '数学',
        physics: '物理',
        chemistry: '化学',
        english: '英语',
      }
      
      const series = this.data.map(g => Object.keys(legend).map(key => ({key, className: g.className, value: g[key]})))
      const outerRadius = height / 2
      const x = d3.scaleBand().range([0, 2 * Math.PI]).domain(Object.keys(legend))
      const y = d3.scaleLinear().range([0, outerRadius]).domain([0, 100])
      const z = d3.scaleOrdinal(d3.schemeCategory10)
      const yAxis = g.append('g').attr('class', 'axis-circle')
      // y.ticks(10): [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      yAxis.selectAll('path').data(y.ticks(10)).join('path').attr('fill', '#f5f5f5').attr('stroke', "#666")
        .attr('d', (d, i) => d3.arc().padAngle(0).startAngle(0).endAngle(2 * Math.PI)({ innerRadius: y(y.ticks(10)[i - 1]), outerRadius: y(d) }))

      yAxis.append('g').selectAll('text').data(y.ticks(10)).join('text').text(d => d).attr('y', d => -y(d)).attr('dx', '.5em').attr('fill', '#fff').attr('stroke', '#fff').attr('stroke-width', 5)
      yAxis.append('g').selectAll('text').data(y.ticks(10)).join('text').text(d => d).attr('y', d => -y(d)).attr('dx', '.5em').attr('fill', '#333')

      // d3.lineRadial() 径向线条生成器 ,angle,radius
      /* [
          [ { angle: 0, radius: 0}, { angle: 0, radius: 270}],
          [ { angle: 0, radius: 0}, { angle: 1.2566370614359172, radius: 270}],
          [ { angle: 0, radius: 0}, { angle: 2.5132741228718345, radius: 270}],
          [ { angle: 0, radius: 0}, { angle: 3.7699111843077517, radius: 270}],
          [ { angle: 0, radius: 0}, { angle: 5.026548245743669, radius: 270}],

      ]
      */
      const axisLineRadial = d3.lineRadial().angle(d => d.angle).radius(d => d.radius)

      // 正常是数组，这里需要加入key字段，用了伪数组
      const axisLineData = Object.keys(legend).map(key => [
        { angle: 0, radius: 0 },
        { angle: x(key), radius: outerRadius }
      ])
      g.append('g').attr('class', 'axis-radial').selectAll('path').data(axisLineData).join('path')
        .attr('d', axisLineRadial).attr('fill', 'none').attr('stroke', '#fff').attr('stroke-width', 3)
      g.select('.axis-radial').selectAll('text').data(Object.keys(legend)).join('text').text(d => legend[d]).attr('fill', '#000').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('y', d => - Math.cos(x(d)) * (outerRadius + 30))
        .attr('x', d => Math.sin(x(d)) * (outerRadius + 30))


      const lineRadial = d3.lineRadial().angle(d => x(d.key)).radius(d => y(d.value)).curve(d3.curveLinearClosed) // 闭合折线
      
      g.selectAll('.radar').data(series).join('g').attr('class', 'radar').append('path')
        .attr('d', lineRadial)
        .attr('fill', (s,i) => z(i))
        .attr('fill-opacity', .2)
        .attr('stroke', (s,i) => z(i))
        .on('mouseover', function(){
          d3.select(this).attr('fill-opacity', .5).attr('stroke-width', 3)
        })
        .on('mouseout', function(){
          d3.select(this).attr('fill-opacity', .2).attr('stroke-width', 1)
        })

    }
  },
}
</script>