<template>
  <svg ref="chartRef" width="1000" height="500" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 90, left: 90, bottom: 30, right: 100 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default {
  data () {
    return {
      data: [{ date: '2011', q1: 155, q2: 200, q3: 214, q4: 234 },
      { date: '2012', q1: 165, q2: 210, q3: 244, q4: 254 },
      { date: '2013', q1: 175, q2: 230, q3: 274, q4: 274 },
      { date: '2014', q1: 185, q2: 250, q3: 304, q4: 294 },
      { date: '2015', q1: 195, q2: 270, q3: 334, q4: 314 },
      { date: '2016', q1: 205, q2: 290, q3: 364, q4: null },
      ],
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const legends = { q1: '第一季度', q2: '第二季度', q3: '第三季度', q4: '第四季度' }
      const data = this.data
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      const colors = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys())
      const x0 = d3.scaleBand().range([0, width]).domain(data.map(d => d.date)).padding(0.1)
      const x1 = d3.scaleBand().range([0, x0.bandwidth()]).domain(Object.keys(legends)).padding(0.05)

      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, d => d3.max(Object.values(d).slice(1)))])

      g.append('g').attr('class', 'axis axis--x').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x0))

      g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y)).append('text').text('营收(万)').attr('fill', '#000').attr('dy', '-1em')


      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width + 20}, 0)`)
        .selectAll('g')
        .data(Object.keys(legends))
        .join('g')
        .attr('transform', (d, i) => `translate(0,${i * 20})`)

      legend.append('rect').attr('width', 15).attr('height', 15).attr('fill', d => colors(d))
      legend.append('text', 'rect').text(key => legends[key]).attr('font-size', 12).attr('dy', '1em').attr('dx', 20)

      g.selectAll('.bar')
        .data(data)
        .join('g')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${x0(d.date)},0)`)
        .selectAll('rect')
        .data(d => Object.keys(legends).map(key => ({ key, value: d[key] })))
        .join('rect')
        .attr('x', b => x1(b.key))
        .attr('y', height)
        .attr('width', x1.bandwidth())
        .attr('fill', (b, i) => colors(i))
        .attr('height', 0)
        .transition()
        .duration(1000)
        .attr('y', b => y(b.value))
        .attr('height', b => (height - y(b.value) || 0))

    }
  },
};
</script>
