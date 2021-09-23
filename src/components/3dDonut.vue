<template lang="pug">
.container
  button(@click='changePercent') 改变数据
  svg(
    :viewBox='"0,0," + width + "," + height',
    style='background: #fff',
    ref='chartRef'
  )
  button(@click='change') 改变数据
  svg(:viewBox='"0,0," + width + "," + height', ref='chartRef2')
  //- svg(width='1000', height=500, ref='chartRef')
</template>

<script>
import * as d3 from 'd3'
import Donut3D from './Donut3D'
import PieDonut from './pieDonut'
export default {
  data () {
    return {
      width: 375,
      height: 200,
      data: [
        { label: "Basic", color: "#66848b" },
        { label: "Plus", color: "#DC3912" },
        { label: "Lite", color: "#FF9900" },
        { label: "Elite", color: "#109618" },
        { label: "Delux", color: "#990099" }
      ],
      randomData: [],
      percent: 80,
      count: 16,
      chart: null
    }
  },
  watch: {
    randomData: {
      handler () {

      }
    }
  },

  created () {
    this.randomData = this.data.map(d => ({ label: d.label, value: 1000 * Math.random(), color: d.color }))
  },
  mounted () {
    this.drawChart(this.$refs.chartRef2)
    this.drawDonut(this.$refs.chartRef)
  },
  methods: {
    changePercent () {
      this.percent = Math.round(Math.random() * 100)
      this.chart.changePercent('chart', this.percent)
      console.log( d3.select(this.$refs.chartRef2).select('text'));
      d3.select(this.$refs.chartRef).select('text').text(this.percent+'%')
    },
    drawDonut (ref) {
      const rx = 70, ry = 45
      const svg = d3.select(ref).append('g').attr('transform', `translate(${this.width / 2},${this.height / 2})`)
      const g = svg.append('g').attr('transform', `translate(0,5)`)
      g.append('text').attr('y', -this.height / 2 + 20).attr('text-anchor', 'middle').text(this.percent + '%').attr('fill', '#000').attr('font-size', 16)

      g.append('ellipse').attr('cx', -90).attr('cy', 10).attr('rx', rx / 15).attr('ry', ry / 15).attr('fill', '#ccc')
      g.append('ellipse').attr('cx', -90).attr('cy', 10).attr('rx', rx / 8).attr('ry', ry / 8).attr('fill', 'none').attr('stroke', '#ccc').attr('stroke-width', 1)
      g.append('ellipse').attr('cx', -90).attr('cy', 10).attr('rx', rx / 4).attr('ry', ry / 4).attr('fill', 'none').attr('stroke', '#ccc').attr('stroke-width', 1)
      g.append('ellipse').attr('cx', -90).attr('cy', 10).attr('rx', rx / 1.5).attr('ry', ry / 1.5).attr('fill', 'none').attr('stroke', '#ccc').attr('stroke-width', 1)
      g.append('ellipse').attr('cx', -90).attr('cy', 10).attr('rx', rx * 1.2).attr('ry', ry * 1.2).attr('fill', 'none').attr('stroke', '#ccc').attr('stroke-width', 1)

      const highCount = Math.round(this.percent / 100 * this.count) // 高亮色块个数
      const dataSet = []
      let index = 1;

      while (index <= this.count * 2) {
        dataSet.push({ label: index.toString(), value: 3.125 })
        index++
      }


      this.chart = new PieDonut(svg)

      this.chart.draw('chart', this.percent, { cx: -90, cy: 10 })
      this.chart.draw('chart2', this.percent, { cx: 100, cy: 10 })

    },
    change () {
      this.randomData = this.data.map(d => ({ label: d.label, value: 1000 * Math.random(), color: d.color }))
      Donut3D.transition("salesDonut", this.randomData, this.width / 5, this.height / 5, 15, 0.4);
      Donut3D.transition("quotesDonut", this.randomData, this.width / 5, this.height / 5, 15, 0);
    },
    drawChart (ref) {
      const svg = d3.select(ref)
      svg.append("g").attr("id", "salesDonut");
      svg.append("g").attr("id", "quotesDonut");

      /*   [{ "label": "Basic", "value": 839.4228936034311, "color": "#3366CC" }, 
            { "label": "Plus", "value": 947.3553030954132, "color": "#DC3912" }, 
            { "label": "Lite", "value": 679.102961774622, "color": "#FF9900" }, 
            { "label": "Elite", "value": 129.06950634860604, "color": "#109618" }, 
            { "label": "Delux", "value": 502.7248917064182, "color": "#990099" }] */

      // id, data, x /*center x*/, y /*center y*/, rx /*radius x*/, ry /*radius y*/, h /*height*/, ir /*inner radius*/
      Donut3D.draw(svg, "salesDonut", this.randomData, this.width / 4, this.height / 3, this.width / 5, this.height / 5, 15, .4);
      Donut3D.draw(svg, "quotesDonut", this.randomData, this.width / 4 * 3, this.height / 3, this.width / 5, this.height / 5, 15, 0);

    },
  },
}
</script>
<style scoped>
.container {
  width: 50%;
  height: 50vh;
}
</style>