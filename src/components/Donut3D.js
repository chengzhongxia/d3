import * as d3 from 'd3'
const Donut3D = {}

/* 
(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+

rx ry 是椭圆的两个半轴的长度。

x-axis-rotation 是椭圆相对于坐标系的旋转角度，角度数而非弧度数。

large-arc-flag 是标记绘制大弧(1)还是小弧(0)部分。

sweep-flag 是标记向顺时针(1)还是逆时针(0)方向绘制。

x y 是圆弧终点的坐标

*/


function pieTop(d, rx, ry, ir) {
  if (d.endAngle - d.startAngle == 0) return 'M 0 0'
  var sx = rx * Math.cos(d.startAngle),
    sy = ry * Math.sin(d.startAngle),
    ex = rx * Math.cos(d.endAngle),
    ey = ry * Math.sin(d.endAngle)

  var ret = []
  ret.push('M', sx, sy, 
           'A', rx, ry, '0', d.endAngle - d.startAngle > Math.PI ? 1 : 0, '1', ex, ey, 
           'L', ir * ex, ir * ey)
  ret.push('A', ir * rx, ir * ry, '0', d.endAngle - d.startAngle > Math.PI ? 1 : 0, '0', ir * sx, ir * sy, 
           'z')
  return ret.join(' ')
}

function pieOuter(d, rx, ry, h) {
  var startAngle = d.startAngle > Math.PI ? Math.PI : d.startAngle
  var endAngle = d.endAngle > Math.PI ? Math.PI : d.endAngle

  var sx = rx * Math.cos(startAngle),
    sy = ry * Math.sin(startAngle),
    ex = rx * Math.cos(endAngle),
    ey = ry * Math.sin(endAngle)

  var ret = []
  ret.push('M', sx, h + sy, 
           'A', rx, ry, '0 0 1', ex, h + ey, 
           'L', ex, ey, 
           'A', rx, ry, '0 0 0', sx, sy, 
           'z')
  return ret.join(' ')
}

function pieInner(d, rx, ry, h, ir) {
  var startAngle = d.startAngle < Math.PI ? Math.PI : d.startAngle
  var endAngle = d.endAngle < Math.PI ? Math.PI : d.endAngle

  /* 
    ir*rx => 圆弧的x轴半径
    ir*ry => 圆弧的y轴半径

  */

  var sx = ir * rx * Math.cos(startAngle), // start X: 开始坐标的x坐标
    sy = ir * ry * Math.sin(startAngle), // start Y: 开始坐标的y坐标
    ex = ir * rx * Math.cos(endAngle), // end X: 结束坐标的x坐标
    ey = ir * ry * Math.sin(endAngle) // end Y: 结束坐标的y坐标

  var ret = []
  ret.push('M', sx, sy, // 内圆的： 开始坐标 x,y
           'A', ir * rx, ir * ry, '0 0 1', ex, ey, // A rx,ry,旋转角度,小弧，顺时针，圆弧终点坐标
           'L', ex, h + ey, 
           'A', ir * rx, ir * ry, '0 0 0', sx, h + sy, 
           'z')
  return ret.join(' ')
}

function getPercent(d) {
  return d.endAngle - d.startAngle > 0.2 ? Math.round((1000 * (d.endAngle - d.startAngle)) / (Math.PI * 2)) / 10 + '%' : ''
}

Donut3D.transition = function(id, data, rx, ry, h, ir) {
  function arcTweenInner(a) {
    var i = d3.interpolate(this._current, a)
    this._current = i(0)
    return function(t) {
      return pieInner(i(t), rx + 0.5, ry + 0.5, h, ir)
    }
  }
  function arcTweenTop(a) {
    var i = d3.interpolate(this._current, a)
    this._current = i(0)
    return function(t) {
      return pieTop(i(t), rx, ry, ir)
    }
  }
  function arcTweenOuter(a) {
    var i = d3.interpolate(this._current, a)
    this._current = i(0)
    return function(t) {
      return pieOuter(i(t), rx - 0.5, ry - 0.5, h)
    }
  }
  function textTweenX(a) {
    var i = d3.interpolate(this._current, a)
    this._current = i(0)
    return function(t) {
      return 0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle))
    }
  }
  function textTweenY(a) {
    var i = d3.interpolate(this._current, a)
    this._current = i(0)
    return function(t) {
      return 0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle))
    }
  }

  var _data = d3.pie()
    .sort(null)
    .value(function(d) {
      return d.value
    })(data)

  d3.select('#' + id)
    .selectAll('.innerSlice')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenInner)

  d3.select('#' + id)
    .selectAll('.topSlice')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenTop)

  d3.select('#' + id)
    .selectAll('.outerSlice')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenOuter)

  d3.select('#' + id)
    .selectAll('.percent')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('x', textTweenX)
    .attrTween('y', textTweenY)
    .text(getPercent)
}

Donut3D.draw = function(svg, id, data, x /*center x*/, y /*center y*/, rx /*radius x*/, ry /*radius y*/, h /*height*/, ir /*inner radius*/) {
  var _data = d3.pie()
    .sort(null)
    .value(function(d) {
      return d.value
    })(data)

  var slices = svg
    .select('#' + id)
    .append('g')
    .attr('transform', 'translate(' + x + ',' + y + ')')
    .attr('class', 'slices')

  slices
    .selectAll('.innerSlice')
    .data(_data)
    .enter()
    .append('path')
    .attr('class', 'innerSlice')
    .style('fill', function(d) {
      return d3.hsl(d.data.color).darker(0.7)
    })
    .attr('d', function(d) {
      return pieInner(d, rx + 0.5, ry + 0.5, h, ir)
    })
    .each(function(d) {
      this._current = d
    })

  slices
    .selectAll('.topSlice')
    .data(_data)
    .enter()
    .append('path')
    .attr('class', 'topSlice')
    .style('fill', function(d) {
      return d.data.color
    })
    .style('stroke', function(d) {
      return d.data.color
    })
    .attr('d', function(d) {
      return pieTop(d, rx, ry, ir)
    })
    .each(function(d) {
      this._current = d
    })

  slices
    .selectAll('.outerSlice')
    .data(_data)
    .enter()
    .append('path')
    .attr('class', 'outerSlice')
    .style('fill', function(d) {
      return d3.hsl(d.data.color).darker(0.7)
    })
    .attr('d', function(d) {
      return pieOuter(d, rx - 0.5, ry - 0.5, h)
    })
    .each(function(d) {
      this._current = d
    })

  slices
    .selectAll('.percent')
    .data(_data)
    .enter()
    .append('text')
    .attr('class', 'percent')
    .attr('font-size', 10)
    .attr('fill', '#fff')
    .attr('x', function(d) {
      return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle))
    })
    .attr('y', function(d) {
      return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle))
    })
    .text(getPercent)
    .each(function(d) {
      this._current = d
    }) 
} 
export default Donut3D
