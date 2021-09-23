<template>
  <svg ref="chartRef" width="1000" height="600">
    <!-- 线性渐变 -->
    <defs>
      <!-- 
        垂直渐变：x1 == x2, y1 !== y2 
        水平渐变：x1 !== x2, y1 == y2 
        角形渐变：x1 !== x2, y1 != y2 
       -->
      <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
        <!-- 渐变的颜色范围可由两种或多种颜色组成。每种颜色通过一个 <stop> 标签来规定。 -->
        <stop offset="0%" style="stop-color:#d1e0f3;"></stop>
        <stop offset="20%" style="stop-color:#9dc8ff;"></stop>
        <stop offset="50%" style="stop-color:#84b9ff;"></stop>
        <stop offset="70%" style="stop-color:#76b0fc;"></stop>
        <stop offset="100%" style="stop-color:#5ba0fa;"></stop>
      </linearGradient>
    </defs>

    <!-- 径向渐变 -->
    <defs>
      <radialGradient id="radial" cx="20%" cy="40%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="blue" />
        <stop offset="50%" stop-color="orange" />
        <stop offset="100%" stop-color="red" />
      </radialGradient>
    </defs>
  </svg>
</template>
<script>
import * as d3 from 'd3';
export default {
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const data = [
        { letter: '一', frequency: 0.08167 },
        { letter: '二', frequency: 0.13492 },
        { letter: '三', frequency: 0.02782 },
        { letter: '四', frequency: 0.04253 },
        { letter: '五', frequency: 0.12702 },
        { letter: '六', frequency: 0.02288 },
        { letter: '日', frequency: 0.22288 }
      ]
      const margin = {
        top: 80,
        bottom: 30,
        left: 60,
        right: 20
      }

      const colorArr = ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']

      // 颜色
      const colors = d3.scaleOrdinal()
        .range(colorArr)
        .domain(colorArr.keys())

      // 分段
      const Y_TICKS = 12

      const width = 1000 - margin.left - margin.right
      const height = 600 - margin.top - margin.bottom

      const chart = d3.select(this.$refs.chartRef)

      // chart.append('defs').append('linearGradient').attr('id', 'linear')




      // 包层
      const g = chart.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // 分段比例尺  
      const xScale = d3.scaleBand()
        .rangeRound([0, width]) // 输出域 
        .domain(data.map(d => d.letter)) //  输入域 ['一','二','三','四','五','六','日']
        .padding(0.1)

      // 线性比例尺  
      const yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => d.frequency)])

      // 坐标轴
      g.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))

      g.append('g')
        .call(d3.axisLeft(yScale).ticks(Y_TICKS, '%')) // 坐标轴分成Y_TICKS段，格式化为“%”
        .append('text')
        .text('空置率（%）')
        .attr('text-anchor', 'middle')
        .attr('dy', '-1em')
        .attr('fill', '#000')

      // 背景柱
      const stepArr = d3.ticks(0, d3.max(data, d => d.frequency), Y_TICKS)
      g.append('g')
        .selectAll('rect')
        .data(stepArr)
        .join('rect')
        .attr('width', width)
        .attr('height', (d, i) => ((yScale(stepArr[i]) - yScale(stepArr[i + 1])) || 0))
        .attr('x', 0)
        .attr('y', (d, i) => yScale(stepArr[i + 1]))
        .attr('fill', (d, i) => colors(i % (colorArr.length)))
        .attr('opacity', 0.3)

      // tip  
      const tipSet = { w: 90, h: 50 }
      // tip
      const tip = g.append('g')
        .style('display', 'none')

      // bar  
      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', xScale.bandwidth())
        .attr('x', d => xScale(d.letter))
        .attr('y', height)
        // .attr('fill', 'skyblue')
        .attr('fill', 'url(#linear)')
        .attr('height', 0)
        .on('mouseover', tipTween(tip, 'block'))
        .on('mouseout', tipTween(tip, 'none'))
        .transition()
        .duration(300)
        .ease(d3.easeBounceOut)
        .delay((d, i) => i * 300)
        .attr('y', d => yScale(d.frequency))
        .attr('height', d => (height - yScale(d.frequency)))


      // text
      g.append('g')
        .attr('class', 'text')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (d, i) => xScale(d.letter))
        .attr('y', (d, i) => yScale(d.frequency))
        .attr('dx', xScale.bandwidth() / 2)
        .attr('dy', '1.5em')
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .transition()
        .duration(300)
        .delay((d, i) => (i + 1) * 300)
        .text(d => ((d.frequency * 100).toFixed(2) + '%'))


      function tipTween (tip, display) {
        return function (e, data) {
          const set = [`星期${data.letter}`, `${(data.frequency * 100).toFixed(2)}%`]

          tip.attr('transform', `translate(${xScale(data.letter) + (xScale.bandwidth() - tipSet.w) / 2},${yScale(data.frequency) - 10})`)
            .style('display', display)

          tip.selectAll('path')
            .data([null])
            .join('path')
            .attr('d', `M0,0 h${tipSet.w / 2 - 4} l4,4 l4,-4 h${tipSet.w / 2 - 4} v${-tipSet.h} h${-tipSet.w} z`)
            .attr('stroke', '#aaa')
            .attr('fill', "#fff")

          tip.selectAll('text')
            .data(set)
            .join('text')
            .text(d => d)
            .attr('text-anchor', 'middle')
            .attr('dx', `${tipSet.w / 2}`)
            .attr('y', (d, i) => `${-(i + 1)}em`)

          if (display === 'none')
            d3.select(this).attr('fill', 'url(#linear)')
          else if (display === 'block')
            d3.select(this).attr('fill', '#26b1ea')
        }
      }

    }
  },
}
</script>