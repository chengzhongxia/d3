<template>
  <svg width="1000" height="600" ref="chartRef" style="background:#eee;"></svg>
</template>
<script>
import * as d3 from 'd3'
const margin = { top: 30, left: 90, bottom: 30, right: 90 }
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
  async created () {
    this.data = await d3.csv('./data/nightingale.csv')
  },
  methods: {
    // 南丁格尔
    drawChart () {
      const chart = d3.select(this.$refs.chartRef)

      const g = chart.append('g').attr('transform', 'translate(500, 300)')
      const z = d3.scaleOrdinal().range(colors).domain(colors.keys())
      const arc = d3.arc().innerRadius(0).padAngle(0)
      const pie = d3.pie().sort(null).value(d => d.money)
      const radius = d3.scaleLinear().range([0, 200]).domain([0, d3.max(this.data, d => +d.money)])

      const group = g.selectAll('.group').data(pie(this.data)).join('g').classed('group', true)

      const line = d3.line().x(d => d[0]).y(d => d[1])
      group.append('path').datum(d => generatePoints(d)).transition().delay(600).attr('d', d => line(d)).attr('fill', 'none').attr('stroke', '#000')
      group.append('text').text(d => d.data.date + ':' + d.data.money)
        .attr('text-anchor', d => (d.startAngle + d.endAngle) / 2 > Math.PI ? 'end' : 'start')
        .datum(d => generateTextPosition(d)).attr('x', d => d[0]).attr('y', d => d[1])
        .attr('dominant-baseline', 'middle').attr('font-weight', '700')
        .style('display','none')
        .transition().delay(600)
        .style('display', 'block')



      group.append('path').attr('d', d => arc(d)).attr('fill', d => z(d.index))
        .each(function (d) {
          this._start = { ...d, outerRadius: 0 }
          d.outerRadius = radius(d.data.money)
        })
        .on('mouseover', arcTween(30, 60))
        .on('mouseout', arcTween(0, 60))
        .transition()
        .duration(600)
        .attrTween('d', function (next) {
          const i = d3.interpolate(this._start, next)
          return t => arc(i(t))
        })

      function arcTween (increment, delay) {
        return function (e, d) {
          d3.select(this).transition().duration(300).delay(delay).attr('d', arc({ ...d, outerRadius: d.outerRadius + increment }))
        }
      }

      // 连接线的三个点
      function generatePoints (d) {
        const p1 = d3.arc().innerRadius(radius(d.data.money)).outerRadius(radius(d.data.money)).centroid(d)
        const p2 = d3.arc().innerRadius(radius(d.data.money) + 40).outerRadius(radius(d.data.money) + 40).centroid(d)
        
        const middleAngle = (d.startAngle + d.endAngle) / 2
        let p3
        if (middleAngle > Math.PI) {
          p3 = [p2[0] - 20, p2[1]]
        } else {
          p3 = [p2[0] + 20, p2[1]]
        }
        return [p1, p2, p3]
      }

      function generateTextPosition (d) {
        const c = d3.arc().innerRadius(radius(d.data.money) + 40).outerRadius(radius(d.data.money) + 40).centroid(d)
        const middleAngle = (d.startAngle + d.endAngle) / 2

        if (middleAngle > Math.PI) {
          return [c[0] - 40, c[1]]
        } else {
          return [c[0] + 40, c[1]]
        }
      }
    }
  },
}
</script>