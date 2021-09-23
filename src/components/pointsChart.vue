<template>
  <svg ref="chartRef" width="1000" height="500" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 90, left: 90, bottom: 30, right: 90 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default {
  data () {
    return {
      points: [[5, 66],
      [7, 55],
      [4, 99],
      [11, 78],
      [28, 65],
      [7, 88],
      [5, 56],
      [2, 60],
      [4, 57],
      [6, 98],
      [27, 33],
      [26, 77],
      [23, 95],
      [34, 87],
      [7, 68],
      [1, 68],
      [2, 60],
      [22, 84],
      [6, 96],
      [13, 87],
      ],
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const points = [...this.points]
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      const z = d3.scaleOrdinal(d3.schemeCategory10) // 通用线条的颜色

      const x = d3.scaleLinear().range([0, width]).domain([0, d3.max(points, p => p[0])])
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(points, p => p[1])])

      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .append('text')
        .text('激烈运动年限 (年)')
        .attr('fill', '#000')
        .attr('x', width)
        .attr('y', '2em')

      g.append('g')
        .call(d3.axisLeft(y))
        .append('text')
        .text('健康指数 (分)')
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .attr('dy', '-1em')

      g.selectAll('circle')
        .data(points)
        .join('circle')
        .attr('cx', d => x(d[0]))
        .attr('cy', d => y(d[1]))
        .attr('fill', d => z(d[1]))
        .on('mouseover', tipTween(chart, 'block'))
        .on('mouseout', tipTween(chart, 'none'))
        .attr('r', 0)
        .transition()
        .duration(750)
        .delay((d, i) => 30 * i)
        .attr('r', 10)



      function tipTween (chart, display, options) {
        const set = Object.assign({ w: 96, h: 50, rx: 4, ry: 4, angle: 6 }, options)

        const tip = chart.selectAll('.tip').data([null]).join('g').attr('class', 'tip')
        return function (e, data) {
          const dataSet = [`运动年限：${data[0]}`, `健康指数：${data[1]}`]

          tip.attr('transform', `translate(${margin.left + x(data[0]) - set.w / 2},${margin.top + y(data[1]) - set.h / 2})`)
            .style('display', display)

          tip.selectAll('path')
            .data([null])
            .join('path')
            .attr('d', `M0, ${-set.ry} 
                        a${set.rx},${set.ry},0,0,0,${set.rx},${set.ry}
                        h${set.w / 2 - set.rx - set.angle}
                        l${set.angle},${set.angle}
                        l${set.angle},${-set.angle}
                        h${set.w / 2 - set.angle - set.rx}
                        a${set.rx},${set.ry},0,0,0,${set.rx},${-set.ry}
                        v${-set.h + 2 * set.ry},
                        a${set.rx},${set.ry},0,0,0,${-set.rx},${-set.ry}
                        h${-set.w + 2 * set.rx}
                        a${set.rx},${set.ry},0,0,0,${-set.rx},${set.ry}
                        z`)
            .attr('fill', 'rgba(86,2,2,1)')

          tip.selectAll('text')
            .data(dataSet)
            .join('text')
            .text(d => d)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .attr('font-weight', '600')
            .attr('font-size', 12)
            .attr('x', set.w / 2)
            .attr('y', (d, i) => (-(i + .8) * 1.5 + 'em'))
        }
      }

    }
  },
};
</script>
