<template>
  <div style="width:1000px;height: 600px;">
    <svg width="1000" height="600" ref="chartRef" style="background:#ccc;"></svg>
  </div>
</template>
<script>
import * as d3 from 'd3'
import Heatmap from 'heatmap.js'
const margin = { top: 60, left: 90, bottom: 30, right: 90 }
const colors = ['#ff9b6a', '#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#f3d64e', '#b8f1cc', '#e7dac9']
export default {
  data () {
    return {
      data: []
    }
  },
  watch: {
    data () {
      this.drawChart()
    }
  },
  async created () {
    try {
      const res = await fetch('http://cdn.a4z.cn/json/china.geojson')
      console.log(await res.clone().json());
      this.data = await res.json()

    } catch {
      console.log('error');
    }
  },
  methods: {
    drawChart () {

      const chart = d3.select(this.$refs.chartRef)
      const map = chart.append('g')
      const z = d3.scaleOrdinal([...d3.schemeCategory10, ...d3.schemeAccent, ...d3.schemePaired]) // 等价： d3.scaleOrdinal().range(d3.schemeCategory10)

      const tip = chart.append('text').style('display', 'none')
      /* 
        ① 定义一个投影
        ② 定义路径
        ③ 画path元素
      */
      // ① 定义投影
      const projection = d3.geoMercator() //球面墨卡托投影: 世界被投射到一个正方形上, 裁剪到大约 ±85° 纬度.
        .center([107, 31]) // 将中心点设置为经度105，纬度38，这里正好是中国地图的中心点。
        .scale(d3.min([1000, 500])) // 投影的比例因子，可以按比例放大投影
        .translate([500, 300]) // 将投影的中心设置为svg的中心

      // ② 创建地理路径生成器， 使用当前设置的投影
      const path = d3.geoPath().projection(projection) // 等价： d3.geoPath(projection)

      // ③ 添加path元素
      map.selectAll('path').data(this.data.features).join('path').attr('d', path).attr('fill', (d, i) => z(i))
        .on('mousemove', debounce(function (e, d) {
          d3.select(this).style('fill', 'yellow')
          tip.style('display', 'block').text(d.properties.name).attr('x', e.layerX + 30).attr('y', e.layerY - 30)
        }, 20))
        .on('mouseout', function (e, d) {
          d3.select(this).style('fill', null)
          tip.style('display', 'none')
        })


      // 根据经纬度进行落点: 经纬度是球面的描述，而我们的地图是二维平面,用前面定义的墨卡托投影方法进行转换：
      // log 经度，lat 纬度  projection([log, lat])
      const places = [{ 'name': '北京', 'log': '116.3', 'lat': '39.9' },
      { 'name': '上海', 'log': '121.4', 'lat': '31.2' },
      { 'name': '深圳', 'log': '113', 'lat': '22' }
      ];

      // const position = chart.append('g')
      // position.selectAll('circle').data(places).enter().append('circle').attr('r', 8).attr('fill', '#000')
      //   .attr('cx', d => projection([d.log, d.lat])[0])
      //   .attr('cy', d => projection([d.log, d.lat])[1])

      const heatmap = Heatmap.create({
        container: this.$refs.chartRef.parentNode,
        maxOpacity: 0.9,
        minOpacity: 0.1,
        blur: 0.9,
        radius: 25,
        gradient: {
          '.1': 'gray',
          '.3': 'blue',
          '.5': 'green',
          '.7': 'yellow',
          '.9': 'red'
        }
      })

      // const points = this.data.features.map((d) => ({
      //   x: Math.round(projection(d.properties.cp)[0]),
      //   y: Math.round(projection(d.properties.cp)[1]),
      //   value: 100 * Math.random()
      // }));
      const points = places.map(p => ({
        x: Math.round(projection([p.log, p.lat])[0]),
        y: Math.round(projection([p.log, p.lat])[1]),
        value: 40 * Math.random() + 60
      }))
      /* 
      [{"x":581,"y":204,"value":93.9157917709391},
       {"x":626,"y":298,"value":82.37819156416252},
       {"x":552,"y":388,"value":99.63642916843799}]
       */
      heatmap.setData({
        max: 100,
        min: 0,
        data: points
      });

      function debounce (fn, delay) {
        let timer = null
        return function () {
          // this: 事件绑定对象。arguments: event、data等
          timer && clearTimeout(timer)
          timer = setTimeout(fn.call(this, ...arguments), delay)

        }
      }

    },

  },
}
</script>
<style>
.heatmap-canvas {
  pointer-events: none;
}
</style>