<template>
  <svg ref="chartRef" width="1000" height="500" />
</template>
<script>
import * as d3 from "d3";
import axios from 'axios'
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
        // console.log(n, o);
        this.drawChart()
      }
    }
    // data (n, o) {
    //   this.drawChart()
    // }
    // data: function (n, o) {
    //   this.drawChart()
    // }
  },
  async created () {
    this.data = await d3.csv('./data/stackLineArea.csv')
  },
  methods: {
    drawChart () {
      const legends = { education: '教育', food: '食物', total: "总共", transportation: "交通" }
      const ticks = { Mon: '星期一', Tue: '星期二', Wed: "星期三", Thu: "星期四", Fri: '星期五', Sat: '星期六', Sun: '星期日' }
      const series = d3.stack().keys(Object.keys(legends)).offset(d3.stackOffsetDiverging)(this.data)


      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)


      const colors = d3.scaleOrdinal().range(this.colors.reverse()).domain(this.colors.keys())

      const x = d3.scalePoint().range([0, width]).domain(this.data.map(d => d.date))
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(series, s => d3.max(s, d => d[1]))])
      
      const ticksFormat = (d) => ticks[d]
      g.append('g').attr('class', 'axis--x').call(d3.axisBottom(x).tickFormat(ticksFormat)).attr('transform', `translate(0,${height})`)
      g.append('g').attr('class', 'axis--y').call(d3.axisLeft(y))
      d3.selectAll('.axis--y .tick').append('line').attr('x2', width).attr('stroke', '#ccc').attr('stroke-dasharray', `2,2`)



      const area = d3.area().x(d => x(d.data.date)).y0(d => y(d[0])).y1(d => y(d[1]))
      const line = d3.line().x(d => x(d.data.date)).y(d => y(d[1]))


      chart.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('fill', '#000').attr('height', height + margin.top).attr('transform', `translate(-${margin.left}, -${margin.top})`)
        .attr('width', 0).transition().duration(1000).attr('width', width + margin.right+margin.left)



      const tip = chart.append('text')

      g.selectAll('.area').data(series).join('path').attr('class', 'area').attr('clip-path', 'url(#clip)').attr('fill', (s, i) => colors(i)).attr('opacity', .7).attr('d', s => area(s)) //.attr('d', area)
      g.selectAll('.line').data(series).join('path').attr('class', 'line').attr('clip-path', 'url(#clip)').attr('fill', 'none').attr('stroke', (s, i) => d3.rgb(colors(i)).darker()).attr('d', line) //.attr('d', area)
      g.selectAll('.circle').data(series).join('g').attr('class', 'circle').attr('clip-path', 'url(#clip)').attr('fill', (s, i) => colors(i)).selectAll('circle').data(s => s)
        .join('circle').attr('fill', '#fff').attr('cx', d => x(d.data.date)).attr('cy', d => y(d[1])).attr('r', 8).attr('stroke', function () {
          return d3.rgb(d3.select(this.parentNode).attr('fill')).darker()
        })
        .on('mousemove', this.debounce(tipTween, 20))
        .on('mouseout', function () {
          const ctx = this
          clearTimeout(timer)
          console.log(timer);
          timer = null
          // setTimeout(function(){
          tip.style('display', 'none')
          d3.select(ctx).attr('fill', '#fff')
          // }, 1000)
        })

      function tipTween (e, d) {
        // 这里this是调用这个函数时绑定的context上下文
        const ctx = this
        return function () { // 这边返回的匿名函数，实际就是setTimeout的第一个参数，回调函数
          // 这里的this： window对象
          const key = d3.select(ctx.parentNode).datum().key

          tip.style('display', 'block').text(`${legends[key]}: ${d.data[key]}`).attr('x', e.layerX + 20).attr('y', e.layerY - 10)
          // .attr('transform', `translate(${margin.left + x(d.data.date) + 20}, ${margin.top + y(d[1]) -10})`)

          d3.select(ctx).attr('fill', null)
        }

      }




      // function debounce (fn, delay) {
      //   // 这里的this是window对象
      //   let timer = null
      //   return function (e, d) {
      //     // 这里的this是事件绑定的元素对象
      //     const context = this
      //     if (timer) {
      //       clearTimeout(timer)
      //     }
      //     timer = setTimeout(fn.call(context, e, d), delay)
      //   }
      // }


    },
    debounce (fn, delay) {
      // 这里的this是vue实例
      // let timer = null // 原本是要在这里定义timer，但因为该事例在mouseout中要清除timeout定时器，所以使用了全局变量
      return function (e, d) {
        // 这里的this是事件绑定的元素对象
        const context = this

        if (timer) {
          clearTimeout(timer)
        } else {
          fn.bind(context)(e, d)() // 这里前置防抖
        }
        timer = setTimeout(fn.bind(context)(e, d), delay)
        // timer = setTimeout(fn.call(context, e, d), delay)
      }
    }
  },

};
</script>
