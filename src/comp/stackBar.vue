<template>
  <svg ref="chartRef" width="1000" height="500" />
</template>
<script>
import * as d3 from "d3";
import Color from '@/common/color'
import Tip from '@/common/tip'


const margin = { top: 90, left: 90, bottom: 30, right: 100 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default {
  data () {
    return {
      data: [
        { date: '2011', q1: -155, q2: 200, q3: 214, q4: 234 },
        { date: '2012', q1: 185, q2: -210, q3: -244, q4: 254 },
        { date: '2013', q1: 275, q2: 230, q3: -274, q4: -274 },
        { date: '2014', q1: -185, q2: 250, q3: 304, q4: 294 },
        { date: '2015', q1: 95, q2: -270, q3: 334, q4: 314 },
        { date: '2016', q1: 205, q2: 290, q3: 364, q4: -330 }
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
      const keys = Object.keys(legends)
      const dates = data.map(d => d.date)

      const colors = d3.scaleOrdinal().range(this.colors.reverse()).domain(this.colors.keys())

      // const series = keys.map(key => data.map(d => ({key, date: d.date, value: d[key]})))
      // console.log(series);

      // 堆叠图
      const stack = d3.stack().keys(keys).offset(d3.stackOffsetDiverging)
      const series = stack(data)
      /* [
        [[-155, 0], [0, 185], [0, 275], [-185, 0], [0, 95], [0, 205]], 
        [[0, 200], [-210, 0], [275, 505], [0, 250], [-270, 0], [205, 495]], 
        [[200, 414], [-454, -210], [-274, 0], [250, 554], [95, 429], [495, 859]], 
        [[414, 648], [185, 439], [-548, -274], [554, 848], [429, 743], [-330, 0]]
      ] */


      // x、y轴
      const x = d3.scaleBand().range([0, width]).domain(data.map(d => d.date)).padding(0.1)
      // console.log(Math.min.apply(null, data.map(d => d.date)));
      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([
          d3.min(series, s => d3.min(s, d => d[0])),
          d3.max(series, s => d3.max(s, d => d[1])),
        ])

      g.append('g')
        .call(d3.axisBottom(x))
        .attr('transform', `translate(0,${y(0)})`)  

      g.append('g')
        .call(d3.axisLeft(y)) 
        .append('text')
        .text('利润(万)') 
        .attr('fill', '#000')
        .attr('text-anchor', 'middle')
        .attr('dy', '-1em')



      const tip = new Tip(chart, {w: 110, h: 100})

      // 堆叠柱状图
      g.selectAll('.serie')
        .data(series)
        .join('g')
        .attr('class', 'serie')
        .attr('fill', (s, i) => colors(i))
        .selectAll('rect')
        .data(s => s)
        .enter()
        .append('rect')  
        .attr('x', (d,i) => x(dates[i]))
        .attr('y', d => y(0))
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .on('mouseover', function (e,d, data) {
          // js中，获取元素的父级元素、父级元素的边界框描述
          // this.parentNode     dom.getBBox()
          d3.select(this).attr('fill', Color.darker(d3.select(this.parentNode).attr('fill'), 0.1))
        
          tip.show([(x(d.data.date) + x.bandwidth()/2 + margin.left),y(0)], [`${d.data.date}年：`, ...keys.map(key => `${legends[key]}：${d.data[key]}吨`)])

        })
        .on('mouseout', function (e,d) {
          d3.select(this).attr('fill','null')
          tip.hide()
        })
        .transition()
        .duration(1000)
        .attr('y', d => y(d[1]))
        .attr('height', d => (y(d[0]) - y(d[1])))
        

        
    }
  },
};
</script>
