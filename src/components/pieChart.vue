<template>
  <svg ref="chartRef" width="1000" height="650" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 30, left: 60, bottom: 30, right: 60 }
const radius = 130
export default {
  data () {
    return {
      data: [
        { age: '<5', population: 2704659 },
        { age: '5-13', population: 4499890 },
        { age: '14-17', population: 2159981 },
        { age: '18-24', population: 3853788 },
        { age: '25-44', population: 14106543 },
        { age: '45-64', population: 8819342 },
        { age: '≥65', population: 612463 }
      ],
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  mounted () {
    this.drawPie()
    this.transitionPie()
    this.interactPie()
    this.chartPie()
  },
  methods: {
    drawPie () {
      const data = [...this.data]
      const chart = d3.select(this.$refs.chartRef)
      const pieChart = chart.append('g')
        .attr('class', 'pie')
        .attr('transform', `translate(${margin.left + radius}, ${margin.top + radius})`)

      // pie的颜色： 序数比例尺
      // d3.map(data, d => d.age) => ["<5", "5-13", "14-17", "18-24", "25-44", "45-64", "≥65"]
      // ["<5", "5-13", "14-17", "18-24", "25-44", "45-64", "≥65"].keys() => Array Iterator {}
      /* for (let v of d3.map(data, d => d.age).keys()) {
        console.log(v); // 0 1 2 3 4 5 6
      } */
      const colors = d3.scaleOrdinal()
        .domain(d3.map(data, d => d.age))
        .range(this.colors)

      // d3.pie()，生成绘制弧线需要的具体数据

      const pie = d3.pie()
        .sort(null)
        .value(d => d.population)
      // console.log(pie(data));
      // [
      // {data: {age: "<5", population: 2704659}, index: 0, startAngle: 0, endAngle: 0.46233446988176324, padAngle: 0, value: 2704659},
      // ... 
      // ]



      // d3.arc()，圆弧生成器，传入pie数据，生成扇形
      // 根据参数生成圆弧
      /* const arc = d3.arc()
      arc({
        innerRadius: 0,
        outerRadius: 100,
        startAngle: 0,
        endAngle: Math.PI / 2
      }) */
      // 如果半径、角度信息在构建的时候久已经设为常量，则不需要传入参数
      /* const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(100)
        .startAngle(0)
        .endAngle(Math.PI / 2);
        arc() */

      const arc = d3.arc()
        .innerRadius(0)
        .padAngle(0)
        .outerRadius(radius)

      // 添加圆弧
      pieChart.selectAll('path')
        .data(pie(data))
        .join('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colors(d.data.age))

    },
    // 过渡效果：生成pie
    transitionPie () {
      const data = [...this.data]
      const colorsArr = [...this.colors].reverse()

      const chart = d3.select(this.$refs.chartRef)

      const transitionPie = chart.append('g')
        .attr('transform', `translate(${1000 - radius - margin.right}, ${margin.top + radius})`)

      // 饼图的颜色 => 序数比例尺
      const colors = d3.scaleOrdinal()
        .range(colorsArr)
        .domain(d3.map(data, d => d.age))

      // 绘制饼图的弧形所需的一些角度啊，半径等一些信息
      // 这些信息，由pie函数传入数据生成
      const pie = d3.pie()
        .sort(null)
        .value(d => d.population)

      // 弧形生成器 => 传入具体的角度信息等参数，可以生成扇形等弧形的路径数据
      const arc = d3.arc()
        .innerRadius(0)
        .padAngle(0)


      // 生成饼图
      // attrTween(attr, function(d, i, a))
      // d是被绑定数据，i是索引号，a是属性width的初始值。
      // 该函数返回的function(t)，t是0-1之间的插值
      // t的范围是[0,1]0表示变化的起始，1表示变化的结束。
      transitionPie.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colors(d.data.age))
        .each(function (d) {
          this.startInfo = { ...d, endAngle: d.startAngle }
          d.outerRadius = radius
        })
        .transition()
        .duration(100)
        .delay((d, i) => i * 100)
        .attrTween('d', function (next) {
          // d3.interpolate 插值
          const i = d3.interpolate(this.startInfo, next)
          this.startInfo = i(0)
          // return arc(next)
          return t => arc(i(t))
        })
    },
    // 有交互的pie
    interactPie () {
      const data = [...this.data]

      const interactPie = d3.select(this.$refs.chartRef)
        .append('g')
        .attr('transform', `translate(${margin.left + radius},${margin.top * 2 + margin.bottom + radius * 3})`)

      const colors = d3.scaleOrdinal()
        .range(this.colors)
        .domain(data.map(d => d.age))

      // var pie = d3.pie(); pie(args)，args 传入信息，可以返回生成圆弧所需的角度等信息
      const pie = d3.pie()
        .sort(null)
        .value(d => d.population)

      const arc = d3.arc()
        .innerRadius(0)
        .padAngle(0)

      interactPie.selectAll('path')
        .data(pie(data))
        .join('path')
        .attr('fill', d => colors(d.data.age))
        .attr('d', d => arc(d))
        .on('mouseover', arcTween(radius + 10, 0))
        .on('mouseout', arcTween(radius, 150))
        .each(d => {
          this.startInfo = { ...d, endAngle: d.startAngle }
          d.outerRadius = radius
        })
        .transition()
        .duration(100)
        .delay((d, i) => i * 100)
        .attrTween('d', function (next) {
          const i = d3.interpolate(this.startInfo, next)
          return t => arc(i(t))
        })


      // 缓动函数
      function arcTween (outerRadius, delay) {
        return function () {
          d3.select(this)
            .transition()
            .delay(delay)
            .attrTween('d', d => {
              const i = d3.interpolate(d.outerRadius, outerRadius)
              return t => arc({ ...d, outerRadius: i(t) })
            })
        }
      }

    },
    chartPie () {
      const data = [...this.data]
      const sum = d3.sum(data, d => d.population)
      const chart = d3.select(this.$refs.chartRef)
        .append('g')
        .attr('transform', `translate(${1000 - radius - margin.right},${margin.top * 2 + margin.bottom + radius * 3})`)

      const colors = d3.scaleOrdinal()
        .range([...this.colors].reverse())
        .domain(d3.map(data, d => d.age))


      // const pie = d3.pie() ,pie(data)传入数组，可以返回 生成弧形所需要的角度等信息
      const pie = d3.pie()
        .sort(null)
        .value(d => d.population)

      // const arc = d3.arc(), arc()传入pie生成的数据，可以生成扇形的路径  
      const arc = d3.arc()
        .innerRadius(0)
        .padAngle(0)


      chart.selectAll('path')
        .data(pie(data))
        // .join('path')
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colors(d.data.age))
        .on('mouseover', arcTween(radius + 10, 0))
        .on('mouseout', arcTween(radius, 150))
        .each(d => {
          this.startInfo = { ...d, endAngle: d.startAngle }
          d.outerRadius = radius
        })
        .transition()
        .duration(100)
        .delay((d, i) => i * 100)
        .attrTween('d', function (next) {
          const i = d3.interpolate(this.startInfo, next)
          return t => arc(i(t))
        })

      function arcTween (outerRadius, delay) {
        return function (e, data) {
          // e: event, data: 绑定的数据
          d3.select(this)
            .transition()
            .delay(delay)
            .attrTween('d', d => {
              const i = d3.interpolate(d.outerRadius, outerRadius)
              return t => arc({ ...d, outerRadius: i(t) })
            })
        }
      }



      const percentArc = d3.arc()
        .outerRadius(radius - 30)
        .innerRadius(radius - 30)

      const linkStartArc = d3.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius - 10)

      const linkEndArc = d3.arc()
        .innerRadius(radius + 25)
        .outerRadius(radius + 25)


      // 创建百分比文字包层
      const labels = chart.append('g')

      // 创建连接线包层
      const links = chart.append('g')

      const arcs = pie(data)
      arcs.forEach((d, i) => {
        // arc.centroid(arg):根据arg生成中间点[x,y]
        const c = percentArc.centroid(d)
        labels.append('text')
          .attr('font-size', 10)
          .attr('x', c[0])
          .attr('y', c[1])
          .text((d.data.population * 100 / sum).toFixed(1) + '%')

        const start = linkStartArc.centroid(d)
        const end = linkEndArc.centroid(d)
        const link = {
          source: [start[0], start[1]],
          target: [end[0], end[1]]
        }

        links.append('text')
          .datum(data[i])
          .join('text')
          .attr('x', link.target[0])
          .attr('y', link.target[1])
          .attr('font-size', 10)
          .attr('text-anchor', 'middle')
          .text(d => `${d.age} : ${d.population}`)


        links.append('path')
          .datum(link)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 1)
          .attr('d', d3.linkHorizontal().source(d => d.source).target(d => d.target))

      })




    }
  },
};
</script>
