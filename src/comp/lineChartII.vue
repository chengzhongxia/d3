<template>
  <svg ref="chartRef" width="1000" height="600" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 90, left: 90, bottom: 30, right: 90 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default {
  data () {
    return {
      data: [{ time: '00:00', pm50: 95, pm25: 75 },
      { time: '01:00', pm50: 75, pm25: 66 },
      { time: '02:00', pm50: 55, pm25: 43 },
      { time: '03:00', pm50: 43, pm25: 32 },
      { time: '04:00', pm50: 32, pm25: 20 },
      { time: '05:00', pm50: 26, pm25: 18 },
      { time: '06:00', pm50: 19, pm25: 16 },
      { time: '07:00', pm50: 29, pm25: 33 },
      { time: '08:00', pm50: 35, pm25: 53 },
      { time: '09:00', pm50: 46, pm25: 66 },
      { time: '10:00', pm50: 58, pm25: 55 },
      { time: '11:00', pm50: 62, pm25: 67 },
      { time: '12:00', pm50: 74, pm25: 99 },
      { time: '13:00', pm50: 83, pm25: 138 },
      { time: '14:00', pm50: 99, pm25: 110 },
      { time: '15:00', pm50: 123, pm25: 99 },
      { time: '16:00', pm50: 156, pm25: 119 },
      { time: '17:00', pm50: 175, pm25: 125 },
      { time: '18:00', pm50: 232, pm25: 173 },
      { time: '19:00', pm50: 195, pm25: 168 },
      { time: '20:00', pm50: 150, pm25: 162 },
      { time: '21:00', pm50: 148, pm25: 143 },
      { time: '22:00', pm50: 131, pm25: 132 },
      { time: '23:00', pm50: 119, pm25: 87 },
      ],
      colors: ['#6bcd07', '#fbd029', '#fe8800', '#fe0000', '#970454', '#62001e', '#000', 'cornflowerblue']
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const names = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']
      const category = ['pm25', 'pm50']
      const series = category.map(key => this.data.map(d => ({ key, value: d[key], time: d3.timeParse('%H:%M')(d.time) })))
      const stepValue = 50
      const padding = 3

      const maxValue = d3.max(series, s => d3.max(s, d => d.value))

      const chart = d3.select(this.$refs.chartRef)

      const g = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      const colors = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys())
      const z = d3.scaleOrdinal(d3.schemeCategory10)
      // 坐标轴
      const x = d3.scaleTime().range([0, width]).domain(d3.extent(this.data, d => d3.timeParse('%H:%M')(d.time)))
      const y = d3.scaleLinear().range([height, 0]).domain([0, maxValue])


      // d3.range(start, stop[, step]) 生成数组，start开始，以stop结尾，不包括stop，以step为差的，等差数组
      const tickArr = d3.range(0, maxValue, stepValue)
      // y轴的刻度需要重新渲染
      // axis.tickValues([value]) 优先级更高
      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).tickValues(tickArr))
        .selectAll('.tick') // 背景柱
        .append('rect')
        .attr('width', width)
        .attr('height', (d, i) => (y(tickArr[i]) - y(tickArr[i + 1]) || y(d)))
        .attr('y', (d, i) => ((y(tickArr[i + 1]) - y(tickArr[i])) || (-y(d))))
        .attr('fill', (d, i) => colors(i))

      // 背景柱文字  
      d3.selectAll('.axis--y .tick')
        .append('text')
        .text((d, i) => names[i + 1])
        .attr('fill', "#fff")
        .attr('text-anchor', 'middle')
        .attr('font-size', 24)
        .attr('x', width / 2)
        .attr('y', (d, i) => ((y(tickArr[i + 1]) - y(tickArr[i]) + 16) / 2 || (-y(d) + 16) / 2))


      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(24, d3.timeFormat('%H:%M')))
        .selectAll('.tick') // 背景虚线
        .append('line')
        .attr('y2', -height)
        .attr('stroke', 'rgba(255,255,255,0.6)')
        .attr('stroke-dasharray', '2,2')
        .filter((d, i) => {
          if (i === 0) {
            d3.select('.axis--x .tick line:last-of-type').remove()
          }
        })

      // 裁剪蒙版
      chart.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', 0)
        .attr('height', height)
        .attr('fill', 'rgba(0,0,0,0.1')
        .transition()
        .duration(1500)
        .attr('width', width)


      // 定义line， 添加line
      const line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => x(d.time))
        .y(d => y(d.value))

      g.selectAll('.line')
        .data(series)
        .join('path')
        .attr('class', 'line')
        .attr('d', line)
        .attr('clip-path', 'url(#clip)')
        .attr('fill', 'none')
        .attr('stroke', (s, i) => colors(this.colors.length - i - 1))
        .attr('stroke-width', 2)

      const labels = g.selectAll('.label')
        .data(series)
        .enter()
        .append('g')
        .attr('class', 'label')
        .selectAll('g')
        .data(s => s)
        .join('g')
        .attr('cursor', 'pointer')
        .on('mouseover', tipTween(chart, 'block'))
        .on('mouseout', tipTween(chart, 'none'))

      labels
        .append('text')
        .text(d => d.value)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('x', d => x(d.time))
        .attr('y', d => y(d.value))

      labels.insert('rect', 'text')
        .datum(function () {
          return this.nextSibling.getBBox()
        })
        .attr('x', d => (d.x - padding))
        .attr('y', d => (d.y - padding))
        .attr('rx', padding)
        .attr('ry', padding)
        .attr('width', d => (d.width + 2 * padding))
        .attr('height', d => (d.height + 2 * padding))
        .attr('fill', 'rgba(0,0,0,0.5)')



      function tipTween (chart, display, options) {
        const set = Object.assign({ w: 80, h: 50, rx: 4, ry: 4, angle: 6 }, options)

        const tip = chart.selectAll('.tip').data([null]).join('g').attr('class', 'tip')
        return function (e, data) {
          const dataSet = [`时间：${d3.timeFormat('%H:%M')(data.time)}`, `AQI值：${data.value}`]

          tip.attr('transform', `translate(${margin.left + x(data.time) - set.w / 2},${margin.top + y(data.value) - set.h / 2})`)
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
    },
  },
};
</script>
