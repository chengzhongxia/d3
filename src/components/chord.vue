<template>
  <svg ref="chartRef" width="1000" height="600" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 90, left: 90, bottom: 30, right: 100 }
const width = 1000 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

export default {
  data () {
    return {
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const names = ['北京', '上海', '广州', '深圳']
      const matrix = [
        [11975, 5871, 8916, 2868],
        [1951, 10048, 2060, 6171],
        [8010, 16145, 8090, 8045],
        [1013, 990, 940, 6907]
      ]
      const outerRadius = 200
      const innerRadius = outerRadius - 30
      const chart = d3.select(this.$refs.chartRef)
      const colors = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys())

      // d3.chord() 构建一个默认配置的弦图
      const chord = d3.chord()
        .padAngle(0.1) // 相邻弦片段之间的间隙
        .sortSubgroups(d3.descending) // matrix矩阵行内各元素降序排列

      const chords = chord(matrix)
      // 伪数组，分为 chords、groups
      // chords：用来构建内弦图（中间彩带）
      // 每个元素分为 source、target，分别为两个节点间连线的起点和终点
      // groups：用来构建外弦图（圆环），即表示节点P

      /*  {
                    0: {
                      "source": { "index": 0, "startAngle": 0, "endAngle": 0.7045114405347555, "value": 11975 },
                      "target": { "index": 0, "startAngle": 0, "endAngle": 0.7045114405347555, "value": 11975 }
                    },
                    1: {
                      "source": { "index": 0, "startAngle": 1.2290562425228875, "endAngle": 1.574458051907401, "value": 5871 },
                      "target": { "index": 1, "startAngle": 2.918575248816668, "endAngle": 3.0333561941597416, "value": 1951 }
                    },
                    2: {
                      "source": { "index": 0, "startAngle": 0.7045114405347555, "endAngle": 1.2290562425228875, "value": 8916 },
                      "target": { "index": 2, "startAngle": 5.032448411317311, "endAngle": 5.503691554422396, "value": 8010 }
                    },
                    3: {
                      "source": { "index": 0, "startAngle": 1.574458051907401, "endAngle": 1.7431878065173114, "value": 2868 },
                      "target": { "index": 3, "startAngle": 6.010043163589289, "endAngle": 6.069639830751019, "value": 1013 }
                    },
                    4: {
                      "source": { "index": 1, "startAngle": 1.8431878065173115, "endAngle": 2.4343302661827164, "value": 10048 },
                      "target": { "index": 1, "startAngle": 1.8431878065173115, "endAngle": 2.4343302661827164, "value": 10048 }
                    },
                    // …………
                    groups:[
                      {endAngle: 1.7431878065173114, index: 0, startAngle: 0, value: 29630},
                      {endAngle: 3.0333561941597416, index: 1, startAngle: 1.8431878065173115, value: 20230},
                      {endAngle: 5.503691554422396, index: 2, startAngle: 3.1333561941597416, value: 40290},
                      {endAngle: 6.183185307179585, index: 3, startAngle: 5.6036915544223955, value: 9850}
                    ]
                  }
             */


      // 外包层,并绑定chords数据
      const g = chart.append('g').attr('transform', 'translate(500, 300)').datum(chords)

      const group = g.append('g')
        .attr('class', 'groups')
        .selectAll('g')
        .data(chords => chords.groups)
        .join('g')

      // 弧构建器 d3.arc()
      const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

      // 添加节点 => 圆环
      group.append('path')
        .attr('d', arc)
        .attr('fill', (node, i) => colors(i))
        .attr('stroke', (node, i) => d3.rgb(colors(i)).darker())

      // 添加节点名称，圆环的名称
      group.append('g')
        .attr('transform', node => `rotate(${(node.startAngle + node.endAngle) / 2 / Math.PI * 180 - 90})translate(${outerRadius + 60},0)`)
        .append('text')
        .attr('fill', (node, i) => d3.rgb(colors(i)).darker())
        .attr('font-weight', 700)
        .text((node, i) => names[i])
        .attr('text-anchor', 'middle') // 水平方向居中
        .attr('dominant-baseline', 'middle') // 垂直方向居中
        .attr('transform', node => `rotate(${(node.startAngle + node.endAngle) / 2 > Math.PI ? 180 : 0})`)   // 第3、4象限的文字翻转一下  


      // 节点上添加刻度线，这个刻度线 => 角度映射value值

      // 返回一个数组，这个数组用来生成刻度线。 这个数组的元素 包括，angle、value
      // [{value:50, angle: 0.7},...{value:25000, angle: 3.7}]
      function groupTicks (node, step) {
        // node: {endAngle: 1.7431878065173114, index: 0, startAngle: 0, value: 29630},
        // d3.range(start, end, step) // 返回一个数组，start开始，step为步进器， end结束（不包括）
        const k = (node.endAngle - node.startAngle) / node.value // 算出比例
        return d3.range(0, node.value, step).map(d => ({ value: d, angle: node.startAngle + d * k }))
      }

      // 刻度线外包层， 旋转移动到相应位置
      const tick = group.append('g')
        .attr('class', 'ticks')
        .selectAll('g')
        .data(node => groupTicks(node, 1e3)).join('g')
        .attr('transform', d => `rotate(${d.angle / Math.PI * 180 - 90})translate(${outerRadius},0)`)

      // 添加刻度线
      tick.append('line')
        .attr('x2', 6)
        .attr('stroke', '#000')

      // 添加刻度文字，逢5显示
      // tick.filter((d, i) => i%5 === 0)
      tick.filter(d => d.value % 5e3 === 0)
        .insert('text', 'line')
        .text((d, i) => i * 5 + 'K')
        .attr('font-size', 10)
        .attr('text-ancho', 'middle') // 水平方向居中
        .attr('dominant-baseline', 'middle') // 垂直方向居中
        .attr('dx', '1em')
        .attr('transform', d => `rotate(${d.angle > Math.PI ? 180 : 0})`)
        .attr('dx', d=> d.angle > Math.PI ? '-3.8em' : '2em')


      // 画内弦图， 中间彩带
      const ribbon = d3.ribbon().radius(innerRadius) // 弦的半径为弧的内半径

      g.append('g')
        .attr('class', 'ribbon')
        .selectAll('path')
        .data(chords => chords)
        .enter()
        .append('path')
        .attr('d', ribbon)
        .attr('fill', 'none')
        .attr('opacity', '0.8')
        .transition()
        .duration(60)
        .delay((d, i) => i * 60)
        .attr('fill', d => colors(d.target.index))
        .attr('stroke', d => d3.rgb(colors(d.target.index)).darker())


      chart
        .append('g') // 输出标题
        .attr('class', 'chart--title')
        .append('text')
        .attr('fill', '#000')
        .attr('font-size', '16px')
        .attr('font-weight', '700')
        .attr('text-anchor', 'middle')
        .attr('x', 500)
        .attr('y', 20)
        .text('某快递公司昨天来往于北上广深(含同城快递)的快递件数(件)')


    }
  },
};
</script>
