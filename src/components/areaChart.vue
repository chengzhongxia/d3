<template>
  <div>
    <svg ref="chartRef">
      <defs>
        <!-- 
        垂直渐变：x1 == x2, y1 !== y2 
        水平渐变：x1 !== x2, y1 == y2 
        角形渐变：x1 !== x2, y1 != y2 
       -->
        <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
          <!-- 渐变的颜色范围可由两种或多种颜色组成。每种颜色通过一个 <stop> 标签来规定。 -->
          <stop offset="0%" style="stop-color:#dee7f3;stop-opacity:0.7;"></stop>
          <stop offset="20%" style="stop-color:#c9ddf7;stop-opacity:0.7;"></stop>
          <stop offset="50%" style="stop-color:#88b9f8;stop-opacity:0.7;"></stop>
          <stop offset="70%" style="stop-color:#5ea2fc;stop-opacity:0.7;"></stop>
          <stop offset="100%" style="stop-color:#3488f7;stop-opacity:0.7;"></stop>
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'areaChart',
  props: {
    msg: String
  },
  data () {
    return {
      rawData: [{ day: '2015-01', quantity: 1240 },
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
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const containerWidth = 1000, containerHeight = 550
      const margin = { top: 80, left: 70, bottom: 170, right: 30 }
      const margin2 = { top: 420, left: 70, bottom: 30, right: 30 }
      const width = containerWidth - margin.left - margin.right // 900
      const height = containerHeight - margin.top - margin.bottom // 300
      const height2 = containerHeight - margin2.top - margin2.bottom // 100
      const Y_TICKS = 12

      // d3.timeParse(format)(arg)将format格式的arg转为Date格式的数据
      const timeParse = d3.timeParse('%Y-%m')
      const data = this.rawData.map(d => ({ ...d, day: timeParse(d.day) }))

      // svg => mainChart + subChart + brush + zoom + clipPath
      // => mainChart => xAxis + yAxis (axis + bg-line) + mainArea + areaPath上的点坐标
      // => subChart => xAxis + yScale + subArea
      // brush: 画刷： 定义画刷、添加画刷+事件、定义画刷行为
      // zoom: 缩放： 定义缩放、添加缩放+事件、定义缩放行为

      // 定义svg，并设置width、height
      const chart = d3.select(this.$refs.chartRef)
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .style('border', '1px solid #ccc')

      // 比例尺
      // x轴是时间轴
      // time比例尺是线型比例尺lianear的一个变种，输入域强制变成了dates，而不是number， 并且invert返回date
      // scale.inver()反转方法在交互时很有用，可以确定鼠标位置与时间之间的对应关系。
      // 比如：
      /*var x = d3.scaleTime().range(0,900).domain([new Date('2020-1-1'), new Date('2021-12-30')])
        x(new Date('2020-12-1'))  => 400
        x.invert(400) => Sat Jan 01 2020 05:00:00 GMT-0800 (PST)
      */
      // d3.extent()使用自然排序，返回有序数组的最小值、最大值。 如果数组为空, 则返回 [undefined, undefined]。 

      const xScale = d3.scaleTime()
        .rangeRound([0, width])
        .domain(d3.extent(data, d => d.day))

      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.quantity)])

      const xScale2 = d3.scaleTime()
        .range([0, width])
        .domain(xScale.domain()) // subChart的比例尺的输入域，去mainChart的比例尺的输入域

      const yScale2 = d3.scaleLinear()
        .range([height2, 0])
        .domain(yScale.domain())

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y年-%m月'))
      // const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale).ticks(Y_TICKS) // linear的axis.ticks(count, format) =>count分段count段，.ticks(10,"%")

      // <clipPath>: 定义一条剪切路径可作为其他元素的clip-path的属性。
      // clipPath 限制了图形的可见范围，如果该图形超出了clipPath的范围，超出部分将不被绘制
      // <defs> 元素，预定义以后需要重复使用的元素。将以后需要使用的元素定义在defs元素里，被defs包裹的元素不会直接呈现出来，需要<use>来呈现出来
      /*
  <defs>
    <linearGradient id="Gradient01">
      <stop offset="20%" stop-color="#39F" />
      <stop offset="90%" stop-color="#F3F" />
    </linearGradient>
  </defs>

  <rect x="10" y="10" width="60" height="10" fill="url(#Gradient01)"  />
 */

      chart.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('height', height)
        .attr('width', 0) // ？用遮罩实现线动画
        .transition()
        .duration(1000)
        .attr('width', width)


      // 主图mainChart的最外包层在总图上的相对位置
      const mainChart = chart.append('g')
        .attr('class', 'main-chart')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // 添加主图坐标轴
      mainChart.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

      mainChart.append('g')
        .attr('class', 'axis axis--y')
        .call(yAxis)
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-1em')
        .attr('fill', '#000')
        .text('顾客人数 (人)')

      // 画背景线
      // 绘制完坐标轴的时候 会绘制成这样的元素： 
      /*     `<g class="axis axis--y"> // 这边的类名axis axis--y 是attr设置的
              <path class="domain"/> //  这边的类名 domain 是自动生成的
              <g class="tick" transform="translate(0,390)">  // 这里的类型tick也是自动生成的。
                <line x2="-2"/>
                <text x2="-9"> 0 </text>  
              </g>
      
              ...
      
              <g class="tick" transform="translate(0,0)"> 
                <line x2="-2"/>
                <text x2="-9"> 0 </text>  
              </g>
            </g> ` */

      //  绘制背景线
      // <line> x1: 在x轴定义线条的开始； x2: 在x轴定义线条的结束； y1: 在y轴定义线条的开始; y2: 在y轴定义线条的结束 
      // ① 在y轴自动生成的tick类型的g元素下append一个line元素
      mainChart.selectAll('.axis--y .tick')
        .append('line')
        .attr('class', 'bg-line')
        .attr('x2', width)
        .attr('stroke', 'orange')
        .attr('shape-rendering', 'crispEdges') // 浏览器渲染该元素时，会根据shape-randering的值进行权衡，到底是注重精度、速度还是锐度。auto: 让浏览器自动权衡渲染速度、平滑度、精确度。默认是倾向于精确度而非平滑度和速度。 optimizeSpeed:偏向渲染速度，浏览器会关闭反锯齿模式。（速度）crispEdges:偏向更加清晰锐利的边缘的渲染。浏览器在渲染的时候会关闭反锯齿模式，且会让线条的位置和宽度和显示器边缘对齐。（锐度）geometricPrecision:偏向渲染平滑的曲线。（平滑）
      mainChart.select('.axis--y .bg-line:last-of-type').remove() // 删掉最后一根线，这个线遮住了x轴 


      /*
      const stepArray = d3.ticks(0, d3.max(data, d=>d.quantity),Y_TICKS)
      mainChart.append('g')
        .attr('class','bg-lines')
        .selectAll('line')
        .data(stepArray)
        .join('line')
        .attr('x2', width)
        .attr('y1',(d,i) => yScale(stepArray[i]))
        .attr('y2',(d,i) => yScale(stepArray[i]))
        .attr('stroke','orange')
        .attr('shape-rendering', 'crispEdges')
      mainChart.select('.bg-lines line:first-of-type').remove()
      */

      // ① 绘制面积曲线；② 添加曲线
      // 绘制面积曲线
      // area()构建一个区域生成器
      // area.curve()画一条曲线
      // d3.curveMonotoneX 沿x轴单调性的曲线
      // 一个面积曲线，由一个X，两个Y组成。X就是x轴上的值，y0： yScale(0), y1随着具体的数组变动
      const areaPath = d3.area()
        .curve(d3.curveMonotoneX) // 产生一条在x轴单调的曲线
        .x(d => xScale(d.day))
        .y0(yScale(0))
        .y1(d => yScale(d.quantity))

      mainChart.append('path')
        .datum(data)
        .attr('class', 'area-path')
        .attr('d', areaPath)
        .attr('clip-path', 'url(#clip)') // 超出裁剪区域的部分不再绘制
        .attr('fill', 'url(#linear)')





      // 子图subChart的最外包层在总图上的相对位置
      const subChart = chart.append('g')
        .attr('class', 'sub-chart')
        .attr('width', width)
        .attr('height', height2)
        .attr('transform', `translate(${margin2.left},${margin2.top})`)

      // 添加子图坐标轴
      subChart.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height2})`)
        .call(xAxis)

      // ① 定义面积曲线路径 ② 添加面积曲线
      const subAreaPath = d3.area()
        .curve(d3.curveMonotoneX)
        .x(d => xScale2(d.day))
        .y0(yScale2(0))
        .y1(d => yScale2(d.quantity))

      subChart.append('path')
        .datum(data)
        .attr('d', subAreaPath)
        .attr('fill', '#eee')





      // brush 画刷: 刷取操作，经常用来，选取一些离散元素，或用户感兴趣的部分进行放大操作
      // brush() 二维刷取操作
      // brushX() 一维x方向的刷取交互
      // brushY() 一维Y方向的刷取交互

      // ① 定义刷取brush,并监听brush事件 ② 添加刷取 ③ 定义刷取的行为
      const brush = d3.brushX()
        .extent([[0, 0], [width, height2]]) // 刷取作用的区间：整张图 brush.extent([k0,k1]) 
        .on('brush end', brushEvent => { brushed(brushEvent) }) // 监听brush事件

      subChart.append('g')
        .attr('class', 'brush')
        .call(brush)
        .call(brush.move, [width * 2 / 3, width]) // 初始化brushX的位置，及长度





      // zoom缩放：
      // ① 定义缩放zoom，并监听zoom事件； ② 添加缩放； ③ 定义缩放行为
      // 定义缩放zoom： 
      // ① d3.zoom()构建一个缩放zoom；
      // ② zoom.scaleExtent(extent)设置缩放的程度、极限,定义缩放的程度[k0,k1],缩小到k0倍，放大到k1倍
      // ③ zoom.extent(extent) 缩放区间，缩放行为作用的区间点。区间范围内的点参与缩放。[[0,0],[width,height]]
      // ④ zoom.translateExtent(extent)  d3.zoom()是通过transform-translate来实现的。 规定translate的范围

      const zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on('zoom', zoomd)
        .on('zoom', function (zoomEvent) {
          // zoomEvent.transform:{ k: 2, x:-454, 7:-170} ==> transfrom="translate(-454,-170) scale(2)"
          zoomd(zoomEvent)
        })


      chart.append('rect')
        .attr('class', 'zoom')
        .attr('width', width)
        .attr('height', height)
        .attr('cursor', 'move')
        .attr('pointer-events', 'all')
        .attr('fill', 'rgba(0,0,0,0.04)')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom)




      function brushed (brushEvent) {
        if (brushEvent.type === 'zoom') return
        const selection = brushEvent.selection || xScale2.range()// [199,420] brushX的位置，[x1,x2]
        // [199,420].map())
        // x.invert(199) ==> date1

        // mapF ===> mapF(1) => 00001
        // const mapF = d => '0000' + d 
        // console.log([199,420].map(mapF));

        xScale.domain(selection.map(xScale2.invert, xScale2)) // 重设主图的输入域： 子图brush刷取的范围，通过invert，将selection中值（鼠标的点）传入，反转得到输入域
        mainChart.select('.area-path').attr('d', areaPath)  // 输入域改变了，主图的面积路径也会随着改变
        mainChart.select('.axis--x').call(xAxis) // 主图的坐标轴也要随着改变
        // chart.select('.zoom').call(d3.zoomTransform, (d3.zoomIdentity.scale(width / (selection[1] - selection[0]))).translate(-selection[0], 0))
      }

      function zoomd (event) {
        if (event.type === 'brush') return
        const transform = event.transform
        // {k: 1.244874235382177,x: -71.47793853913629,y: -53.87789982214491}
        // 重设主图的输入域、坐标轴
        // selection.map(xScale2.invert, xScale2)
        // transform.rescaleX(xScale2).domain()
        // transform.rescaleX(xScale2) ==> 得到一个新的比例尺scale，这个scale比例尺的输入域是：缩放过后的可见比例尺

        xScale.domain(transform.rescaleX(xScale2).domain())
        mainChart.select('.area-path').attr('d', areaPath)
        mainChart.select('.axis--x').call(xAxis)
        // console.log(xScale.range().map(transform.invertX, transform));
        // subChart.select('.brush').call(brush.move, xScale.range().map(transform.invertX, transform))
        // console.log(xScale.domain().map(xScale2));
        subChart.select('.brush').call(brush.move, xScale.domain().map(xScale2))

      }


    }
  },
}
</script>

