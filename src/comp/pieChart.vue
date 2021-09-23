<template>
  <svg ref="chartRef" width="1000" height="600" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 80, left: 80, bottom: 80, right: 160 }
const radius = 160
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
    this.drawChart()
    this.drawPie()
  },
  methods: {
    drawChart () {
      const data = [...this.data]
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g')
        .attr('class', 'pie')
        .attr('transform', `translate(${margin.left + radius},${margin.top + radius})`)

      const colors = d3.scaleOrdinal()
        .domain(data.map(d => d.age))
        .range(this.colors)

      // 画饼图 ① d3.arc()圆弧构建器 => 主要通过输入角度等信息生成 path元素的路径 ② d3.pie()角度等信息，则有pie来生成
      const pie = d3.pie()
        .sort(null)
        .value(d => d.population)
      // console.log(pie(data));

      const arc = d3.arc()
        .innerRadius(0)
        .padAngle(0)
      // .outerRadius(radius)

      g.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', d => arc(d))
        .attr('fill', d => colors(d.data.age))
        // // .each(d => (d.outerRadius = radius))
        .each(d => {
          this.startInfo = { ...d, endAngle: d.startAngle }
          d.outerRadius = radius
        })
        .on('mouseover', arcTween(radius + 20, 0))
        .on('mouseout', arcTween(radius, 150))
        .transition()
        .duration(100)
        .delay((d, i) => i * 100)
        .attrTween('d', function (d) {
          const i = d3.interpolate(this.startInfo, d)
          return t => arc(i(t))
        })

      function arcTween (outerRadius, delay) {
        return function (e, data) {
          d3.select(this)
            .transition()
            .delay(delay)
            .attrTween('d', function (d) {
              const i = d3.interpolate(d.outerRadius, outerRadius)
              return t => arc({ ...d, outerRadius: i(t) })
            })
        }
      }

    },
    drawPie () {
      const data = [...this.data]
      const sum = d3.sum(data, d => d.population)
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g')
        .attr('transform', `translate(${margin.left + margin.right + radius * 3},${margin.top + radius})`)

      const colors = d3.scaleOrdinal()
        .range([...this.colors].reverse())
        .domain(data.map(d => d.age))

      // 圆弧构建器 d3.arc(),圆弧构建器传入参数会生成生产扇形的路径信息 , 画圆弧需要的角度信息，由 d3.pie() 来生成
      const pie = d3.pie()
        .sort(null)
        .value(d => d.population)

      const arc = d3.arc()
        .padAngle(0)

      // 添加圆弧
      g.append('g')
        .attr('class', 'pie')
        .selectAll('path')
        .data(pie(data))
        .join('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colors(d.data.age))
        .on('mouseover', arcTween(20, 0))
        .on('mouseout', arcTween(0, 100))
        .each(d => {
          this.startInfo = { ...d, endAngle: d.startAngle }
          d.outerRadius = radius
          d.innerRadius = radius - 60
        })
        .transition()
        .duration(100)
        .delay((d, i) => i * 100)
        .attrTween('d', function (d) {
          const i = d3.interpolate(this.startInfo, d)
          return t => arc(i(t))
        })

      function arcTween (change, delay) {
        return function (e, d) {
          console.log(e, d);
          d3.select(this)
            .transition()
            .delay(delay)
            .attrTween('d', function (next) {
              const i = d3.interpolate(next, { ...next, outerRadius: next.outerRadius + change, innerRadius: next.innerRadius + change })
              return t => arc(i(t))
            })
        }
      }


      const labelArc = d3.arc()
        .innerRadius(radius - 30)
        .outerRadius(radius - 30)
        .padAngle(0)



      const labels = g.append('g').attr('class', 'label')

      const linkStartArc = d3.arc()
        .innerRadius(radius - 5)
        .outerRadius(radius - 5)
        .padAngle(0)

      const linkEndArc = d3.arc()
        .innerRadius(radius + 50)
        .outerRadius(radius + 50)
        .padAngle(0)

      const links = g.append('g').attr('class', 'link')


      pie(data).forEach(d => {
        // arc.centroid(arg)根据arg生成 中心点的坐标[x,y]
        const c = labelArc.centroid(d)
        labels.append('text')
          .text((d.data.population / sum * 100).toFixed(1) + '%')
          .attr('text-anchor', 'middle')
          .attr('x', c[0])
          .attr('y', c[1])
          .attr('font-size', 12)


        // links
        const start = linkStartArc.centroid(d)
        const end = linkEndArc.centroid(d)
        const link = {
          source: start,
          target: end
        }

        links.append('path')
          .datum(link)
          .attr('fill', 'none')
          .attr('stroke', '#666')
          .attr('d', d3.linkHorizontal().source(d => d.source).target(d => d.target))

        links.append('text')
          .attr('x', end[0])
          .attr('y', end[1])
          .attr('font-size', 10)
          .attr('text-anchor', 'middle')
          .text(`${d.data.age}: ${d.data.population}`)

      });

      g.append('text').text('XX市人口年龄结构').attr('text-anchor', 'middle').attr('fill', '#000')
    }
  },
};
</script>
