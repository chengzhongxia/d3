<template>
  <svg ref="chartRef" width="1000" height="600"></svg>
</template>
<script>
import * as d3 from 'd3';
export default {
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const rawdata = [{ day: '2015-01', quantity: 1240 },
      { day: '2015-02', quantity: 1905 },
      { day: '2015-03', quantity: 6232 },
      { day: '2015-04', quantity: 7545 },
      { day: '2015-05', quantity: 543 },
      { day: '2015-06', quantity: 443 },
      { day: '2015-07', quantity: 246 },
      { day: '2015-08', quantity: 5445 },
      { day: '2015-09', quantity: 1154 },
      { day: '2015-10', quantity: 448 },
      { day: '2015-11', quantity: 1545 },
      { day: '2015-12', quantity: 4585 },
      { day: '2016-01', quantity: 1520 },
      { day: '2016-02', quantity: 9015 },
      { day: '2016-03', quantity: 632 },
      { day: '2016-04', quantity: 745 },
      { day: '2016-05', quantity: 343 },
      { day: '2016-06', quantity: 6443 },
      { day: '2016-07', quantity: 546 },
      { day: '2016-08', quantity: 1545 },
      { day: '2016-09', quantity: 1354 },
      { day: '2016-10', quantity: 848 },
      { day: '2016-11', quantity: 2155 },
      { day: '2016-12', quantity: 4585 },
      { day: '2017-01', quantity: 1540 },
      { day: '2017-02', quantity: 905 },
      { day: '2017-03', quantity: 632 },
      { day: '2017-04', quantity: 745 },
      { day: '2017-05', quantity: 3543 },
      { day: '2017-06', quantity: 4443 },
      { day: '2017-07', quantity: 2546 },
      { day: '2017-08', quantity: 545 },
      { day: '2017-09', quantity: 154 },
      { day: '2017-10', quantity: 4848 },
      { day: '2017-11', quantity: 155 },
      { day: '2017-12', quantity: 4585 }
      ]
      const margin = { top: 80, bottom: 200, left: 60, right: 20 }
      const margin2 = { top: 450, bottom: 60, left: 60, right: 20 }
      const width = 1000 - margin.left - margin.right
      const height = 600 - margin.top - margin.bottom
      const height2 = 600 - margin2.top - margin2.bottom

      const Y_TICKS = 12

      const timeParse = d3.timeParse('%Y-%m')
      const data = d3.map(rawdata, d => ({ ...d, day: timeParse(d.day) }))

      // 比例尺
      // d3.extent() 返回有序数组的最大值和最小值[min,max]
      const xScale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, d => d.day))

      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.quantity)])

      const xScale2 = d3.scaleTime()
        .range([0, width])
        .domain(xScale.domain())

      const yScale2 = d3.scaleLinear()
        .range([height2, 0])
        .domain(yScale.domain())

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y年-%m月'))


      const chart = d3.select(this.$refs.chartRef)
      // mainChart
      const mainChart = chart.append('g')
        .attr('class', 'main-chart')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // x轴
      mainChart.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

      // y轴
      mainChart.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale).ticks(Y_TICKS))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .attr('dy', '-1em')
        .text('顾客人数（人）')





      // 背景线
      mainChart.selectAll('.axis--y g')
        .append('line')
        .attr('class', 'bg-line')
        .attr('x2', width)
        .attr('stroke', 'orange')

      mainChart.select('.bg-line:last-of-type').remove()

      // defs: svg元素，用于预定义
      // clipPath: svg元素，用来裁剪
      mainChart.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', 0) // 用遮罩实现线动画
        .attr('height', height)
        .transition()
        .duration(1000)
        .attr('width', width)




      const areaPath = d3.area()
        .curve(d3.curveMonotoneX) // x轴单调曲线
        .x(d => xScale(d.day))
        .y0(yScale(0))
        .y1(d => yScale(d.quantity))


      mainChart.append('path')
        .attr('class', 'area-path')
        .datum(data)
        .attr('d', areaPath)
        .attr('fill', 'skyblue')
        .attr('clip-path', 'url(#clip)')



      // submain
      const subChart = chart.append('g')
        .attr('transform', `translate(${margin2.left},${margin2.top})`)


      subChart.append('g')
        .attr('transform', `translate(0,${height2})`)
        .call(d3.axisBottom(xScale2).tickFormat(d3.timeFormat('%y年-%m月')))



      subChart.append('path')
        .datum(data)
        .attr('d', d3.area()
          .curve(d3.curveMonotoneX)
          .x(d => xScale2(d.day))
          .y0(yScale2(0))
          .y1(d => yScale2(d.quantity))
        )
        .attr('fill', '#ccc')


      // brush
      // 画刷，刷取操作。一维画刷： brushX， brushY 二维画刷 brush
      // ①定义brush并监听brush事件  ② 添加brush ③ 定义brush事件函数
      const brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on('brush end', brushed)


      function brushed (event) {
        // console.log(event);
        const selection = event.selection || [0, width / 4]
        // xScale.domain(selection.map(xScale2.invert, xScale2))
        xScale.domain(selection.map(x => xScale2.invert(x)))
        mainChart.select('.axis--x').call(xAxis)
        mainChart.select('.area-path').attr('d', areaPath)
      }

      subChart.append('g')
        .attr('class', 'brush')
        .call(brush)
        .call(brush.move, [width / 4, width / 2])


      // zoom缩放、平移
      // ①定义zoom并监听zoom事件 ②添加zoom ③ 定义zoom的行为
      const zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .extent([[0, 0], [width, height]])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', zoomed)

      function zoomed (event) {
        const transform = event.transform
        // 这里使用xScale2 不是说要用subChart的坐标轴的比例尺，而是需要一个完整输入域的比例尺，恰好存在xScale2
        const extent = transform.rescaleX(xScale2).domain()
        // 重设主轴的x轴、输入域、areaPath
        xScale.domain(extent)
        mainChart.select('.axis--x').call(xAxis)
        mainChart.select('.area-path').attr('d', areaPath)
        // 重设子图的brush块位置，大小
        subChart.select('.brush').call(brush.move, extent.map(x => xScale2(x)))

      }

      mainChart.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'rgba(0,0,0,.05)')
        .call(zoom)





    },
  }
}
</script>