import * as d3 from 'd3'
export default class {
  chart;
  tip;
  set = { w: 80, h: 50, rx: 4, ry: 4, angle: 6 };
  transform = [0, 0];
  dataSet = [];
  constructor(chart, options) {
    this.tip = chart.selectAll('.tip').data([null]).join('g').attr('class', 'tip')
    this.set = Object.assign(this.set, options)
  }

  show(transform = [0, 0], dataSet) {
    this.dataSet = dataSet || []
    this.transform = transform
    this.tip.attr('transform', `translate(${transform[0]},${transform[1]})`).style('display', 'block')
    this.tip.selectAll('path')
      .data([null])
      .join('path')
      .attr('d', `M0,0
                l${this.set.angle},${-this.set.angle}
                h${this.set.w / 2 - this.set.rx - this.set.angle}
                a${this.set.rx},${this.set.ry},0,0,0,${this.set.rx},${-this.set.ry}
                v${-this.set.h + 2* this.set.ry}
                a${this.set.rx},${this.set.ry},0,0,0,${-this.set.rx},${-this.set.ry}
                h${-this.set.w + 2 * this.set.rx}
                a${this.set.rx},${this.set.ry},0,0,0,${-this.set.rx},${this.set.ry}
                v${this.set.h - 2 * this.set.ry}
                a${this.set.rx},${this.set.ry},0,0,0,${this.set.rx},${this.set.ry}
                h${this.set.w / 2 - this.set.angle - this.set.rx}
                z`)
      .attr('fill', 'rgba(86,2,2,1)')

    this.tip.selectAll('text')
      .data(this.dataSet)
      .join('text')
      .text(d => d)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', '600')
      .attr('font-size', 12)
      .attr('y', (d, i) => (-(i + .8) * 1.5 + 'em'))
  }
  hide() {
    this.tip.style('display', 'none')
  }
}