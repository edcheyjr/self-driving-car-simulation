// generate cars
function generateCar(N) {
  carsArr = []
  for (let i = 1; i <= N; i++) {
    carsArr.push(new Car(road.getLaneCenter(1), 100, 30, 50, undefined, 'AI'))
  }
  return carsArr
}

const carCanvas = document.getElementById('carCanvas')
carCanvas.width = 220
const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 800

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')
// road object
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.86)
// defined a car object
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 3, 'AI')
const N = 100
const cars = generateCar(N)
let bestCar = cars[0]
if (localStorage.getItem('bestBrain')) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.01)
    }
  }
}
// traffic array
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 2, 'DUMMY', 5),
  new Car(road.getLaneCenter(0), -300, 30, 50, 2, 'DUMMY', 5),
  new Car(road.getLaneCenter(2), -800, 30, 50, 2, 'DUMMY', 5),
  new Car(road.getLaneCenter(1), -500, 30, 50, 2, 'DUMMY', 5),
]

// animate function with fps
console.log('start animating')

function animate(time) {
  // time is got from requestAnimationFrame
  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  const bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)))
  carCtx.save()
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic)
  }
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, [bestCar])
  }

  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
  road.draw(carCtx)
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'DarkGreen')
  }

  carCtx.globalAlpha = 0.2
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'DarkBlue')
  }
  carCtx.globalAlpha = 1
  bestCar.draw(carCtx, 'blue', true)

  // networkCtx.lineDashOffset = -time / 100
  Visualizer.drawNetwork(networkCtx, bestCar.brain)
  carCtx.restore()
  requestAnimationFrame(animate)
}
animate()

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
  return alert('saved')
}
function discard() {
  localStorage.removeItem('bestBrain')
  return alert('removed')
}

// TODO:
// implement curves on the road
// think what a best.car i.e weight means
//  best fitness fxn
// fitness fxn that reward for being center of the road or going the futhers
