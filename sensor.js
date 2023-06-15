class Sensor {
  constructor(car, rayCount = 3, rayLength = 60, raySpreadAngle = 5 , MAKE180 = false) {
    this.car = car
    this.rayCount = rayCount
    this.rayLength = rayLength
    this.raySpread = MAKE180 ? (2*Math.PI / raySpreadAngle) : (Math.PI / raySpreadAngle )

    // RAY STORE ARR
    this.rays = []
    this.readings = []
  }

  update(roadBorders, traffic) {
    this.#castRays()
    this.readings = []
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReadings(this.rays[i], roadBorders, traffic))
    }
  }
  #getReadings(ray, roadBorders, traffic) {
    let touches = []
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      )

      if (touch) {
        touches.push(touch)
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon
      for (let j = 0; j < poly.length; j++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        )
        if (touch) {
          touches.push(touch)
        }
      }
    }
    if (touches.length == 0) {
      return null
    } else {
      const offsets = touches.map((e) => e.offset)
      const minOffset = Math.min(...offsets)
      return touches.find((e) => e.offset == minOffset)
    }
  }
  #castRays() {
    this.rays = []
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle

      const start = { x: this.car.x, y: this.car.y }
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }
      this.rays.push([start, end])
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1]
      if (this.readings[i]) {
        end = this.readings[i]
      }
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#ffa5006f'
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'black'
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }
  }
}
