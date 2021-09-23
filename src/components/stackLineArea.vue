<template>
  <svg ref="chartRef" width="1000" height="500" style="background:#eee;" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 30, left: 90, bottom: 30, right: 90 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

let timer = null

export default {
  data () {
    return {
      data: [],
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  watch: {
    data: {
      handler (n, o) {
        this.drawChart()
      }
    }
  },
  async created () {
    this.data = await d3.csv('./data/stackLineArea.csv')
  },
  methods: {
    drawChart () {
      const legends = { education: '教育', food: '食物', total: "总共", transportation: "交通" }
      const ticks = { Mon: '星期一', Tue: '星期二', Wed: "星期三", Thu: "星期四", Fri: '星期五', Sat: '星期六', Sun: '星期日' }
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      chart.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', 0).attr('height', height + 20).attr('transform', 'translate(-20, -20)').transition().duration(1000).attr('width', width + 40)

      const series = d3.stack().keys(Object.keys(legends)).offset(d3.stackOffsetDiverging)(this.data)

      const z = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys())
      const x = d3.scalePoint().range([0, width]).domain(this.data.map(d => d.date))
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(series, s => d3.max(s, d => d[1]))])

      g.append('g').classed('axis--x', true).call(d3.axisBottom(x).tickFormat(d => ticks[d])).attr('transform', `translate(0, ${height})`)
      g.append('g').attr('class', 'axis--y').call(d3.axisLeft(y).ticks(10))
        .selectAll('.tick:not(:first-of-type)').append('line').attr('x2', width).attr('stroke', '#ccc').attr('stroke-dasharray', '2,2')


      const area = d3.area().x(d => x(d.data.date)).y0(d => y(d[0])).y1(d => y(d[1]))
      const line = d3.line().x(d => x(d.data.date)).y(d => y(d[1]))
      const group = g.selectAll('.group').data(series).join('g').attr('class', 'group')
      // group.append('path').datum(s => s).attr('d', area).attr('fill', d => z(d.index)).attr('opacity', .8)
      group.append('path').attr('d', area).attr('fill', d => z(d.index)).attr('opacity', .8).attr('clip-path', 'url(#clip)')
      group.append('path').attr('d', line).attr('stroke', d => d3.rgb(z(d.index)).darker()).attr('fill', 'none').attr('clip-path', 'url(#clip)')

      const tip = g.append('text')
      g.selectAll('.circle').data(series).join('g').attr('class', 'circle').attr('clip-path', 'url(#clip)').append('g')
        .selectAll('circle').data(s => s).join('circle')
        .attr('cx', d => x(d.data.date)).attr('cy', d => y(d[1])).attr('r', 8).attr('fill', '#fff')
        .on('mousemove', debounce(tipTween, 20))
        .on('mouseleave', function(){
          clearTimeout(timer)
          timer = null
          d3.select(this).attr('fill', '#fff')
          tip.style('display', 'none')
        })

      function debounce (fn, delay) {
        // let timer = null // 原本是要在这里定义timer，但因为该事例在mouseout中要清除timeout定时器，所以使用了全局变量
        // return 返回的函数才是绑定事件触发的函数
        return function () {
          // arguments: 默认参数
          // this： 事件绑定的元素
          if (timer) {
            clearTimeout(timer)
          } else {
            fn.bind(this, ...arguments)() // 这里前置防抖
          }
          // bind():返回的是函数，不会立即执行，需要函数调用才会执行
          // fn.bind(this, ...arguments)  => 函数，不会立即执行
          timer = setTimeout(fn.bind(this, ...arguments), delay)
        }
      }

      function tipTween (e, d) {
        const key = d3.select(this.parentNode).datum().key
        tip.style('display', 'block').text(legends[key] + ':' + d.data[key])
          .attr('x', e.layerX - margin.left + 20).attr('y', e.layerY - margin.top - 10)
        d3.select(this).attr('fill', 'red')
      }

    },

  },

};
</script>
