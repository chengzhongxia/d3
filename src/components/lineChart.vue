<template>
  <svg ref="chartRef" width="1000" height="500" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 30, left: 90, bottom: 30, right: 90 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default {
  data () {
    return {
      data: [
        { date: '2009', apple: 130, banana: 40 },
        { date: '2010', apple: 137, banana: 58 },
        { date: '2011', apple: 166, banana: 97 },
        { date: '2012', apple: 154, banana: 117 },
        { date: '2013', apple: 179, banana: 98 },
        { date: '2014', apple: 187, banana: 120 },
        { date: '2015', apple: 189, banana: 84 },
        { date: '2016', apple: 210, banana: 53 },
      ],
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const data = [...this.data]
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      const categroy = [{ key: 'apple', label: '苹果' }, { key: 'banana', label: '香蕉' }]

      /*  [
      [{key: 'apple', date: new Date('2009'), value: 130}, {key: 'apple', date: new Date('2010'), value: 137}, {key: 'apple', date: new Date('2011'), value: 166}],
      [{key: 'banana', date: new Date('2009'), value: 40}, {key: 'banana', date: new Date('2010'), value: 58}, {key: 'banana', date: new Date('2011'), value: 97}],
      ] */
      const series = categroy.map(cate => {
        return data.map(d => ({ key: cate.key, date: d3.timeParse('%Y')(d.date), value: d[cate.key] }))
      })

      // const colors = d3.scaleOrdinal().range(this.colors).domain(this.data.keys())
      const colors = d3.scaleOrdinal(d3.schemeCategory10) // 通用线条的颜色

      chart.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('height', height)
        .attr('width', 0)
        .transition()
        .duration(1000)
        .attr('width', width)



      // x轴
      const xScale = d3.scaleTime().range([0, width]).domain(d3.extent(series[0], d => d.date))
      g.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y年')))

      // y轴
      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(series, s => d3.max(s, d => d.value))])
      // .domain([0, d3.max([d3.max(series[0], d => d.value), d3.max(series[1], d => d.value)])])


      // ① 定义line ② 添加line
      // d3.line() => 生成 <line>的path路径
      const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))

      // 添加2条line
      /* g.selectAll('.serie')
        .data(series)
        .join('g')
        .attr('class', 'serie')
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', (s, i) => colors(i))
        .attr('d', s => line(s)) */

      // 生成两条线条的包层   
      const serie = g.selectAll('.serie')
        .data(series)
        .join('g')
        .attr('class', 'serie')

      // 画线条  
      serie.append('path')
        .attr('clip-path', 'url(#clip)')
        .attr('fill', 'none')
        .attr('stroke', (s, i) => colors(i))
        .attr('d', s => line(s))

      const labelSet = { w: 50, h: 24, padding: 4 }

      const label = serie.selectAll('.label')
        .data(s => s)
        .join('g')
        .attr('class', 'label')
        .attr('transform', d => `translate(${xScale(d.date)},${yScale(d.value)})`)


      // 生成数值文字、以及系列名字  
      label.append('text')
        .text(d => (d.value + '吨'))
        .attr('font-size', 12)
        .filter((d, i) => i === data.length - 1)
        .append('tspan')
        .text(d => ' ' + categroy.find(c => c.key === d.key).label)

      // 系列名字的样式
      serie.select('tspan')
        .attr('fill', (s, i) => colors(i))
        .attr('font-weight', 'bold')
        .attr('font-size', 14)

      // 在文字text的前方，添加一个rect方块，方块的宽高要随着text的宽高改变
      label.insert('rect', 'text')
        .datum(function () {
          return this.nextSibling.getBBox() // {height: 22,width: 33.796875,x: 0,y: -16}
        })
        .attr('fill', '#fff')
        .attr('x', d => (d.x - labelSet.padding))
        .attr('y', d => (d.y - labelSet.padding))
        .attr('width', d => (d.width + 2 * labelSet.padding))
        .attr('height', d => (d.height + 2 * labelSet.padding))

    }
  },
};
</script>
