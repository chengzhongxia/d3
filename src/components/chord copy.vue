<template>
  <svg ref="chartRef" width="1000" height="600" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 90, left: 90, bottom: 30, right: 100 }
const width = 1000 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

export default {
  data () {
    return {
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const names = ['北京', '上海', '广州', '深圳']
      const matrix = [
        [11975, 5871, 8916, 2868],
        [1951, 10048, 2060, 6171],
        [8010, 16145, 8090, 8045],
        [1013, 990, 940, 6907]
      ]
      const outerRadius = 200
      const innerRadius = outerRadius - 30
      const chart = d3.select(this.$refs.chartRef)
      const colors = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys())

      const g = chart.append('g').attr('transform', 'translate(500, 300)')


      const chords = d3.chord().padAngle(0.1).sortSubgroups(d3.descending)(matrix)

      // 外弦图：圆环 => 节点
      const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
      const group = g.append('g').selectAll('.gourp').data(chords.groups).join('g').attr('class', 'group')
      group.append('path').attr('d', arc).attr('fill', d => colors(d.index)).attr('stroke', d => d3.rgb(colors(d.index)).darker())

      // 节点名字
      group.append('g').attr('transform', d => `rotate(${(d.startAngle + d.endAngle) / 2 / Math.PI * 180 - 90})translate(${outerRadius + 60},0)`)
        .append('text').text(d => names[d.index]).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('transform', d => `rotate(${d.startAngle + d.endAngle > 2 * Math.PI ? 180 : 0})`)

      // 节点上的刻度
      const ticks = group.selectAll('.tick').data(group => groupTicks(group, 1e3)).join('g').attr('class', 'tick')
        .attr('transform', d => `rotate(${d.angle / Math.PI * 180 - 90})translate(${outerRadius},0)`)
      ticks.append('line').attr('x2', 6).attr('stroke', '#000')
      ticks.filter((d, i) => i % 5 === 0).append('text').text(d => d.value / 5e3 + 'K').attr('font-size', 10).attr('dominant-baseline', 'middle').attr('text-anchor', 'middle')
        .attr('transform', d => `rotate(${d.angle > Math.PI ? 180 : 0})`).attr('dx', d=> d.angle > Math.PI ? '-2em' : '2em')






      function groupTicks (d, step) {
        const k = (d.endAngle - d.startAngle) / d.value
        return d3.range(0, d.value, step).map(v => ({ value: v, angle: v * k + d.startAngle }))
      }





      const ribbon = d3.ribbon().radius(innerRadius)
      const chord = g.append('g').selectAll('.chord').data(chords).join('g').attr('class', 'chord')
      chord.append('path').attr('d', ribbon).attr('opacity', 0.7).attr('fill', 'none').attr('stroke', 'none').transition().duration(60).delay((d, i) => i * 60).attr('fill', d => colors(d.target.index)).attr('stroke', d => d3.rgb(colors(d.target.index)).darker())




    }
  },
};
</script>
