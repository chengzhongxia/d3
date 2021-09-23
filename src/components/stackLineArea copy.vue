<template>
  <svg ref="chartRef" width="1000" height="500" />
</template>
<script>
import * as d3 from "d3";
import axios from 'axios'
const margin = { top: 30, left: 90, bottom: 30, right: 90 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default {
  data () {
    return {
      data: [],
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  watch: {
    data (n, o) {
      // console.log(n,o);
      this.drawChart()
    }
  },
  async created () {
    // axios.get('./data/stackLineArea.csv')
    //   .then(response => {
    //     console.log(response.data);
    //   })

    this.data = await d3.csv("../data/stackLineArea.csv");

  },
  methods: {
    drawChart () {
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      const legends = { education: '教育', food: '食物', total: "总共", transportation: "交通" }

      const series = d3.stack().keys(Object.keys(legends)).offset(d3.stackOffsetDiverging)(this.data)

      const colors = d3.scaleOrdinal().range(this.colors.reverse()).domain(this.colors.keys())

      const x = d3.scalePoint().range([0, width]).domain(this.data.map(d => d.date))
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(series, s => d3.max(s, d => d[1]))])


      g.append('g').attr('class', 'axis--x').call(d3.axisBottom(x)).attr('transform', `translate(0, ${height})`)

      g.append('g').attr('class', 'axis--y').call(d3.axisLeft(y).ticks(10)).append('text').text('每日花费(元)').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('fill', '#000').attr('dy', '-1.5em')

      d3.selectAll('.axis--y .tick').append('line').attr('x2', width).attr('stroke', '#aaa')


      // console.log(series);
      const area = d3.area().y0(d => y(d[0])).y1(d => y(d[1])).x(d => x(d.data.date))

      const group = g.selectAll('.group').data(series).join('g').attr('class', 'group').attr('fill', (s, i) => colors(i)).attr('opacity', 0.7)

      group.append('path').datum(s => s).attr('d', area)
      // .attr('stroke', function () {
      //   const fill = d3.select(this.parentNode).attr('fill')
      //   return d3.rgb(fill).darker()
      // })

      const line = d3.line().x(d => x(d.data.date)).y(d => y(d[1]))
      
      group.append('path').datum(s => s).attr('class', 'line').attr('d', line).attr('fill', 'none')
        .attr('stroke', function () {
          const fill = d3.select(this.parentNode).attr('fill')
          return d3.rgb(fill).darker()
        })


      const tip = chart.append('text')

      g.selectAll('.circles').data(series).enter().append('g').attr('class', 'circles').attr('fill', (s, i) => colors(i))
        .selectAll('circle').data(s => s).join('circle').attr('cx', d => x(d.data.date)).attr('cy', d => y(d[1])).attr('r', 8).attr('cursor', 'pointer').attr('fill', '#fff')
        .attr('stroke', function () {
          const fill = d3.select(this.parentNode).attr('fill')
          return d3.rgb(fill).darker()
        })
        .on('mousemove', debounce(tipTween, 10))
        // .on('mousemove', function (e,d) {
        //   tipTween(e,d, this)()
        // })
        .on('mouseleave', function (e, d) {
          // console.log(e);
          const ctx = this
          setTimeout(function () {
            tip.style('display', 'none')
            d3.select(ctx).attr('fill', '#fff')
          }, 10)
        })



      function tipTween (e, d) {
        const ctx = this
        return function () {
          // 这里的this是window对象
          const key = d3.select(ctx.parentNode).datum().key

          tip.style('display', 'block')
            .text(`${legends[key]}: ${d.data[key]}`)
            .attr('x', e.layerX + 20)
            .attr('y', e.layerY - 10)
          // .attr('transform', `translate(${margin.left + x(d.data.date) + 20}, ${margin.top + y(d[1]) -10})`)

          d3.select(ctx).attr('fill', null)

        }

      }


      function debounce (fn, delay) {
        // 这里的this是window对象
        let timer = null
        return function (e, d) {
          // 这里的this是事件绑定的元素对象
          const context = this
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(fn.call(context, e, d), delay)
        }
      }
    }
  },
};
</script>
