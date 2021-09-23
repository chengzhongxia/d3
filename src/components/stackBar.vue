<template>
  <svg ref="chartRef" width="1000" height="500" />
</template>
<script>
import * as d3 from "d3";
const margin = { top: 90, left: 90, bottom: 30, right: 100 }
const width = 1000 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

export default {
  data () {
    return {
      data: [
        { date: '2011', q1: -155, q2: 200, q3: 214, q4: 234 },
        { date: '2012', q1: 185, q2: -210, q3: -244, q4: 254 },
        { date: '2013', q1: 275, q2: 230, q3: -274, q4: -274 },
        { date: '2014', q1: -185, q2: 250, q3: 304, q4: 294 },
        { date: '2015', q1: 95, q2: -270, q3: 334, q4: 314 },
        { date: '2016', q1: 205, q2: 290, q3: 364, q4: -330 }
      ],
      colors: ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      const legends = { q1: '第一季度', q2: '第二季度', q3: '第三季度', q4: '第四季度' }
      const data = this.data
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      const keys = Object.keys(legends)

      const colors = d3.scaleOrdinal().range(this.colors).domain(this.colors.keys())


      // var stack =  d3.stack()
      // stack(data): 返回一个序列数组， 返回的数组由 key访问器决定。每个序列i对应第i个key，每个序列都是一组点数组
      /* 
      var data = [
        {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
        {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
        {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
        {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400}
      ];
      var stack = d3
        .stack()
        .keys(['apples', 'bananas', 'cherries', 'dates'])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
  
      var series = stack(data)
        
      // 返回数组：
      [
        [[   0, 3840], [   0, 1600], [   0,  640], [   0,  320]], // apples： [month1,month2,month3, month4]
        [[3840, 5760], [1600, 3040], [ 640, 1600], [ 320,  800]], // bananas 香蕉的数量在当月苹果的数量上进行叠加
        [[5760, 6720], [3040, 4000], [1600, 2240], [ 800, 1440]], // cherries 
        [[6720, 7120], [4000, 4400], [2240, 2640], [1440, 1840]], // dates
      ]
   */
      const stack = d3.stack() // 创建一个堆叠布局生成器
        .keys(keys) // keys: ['q1','q2', 'q3', 'q4'] 返回的数据，由key 访问器决定 
        .offset(d3.stackOffsetDiverging) // d3.stackOffsetDiverging:正值在 0 之上，负值在 0 之下.

      const series = stack(data)
      console.log(series);

      // const x = d3.scaleBand().range([0, width]).domain(data.map(d => d.date)).padding(0.05)

      // const y = d3.scaleLinear().range([height, 0]).domain([d3.min(data, d => d3.min(keys.map(key => d[key]))), d3.max(data, d => d3.max(Object.values(d).slice(1)))])

      const x = d3
        .scaleBand()
        .rangeRound([0, width])
        .domain(data.map(d => d.date))
        .padding(0.05)

      const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([d3.min(series, s => d3.min(s, d => d[0])), d3.max(series, s => d3.max(s, d => d[1]))])




      g.append('g').attr('class', 'axis axis--x').attr('transform', `translate(0,${y(0)})`).call(d3.axisBottom(x))

      g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y).ticks(null, 's')).append('text').text('营收(万)').attr('fill', '#000').attr('dy', '-1em')


      /* [
        [[-155,0],[0,185],[0,275],[-185,0],[0,95],[0,205]], // q1 ：伪数组 { 0: [-155,0],... 5:[0,205], index:0, key: 'q1', length: 6}
        [[0,200],[-210,0],[275,505],[0,250],[-270,0],[205,495]], // q2
        [[200,414],[-454,-210],[-274,0],[250,554],[95,429],[495,859]], // q3
        [[414,648],[185,439],[-548,-274],[554,848],[429,743],[-330,0]] // q4
      ] */

      g.selectAll('serie')
        .data(series)
        .join('g')
        .attr('class', 'serie')
        .attr('fill', s => colors(s.key))
        .selectAll('rect')
        .data(s => s)
        .join('rect')
        .attr('x', d => x(d.data.date))
        .attr('width', x.bandwidth())
        .attr('y', d => y(0))
        .transition()
        .duration(1000)
        .attr('y', d => y(d[1]))
        .attr('height', d => (y(d[0]) - y(d[1])))










      // legend
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width + 20}, 0)`)
        .selectAll('g')
        .data(keys)
        .join('g')
        .attr('transform', (d, i) => `translate(0,${i * 20})`)

      legend.append('rect').attr('width', 15).attr('height', 15).attr('fill', d => colors(d))
      legend.append('text', 'rect').text(key => legends[key]).attr('font-size', 12).attr('dy', '1em').attr('dx', 20)


    }
  },
};
</script>
