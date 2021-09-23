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
      data: [{ time: '00:00', pm25: 75 },
      { time: '01:00', pm25: 66 },
      { time: '02:00', pm25: 43 },
      { time: '03:00', pm25: 32 },
      { time: '04:00', pm25: 20 },
      { time: '05:00', pm25: 18 },
      { time: '06:00', pm25: 16 },
      { time: '07:00', pm25: 33 },
      { time: '08:00', pm25: 53 },
      { time: '09:00', pm25: 66 },
      { time: '10:00', pm25: 55 },
      { time: '11:00', pm25: 67 },
      { time: '12:00', pm25: 99 },
      { time: '13:00', pm25: 138 },
      { time: '14:00', pm25: 110 },
      { time: '15:00', pm25: 99 },
      { time: '16:00', pm25: 119 },
      { time: '17:00', pm25: 125 },
      { time: '18:00', pm25: 173 },
      { time: '19:00', pm25: 168 },
      { time: '20:00', pm25: 162 },
      { time: '21:00', pm25: 143 },
      { time: '22:00', pm25: 132 },
      { time: '23:00', pm25: 87 },
      ],
      colors: ['#6bcd07', '#fbd029', '#fe8800', '#fe0000', '#970454', '#62001e',]
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const data = [...this.data].map(d => ({ time: d3.timeParse('%H:%M')(d.time), key: 'pm25', value: d['pm25'] }))
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      const stepValue = 50
      const padding = 3

      const colors = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys()) // 背景柱的颜色
      const z = d3.scaleOrdinal(d3.schemeCategory10) // 线条的颜色

      // 坐标轴
      const x = d3.scaleTime().range([0, width]).domain(d3.extent(data, d => d.time))
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, d => d.value)])

      // axis.ticks(args) 在 坐标轴 渲染时将传入的 args 传递给 scale.ticks 和 scale.tickFormat ,并且返回当前坐标轴生成器. 
      // axis.ticks([count[, specifier]]) specifier:定义刻度的展示格式
      // axis.tickFormat([format])




      // axis.tickValues([values]) 设置刻度,优先级大
      // 设置了axis.tickValues([values]),刻度就会按照设置覆盖到之前的刻度
      // d3.range(start, stop [, step]) 返回一个数组，step默认值为1
      /*d3.range(0, 4) // [0,1,2,3]
        d3.range(5, 50, 5) // [5,10,15,20,25,30,35,40,45]
        d3.range(1, 10, 2) // [1,3,5,7,9]
      */

      const yTickValues = d3.range(0, d3.max(data, d => d.value), stepValue) //  [0, 50, 100, 150]: y轴刻度

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).tickValues(yTickValues))


      const names = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']

      // 设置背景柱
      const stepArr = [...yTickValues, d3.max(data, d => d.value)]
      const bgBars = g.append('g').attr('class', 'bg-bar')

      bgBars.selectAll('rect')
        .data(stepArr) // [0, 50, 100, 150, 173]
        .join('rect')
        .attr('fill', (d, i) => colors(i))
        .attr('x', 0)
        .attr('y', (d, i) => y(stepArr[i + 1]))
        .attr('width', width)
        .attr('height', (d, i) => ((y(stepArr[i]) - y(stepArr[i + 1])) || 0))

      bgBars.selectAll('text')
        .data(yTickValues)
        .join('text')
        .attr('x', width / 2)
        .attr('y', d => y(d))
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', 24)
        .attr('dy', (d, i) => -(y(stepArr[i]) - y(stepArr[i + 1])) / 2 + 8)
        .text((d, i) => names[i])




      // x轴、背景虚线
      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height})`)
        // .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M')).ticks(24)) // axis.ticks(count, format)
        .call(d3.axisBottom(x).ticks(24, d3.timeFormat('%H:%M'))) // axis.ticks(count, format)
        .selectAll('.tick')
        .data(data)
        .append('line')
        .attr('class', 'bg-line')
        .attr('y2', (-height))
        .attr('stroke', 'rgba(255,255,255,0.4)')
        .attr('stroke-dasharray', '2,2')

      d3.select('.axis--x .bg-line:last-of-type').remove()

      // 剪切蒙版，实现线动画
      chart.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', 0)
        .attr('height', height)
        .transition()
        .duration(1000)
        .attr('width', width)

      // d3.line()线段构建器
      // ① 定义line ② 添加line
      const line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => x(d.time))
        .y(d => y(d.value))

      g.append('path')
        .datum(data)
        .join('path')
        .attr('clip-path', 'url(#clip)')
        .attr('d', d => line(d))
        .attr('fill', 'none')
        .attr('stroke', z(0))

      // 设置tip
      const tipSet = { w: 90, h: 56, rx: 4, ry: 4, angle: 6 }


      function tipTween (chart, display) {
        const tip = chart.selectAll('.tip').data([null]).join('g').attr('class', 'tip')
        return function (e, data) {
          const set = [`时间：${d3.timeFormat('%H:%M')(data.time)}`, `AQI值：${data.value}`]

          tip.attr('transform', `translate(${margin.left + x(data.time) - tipSet.w / 2},${margin.top + y(data.value) - tipSet.h / 3})`)
            .style('display', `${display === "show" ? 'block' : 'none'}`)

          tip.selectAll('path')
            .data([null])
            .join('path')
            // .attr('d', `M0,0 h${tipSet.w / 2 - 4} l4,4 l4,-4 h${tipSet.w / 2 - 4} v${-tipSet.h} h${-tipSet.w} z`)
            .attr('d', `M0, ${-tipSet.ry} 
                        a${tipSet.rx},${tipSet.ry},0,0,0,${tipSet.rx},${tipSet.ry}
                        h${tipSet.w / 2 - tipSet.rx - tipSet.angle}
                        l${tipSet.angle},${tipSet.angle}
                        l${tipSet.angle},${-tipSet.angle}
                        h${tipSet.w / 2 - tipSet.angle - tipSet.rx}
                        a${tipSet.rx},${tipSet.ry},0,0,0,${tipSet.rx},${-tipSet.ry}
                        v${-tipSet.h + 2 * tipSet.ry},
                        a${tipSet.rx},${tipSet.ry},0,0,0,${-tipSet.rx},${-tipSet.ry}
                        h${-tipSet.w + 2 * tipSet.rx}
                        a${tipSet.rx},${tipSet.ry},0,0,0,${-tipSet.rx},${tipSet.ry}
                        z`)
            .attr('fill', "rgba(86,2,2,1)")

          tip.selectAll('text')
            .data(set.reverse())
            .join('text')
            .text(d => d)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .attr('font-weight', '700')
            .attr('dx', tipSet.w / 2)
            .attr('font-size', 12)
            .attr('y', (d, i) => `-${1.5 * i + 1}em`)
        }
      }




      // 文字包层  
      const labels = g.selectAll('.text')
        .data(data)
        .join('g')
        .style('z-index', 0)
        .attr('class', 'text')
        .attr('cursor', 'pointer')
        .attr('transform', d => `translate(${x(d.time)},${y(d.value)})`)
        .on('mouseover', tipTween(chart, 'show'))
        .on('mouseout', tipTween(chart, 'hide'))

      // 数值文字  
      labels.append('text')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('dy', '.5em')
        .text(d => d.value)


      // 数值文字的背景白块  
      labels.insert('rect', 'text')
        .datum(function () {
          return this.nextSibling.getBBox()
        })
        .attr('x', d => (d.x - padding))
        .attr('y', d => (d.y - padding / 2))
        .attr('width', d => (d.width + 2 * padding))
        .attr('height', d => (d.height + padding))
        .attr('rx', '5px') // rx,ry圆角
        .attr('ry', '5px')
        .attr('fill', 'rgba(0,0,0,0.3)')

    }
  },
};
</script>
