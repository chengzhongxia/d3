<template>
  <svg ref="chartRef" width="1000" height="700" />
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
const outerRadius = 350


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
      const series = d3.stack().keys(Object.keys(legends)).offset(d3.stackOffsetDiverging)(this.data)

      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(500,350)`)

      const z = d3.scaleOrdinal().range(this.colors).domain(Object.keys(legends))
      const x = d3.scaleBand().range([0, 2 * Math.PI]).domain(this.data.map(d => d.city))
      const y = d3.scaleLinear().range([innerRadius, outerRadius]).domain([d3.min(series, s => d3.min(s, d => d[0])), d3.max(series, s => d3.max(s, d => d[1]))])

      // x轴
      const ticksX = g.append('g').attr('class', 'axis--x').selectAll('g').data(x.domain()).join('g').attr('transform', d => `rotate(${(x(d) + x.bandwidth() / 2) / Math.PI * 180})translate(${innerRadius},0)`)

      ticksX.append('text').text(d => d).attr('transform', d => `${x(d) >= Math.PI ? 'rotate(90)translate(0,16)' : 'rotate(-90)translate(0,-9)'}`).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('font-size', 12)
      ticksX.append('line').attr('x2', -6).attr('stroke', '#000')


      // y轴
      const ticksY = g.append('g').attr('class', 'axis--y').datum(y.ticks(6))
      ticksY.selectAll('circle').data(g => g).join('circle').attr('r', d => y(d)).attr('fill', 'none').attr('stroke', "#000")
      
      
      ticksY.selectAll('text').data(g => g).join('text').text(d => d)
        .attr('y', d => -y(d))
        .attr('font-size', 12)
        .attr('dy', 6)
        .attr('text-anchor', 'end')


      const arc = d3.arc().innerRadius(d => y(d[0])).outerRadius(d => y(d[1])).startAngle(d => x(d.data.city)).endAngle(d => x(d.data.city) + x.bandwidth())
      const group = g.selectAll('.group').data(series).join('g').attr('class', 'group').attr('fill', s => z(s.key))
      group.selectAll('path').data(s => s).join('path').attr('fill', null).attr('d', arc)

 








    }
  },
};
</script>
