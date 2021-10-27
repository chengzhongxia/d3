<template lang="pug">
.container 
  canvas(width='600', height='400', ref='chartRef')
</template>

<script>
import * as d3 from 'd3'
import { memoryUsage } from 'process'
export default {
  data () {
    return {
      data: [
        { date: '2009', value: 198 },
        { date: '2010', value: 10 },
        { date: '2011', value: 70 },
        { date: '2012', value: 20 },
        { date: '2013', value: 120 },
        { date: '2014', value: 240 },
        { date: '2015', value: 280 },
        { date: '2016', value: 210 }
      ],
      options: {
        margin: 30,
        space: 60,
        barMargin: 10,
        yTicks: 10
      }
    }
  },
  mounted () {
    this.draw()
  },
  methods: {
    draw () {
      const data = this.data.sort((a, b) => a.date - b.date)
      const canvas = this.$refs.chartRef
      let ctx
      if (canvas && canvas.getContext) {
        ctx = canvas.getContext('2d')
      }
      // 运动相关
      let ctr = 1;
      const numctr = 100;
      let rafId

      // 初始化

      // 柱形图的宽高，坐标系原点的位置
      const cWidth = canvas.width - this.options.margin * 2 - this.options.space
      const cHeight = canvas.height - this.options.margin * 2 - this.options.space
      const originX = this.options.margin + this.options.space
      const originY = this.options.margin + cHeight

      // 柱形图信息
      const totalBars = this.data.length
      const bWidth = Math.ceil(cWidth / totalBars - this.options.barMargin)
      // const maxValue = Math.max.apply(Math, this.data.map(d => d.value))
      // const maxValue = Math.max.call(Math, ...this.data.map(d => d.value))
      const maxValue = Math.max.apply(null, this.data.map(d => d.value))

      const mousePosition = {}

      const gradient = ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'green')
      gradient.addColorStop(1, 'rgba(67,203,36,1)')

      drawChart.call(this)

      const _this = this

      canvas.addEventListener('click', function (e) {
        ctr = 1
        drawChart.call(_this)
      })

      canvas.addEventListener('mousemove', function (e) {
        e = e || window.event
        if (e.layerX || e.layerX === 0) {
          mousePosition.x = e.layerX
          mousePosition.y = e.layerY
        } else if (e.offsetX || e.offsetX === 0) {
          mousePosition.x = e.offsetX
          mousePosition.y = e.offsetY
        }
        
          // (function animateLoop () {
          //   ctr = 1
          //   if (ctr < numctr) {
          //     ctr++
          //     ctx.clearRect(0, 0, canvas.width, canvas.height)
          //     rafId = window.requestAnimationFrame(animateLoop.bind(_this), canvas);
          //   } else {
          //     window.cancelAnimationFrame(rafId)
          //   }
          //   // 绘制游标
          //   drawMarkers.call(_this)
          //   // 绘制柱形图
          //   drawBarAnimate.call(_this, true)
          // })()
      })

      function drawChart () {
        if (ctr < numctr) {
          ctr++
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          rafId = window.requestAnimationFrame(drawChart.bind(this), canvas);
        } else {
          window.cancelAnimationFrame(rafId)
        }
        // 绘制游标
        drawMarkers.call(this)
        // 绘制柱形图
        drawBarAnimate.call(this)
      }



      function drawLine (x1, y1, x2, y2) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
      }

      // 绘制游标
      function drawMarkers () {
        //  绘制坐标轴、标签、游标
        ctx.translate(.5, .5) // 当只绘制1像素细线的时候，坐标点需要偏移，这样才能画出1px实线
        ctx.font = '12px'
        ctx.lineWidth = 1
        ctx.strokeStyle = '#000'
        ctx.fillStyle = '#000'

        // x轴、y轴
        drawLine(originX, originY, originX + cWidth, originY)
        drawLine(originX, originY, originX, originY - cHeight)


        ctx.strokeStyle = "#e0e0e0"
        // axis-x
        ctx.textAlign = 'center'
        // canvas写文本：context.fillText(text,x,y,maxWidth); maxWidth：可选。允许的最大文本宽度，以像素计。

        this.data.map(d => d.date).forEach((d, i) => {
          const markerX = originX + (this.options.barMargin) * (i + 1) + bWidth * i + bWidth / 2
          const markerY = originY + 15
          ctx.fillText(d, markerX, markerY, this.options.space)
        })

        // axis-y
        const max = Math.max(...this.data.map(d => d.value))
        const tickValue = parseInt(max / this.options.yTicks)
        const yTickArr = (Array(this.options.yTicks).fill(1)).map((d, i) => i * tickValue)
        yTickArr.forEach((d, i) => {
          const markerX = originX - 15
          const markerY = originY - parseInt(cHeight / this.options.yTicks) * i
          ctx.fillText(d, markerX, markerY, this.options.space)
          // 背景线
          i > 0 && drawLine(originX, markerY, originX + cWidth, markerY)
        })

        // axis-x-title
        ctx.fillText('年份', originX + cWidth / 2, originY + 40)

        // axis-y-title
        ctx.save()
        ctx.rotate(-Math.PI / 2)
        ctx.fillText('产量', - cHeight / 2, 50)
        ctx.restore()

        ctx.translate(-0.5, -0.5);  // 还原位置
      }

      // 绘制柱形图
      function drawBarAnimate (mouseMove) {
        console.log(mouseMove);
        const max = Math.max(...this.data.map(d => d.value))
        this.data.map(d => d.value).forEach((d, i) => {
          const x = originX + (this.options.barMargin) * (i + 1) + + bWidth * i
          const y = originY - max / cHeight * d * ctr / numctr - 1
          const h = max / cHeight * d * ctr / numctr
          drawRect(x, y, bWidth, h, mouseMove)
          ctx.fillText(parseInt(d * ctr / numctr), x + bWidth / 2, y - 10, this.options.space)
        })
      }

      function drawRect (x, y, w, h, mouseMove) {
        ctx.beginPath()
        ctx.rect(x, y, w, h)

        if (mouseMove && ctx.isPointInPath(mousePosition.x, mousePosition.y)) {
          ctx.fillStyle = "green"
        } else {
          ctx.fillStyle = gradient
          ctx.strokeStyle = gradient
        }
        ctx.fill()
        ctx.closePath()
      }
    },






  },
}
</script>