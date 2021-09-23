<template>
  <svg ref="chartRef" width="1000" height="700" style="border:1px solid #333" />
</template>
<script>
import * as d3 from "d3";
import Color from '@/common/color'
import Tip from '@/common/tip'
// import '@/utils/d3-scale-radial'
import * as scaleRadial from '@/utils/d3-scale-radial'


const margin = { top: 90, left: 90, bottom: 30, right: 100 }
const width = 1000 - margin.left - margin.right
const height = 700 - margin.top - margin.bottom
const innerRadius = 160
const outerRadius = 320


export default {
  data () {
    return {
      data: [{ city: 'A城市', q1: 3546, q2: 3132, q3: 2299, q4: 1337 },
      { city: 'B城市', q1: 199, q2: 275, q3: 275, q4: 299 },
      { city: 'C城市', q1: 175, q2: 235, q3: 238, q4: 268 },
      { city: 'D城市', q1: 154, q2: 200, q3: 214, q4: 234 },
      { city: 'E城市', q1: 123, q2: 127, q3: 168, q4: 139 },
      { city: 'F城市', q1: 137, q2: 153, q3: 177, q4: 172 },
      { city: 'G城市', q1: 148, q2: 186, q3: 198, q4: 207 },
      { city: 'H城市', q1: 155, q2: 200, q3: 214, q4: 234 },
      { city: 'I城市', q1: 165, q2: 210, q3: 244, q4: 254 },
      { city: 'J城市', q1: 175, q2: 230, q3: 274, q4: 274 },
      { city: 'K城市', q1: 185, q2: 250, q3: 304, q4: 294 },
      { city: 'L城市', q1: 195, q2: 270, q3: 334, q4: 314 },
      { city: 'M城市', q1: 205, q2: 290, q3: 364, q4: 330 },
      { city: 'N城市', q1: 546, q2: 988, q3: 1024, q4: 1254 },
      { city: 'O城市', q1: 3514, q2: 2541, q3: 1987, q4: 1752 },
      { city: 'P城市', q1: 3654, q2: 3787, q3: 3654, q4: 2415 },
      { city: 'Q城市', q1: 368, q2: 385, q3: 244, q4: 545 },
      { city: 'R城市', q1: 232, q2: 555, q3: 274, q4: 274 },
      { city: 'S城市', q1: 358, q2: 344, q3: 304, q4: 787 },
      { city: 'T城市', q1: 855, q2: 865, q3: 334, q4: 875 },
      { city: 'U城市', q1: 453, q2: 422, q3: 364, q4: 330 },
      { city: 'V城市', q1: 568, q2: 478, q3: 875, q4: 254 },
      { city: 'W城市', q1: 554, q2: 234, q3: 695, q4: 948 },
      { city: 'X城市', q1: 938, q2: 875, q3: 304, q4: 585 },
      { city: 'Y城市', q1: 247, q2: 757, q3: 578, q4: 857 },
      { city: 'Z城市', q1: 368, q2: 695, q3: 757, q4: 875 }
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
      const keys = Object.keys(legends)
      const series = d3.stack().keys(keys).offset(d3.stackOffsetDiverging)(this.data)
      const padding = 3

      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(500,350)`)

      const colors = d3.scaleOrdinal().range(this.colors.slice(0, keys.length)).domain(keys)

      // x比例尺的输出域设为 弧度 0-2*Math.PI, 对应角度 0-360˚， 具体转换规则： x => x / Math.PI * 180
      const x = d3.scaleBand()
        .range([0, 2 * Math.PI]) // 输出域是弧度 0-2*Math.PI => 0-360˚
        .align(0) // 对齐方式：左对齐0，居中对齐0.5， 右对齐1
        .domain(this.data.map(d => d.city))


      const y = scaleRadial() // d3.scaleLinear()
        .range([innerRadius, outerRadius])
        .domain([d3.min(series, s => d3.min(s, d => d[0])), d3.max(series, s => d3.max(s, d => d[1]))])

        console.log([d3.min(series, s => d3.min(s, d => d[0])), d3.max(series, s => d3.max(s, d => d[1]))],'domain', y.domain());
        console.log([innerRadius, outerRadius],'range', y.range());

      // 自定义x轴
      const xAxis = g.append('g')
        .attr('class', 'axis--x')
        .selectAll('g')
        .data(this.data.map(d => d.city))
        .join('g')
        .attr('transform', d => {
          // console.log(d, `${(x(d) + x.bandwidth() / 2) / Math.PI * 180}`);
          return `rotate(${(x(d) + x.bandwidth() / 2) / Math.PI * 180 - 90})translate(${innerRadius}, 0)`
        }) // rotate(x) : 沿z轴旋转x°, -90 => 将整体逆时针旋转90˚

      xAxis.append('text')
        .text(d => d)
        .attr('transform', d => {
          const deg = (x(d) + x.bandwidth() / 2) / Math.PI * 180
          const negtive = deg > 90 && deg < 270
          return `${negtive && 'rotate(-90)translate(0, -15)' || 'rotate(90)translate(0, 15)'}`
        })
        .attr('text-anchor', 'middle') // 文本水平居中
        .attr('dominant-baseline', 'middle') // 文本垂直居中
        .attr('font-size', 12)

      xAxis.append('line')
        .attr('x2', '-6')
        .attr('stroke', '#000')
      // .attr('transform', 'translate(16, 0)')

      // console.log(y.ticks(6));
      // 自定义y轴
      const yAxis = g.append('g')
        .attr('class', 'axis--y')
        .selectAll('g')
        .data(y.ticks(6))
        .join('g')

      yAxis.append('circle')
        .attr('r', d => y(d))
        .attr('fill', 'none')
        .attr('stroke', '#000')

      yAxis.append('text')
        .text(d => d)
        .attr('y', d => -y(d))
        .attr('font-size', 12)
        .attr('dy', 6)
        .attr('text-anchor', 'end')

      yAxis.insert('rect', 'text')
        .datum(function () {
          return this.nextSibling.getBBox() // { height: 16.515625, width: 33.375, x: -33.375, y: -308.125 }
        })
        .attr('x', d => (d.x - padding))
        .attr('y', d => (d.y - padding))
        .attr('width', d => (d.width + 2 * padding))
        .attr('height', d => (d.height + 2 * padding))
        .attr('fill', '#fff')



      chart.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('circle')
        .attr('r', innerRadius)
        .transition()
        .duration(1000)
        .attr('r', outerRadius)



      // 画堆状柱形图
      const stack = g.selectAll('.stack')
        .data(series)
        .join('g')
        .attr('class', 'stack')
        .attr('fill', s => colors(s.key))
       
      stack.selectAll('path')
        .data(s => s)
        .join('path')
        .attr('d', d3.arc()
                    .innerRadius(d => y(d[0]))
                    .outerRadius(d => y(d[1]))
                    .startAngle(d => x(d.data.city))
                    .endAngle(d => (x(d.data.city))+x.bandwidth()))
        .attr('clip-path', 'url(#clip)')

        




















    }
  },
};
</script>
