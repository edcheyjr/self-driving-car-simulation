class Road {
  constructor(x, width, lineWidth = 5, laneCount = 3) {
    this.x = x
    this.width = width
    this.laneCount = laneCount
    this.lineWidth = lineWidth

    this.left = x - width / 2
    this.right = x + width / 2

    const infinity = 1000000
    this.top = -infinity
    this.bottom = infinity

    // borders
    const topLeft = { x: this.left, y: this.top }
    const topRight = { x: this.right, y: this.top }
    const bottomLeft = { x: this.left, y: this.bottom }
    const bottomRight = { x: this.right, y: this.bottom }
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ]
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount
    return (
      this.left +
      laneWidth / 2 +
      Math.min(this.laneCount - 1, laneIndex) * laneWidth
    )
  }

  draw(ctx) {
    ctx.lineWidth = this.lineWidth
    ctx.strokeStyle = 'white'

    // loop through the number of lanes and draw the lanes
    for (let i = 1; i < this.laneCount; i++) {
      // get the x coordinate of each the lines through linear interpolation
      const x = lerp(this.left, this.right, i / this.laneCount)

      // draw on those points
      ctx.setLineDash([20, 20])
      ctx.beginPath()
      ctx.moveTo(x, this.top)
      ctx.lineTo(x, this.bottom)
      ctx.stroke()
    }

    ctx.setLineDash([])
    this.borders.forEach((border) => {
      ctx.beginPath()
      ctx.moveTo(border[0].x, border[0].y)
      ctx.lineTo(border[1].x, border[1].y)
      ctx.stroke()
    })
  }
}
