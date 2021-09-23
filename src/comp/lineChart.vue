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
      const data = this.data.map(d => ({ ...d, date: d3.timeParse('%Y')(d.date) }))
      const chart = d3.select(this.$refs.chartRef)
      const padding = 4

      // 画线图： 2条线图 => 数据处理
      const categroy = { apple: '苹果', banana: '香蕉' }
      /*  [
      [{key: 'apple', date: new Date('2009'), value: 130}, {key: 'apple', date: new Date('2010'), value: 137}, {key: 'apple', date: new Date('2011'), value: 166}],
      [{key: 'banana', date: new Date('2009'), value: 40}, {key: 'banana', date: new Date('2010'), value: 58}, {key: 'banana', date: new Date('2011'), value: 97}],
      ] */

      const series = Object.keys(categroy).map(key => {
        return data.map(d => ({ key, date: d.date, value: d[key] }))
      })

      // 主图的外包层
      const g = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      // 颜色比例尺
      const colors = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys())

      // x轴、y轴
      const x = d3.scaleTime().range([0, width]).domain(d3.extent(data, d => d.date))
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(series, s => d3.max(s, d => d.value))])

      // 添加x轴
      g.append('g').call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y年'))).attr('transform', `translate(0,${height})`)

      // 添加线图
      // ① 定义line： 生成line的path路径 ② 添加line
      const line = d3.line().x(d => x(d.date)).y(d => y(d.value))

      const serie = g.selectAll('.serie').data(series).join('g').attr('class', 'serie')


      // 遮罩线动画
      chart.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('height', height).attr('width', 0).transition().duration(1000).attr('width', width)

      serie.append('path').attr('clip-path', 'url(#clip)').attr('fill', 'none').attr('stroke', (s, i) => colors(i)).attr('d', s => line(s))

      // 文字包层
      const labels = g.selectAll('.label-g').data(series).join('g').attr('class', 'label-g').selectAll('g').data(s => s).join('g')

      // 添加文字, 系列名称
      labels.append('text')
        .attr('x', d => x(d.date))
        .attr('y', d => y(d.value))
        .attr('fill', '#000')
        .attr('font-size', 12)
        .text(d => `${d.value}吨`)
        .filter((d, i) => i === data.length - 1)
        .append('tspan')
        .text(d => categroy[d.key])
        .attr('dx', '1em')
        .attr('font-weight', 'bold')
        .attr('fill', d => colors(Object.keys(categroy).findIndex(k => k === d.key)))

      // 添加文字的背景方块
      labels.insert('rect', 'text')
        .datum(function () {
          return this.nextSibling.getBBox()
        })
        .attr('fill', '#fff')
        .attr('width', d => (d.width + 2 * padding))
        .attr('height', d => (d.height + 2 * padding))
        .attr('x', d => (d.x - padding))
        .attr('y', d => (d.y - padding))




    }
  },
};
</script>
