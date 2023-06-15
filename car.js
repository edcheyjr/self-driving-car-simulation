class Car {
  constructor(
    x,
    y,
    width,
    height,
    maxSpeed = 4,
    controlType,
    numberOfSensors = 30,
  ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = 0
    this.maxSpeed = maxSpeed
    this.angle = 0
    this.friction = 0.05
    this.acceleration = 0.2
    this.polygon = []
    this.damaged = false
    this.controlType = controlType

    this.useBrain = controlType = 'AI'

    // car sensors
    if (this.controlType != 'DUMMY') {
      this.sensor = new Sensor(this, numberOfSensors, 150, 2)
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
    }
    //car controls
    this.controls = new Controls(this.controlType)
  }
  draw(ctx, color = '#000', isTrue) {
    if (this.damaged) {
      ctx.fillStyle = 'Gray'
    } else {
      ctx.fillStyle = color
    }
    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }
    ctx.fill()
    if ((this.controlType != 'DUMMY', isTrue)) {
      this.sensor.draw(ctx)
    }
  }
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move()
      this.polygon = this.#createPolygon()
      this.damaged = this.#assessDamage(roadBorders, traffic)
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic)
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      )
      const output = NeuralNetwork.feedFoward(offsets, this.brain)

      if (this.useBrain) {
        this.controls.forward = output[0]
        this.controls.left = output[1]
        this.controls.right = output[2]
        this.controls.reverse = output[3]
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true
      }
    }
    return false
  }
  #createPolygon() {
    const points = []
    const rad = Math.hypot(this.width, this.height) / 2
    const alpha = Math.atan2(this.width, this.height)
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    })
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    })
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    })
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    })
    return points
  }

  #move() {
    // accelerating
    if (this.controls.forward) {
      this.speed += this.acceleration
    }
    //deccelerating and reversing
    if (this.controls.reverse) {
      this.speed -= this.acceleration
    }

    // caping speed to max speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed
    }
    // for reverse halve the speed
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2
    }
    // apply friction
    if (this.speed > 0) {
      this.speed -= this.friction
    }
    if (this.speed < 0) {
      this.speed += this.friction
    }
    // stop friction from moving th car in any direction once stopped
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0
    }
    if (this.speed != 0) {
      // flip the angle on reverse
      const flip = this.speed > 0 ? 1 : -1
      // right and left movements
      if (this.controls.right) {
        this.angle -= 0.03 * flip
      }
      if (this.controls.left) {
        this.angle += 0.03 * flip
      }
    }
    // make the car move in the x or y direction depending on the angle
    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }
}
