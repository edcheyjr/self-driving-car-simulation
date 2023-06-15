/** 
 * Generate cars
 * @param {number} N  number of ai cars to generate 
 * @returns {Car[]} Car array 
 * */ 

const VISUALIZE = true // SET TO true if you want to visualize the neural network
const BEST_CAR_KEY = "bestBrain"
const TRAFFIC_MAX = 50
const MAX_Y = -5000 
const traffic = []



function generateCar(N) {
  carsArr = []
  for (let i = 1; i <= N; i++) {
    carsArr.push(new Car(road.getLaneCenter(1), 100, 30, 50, undefined, 'AI'))
  }
  return carsArr
}
/**
 * generate cars for traffic
 * @param {*} N number of trial cars
 * @param {*} speed 
 * @param {*} controlType either DUMMY || AI 
 * @param {*} sensors number of sensors
 * @param {*} lane which lane will it be
 * @returns array of the same car
 */
function generateTrafficCar(N ,speed, controlType, sensors,lane){
  const y_POS = Math.random()* MAX_Y + 60 // VALUE 60 AND MAX_Y
  carsArr = []
  for (let i = 1; i <= N; i++) {
    carsArr.push(new Car(road.getLaneCenter(lane), y_POS, 30, 50, speed, controlType, sensors))
  }
  return carsArr
}

/**
 * get the best brain and gives it to some of the traffic for an interesting  movements
 * @param {*} N number of cars to improve with best be careful can affect performance
 * @param {*} speed 
 * @param {*} controlType 
 * @param {*} sensors 
 * @returns 
 */
function getBestBrainAndReinforceTraffic(N ,speed, controlType, sensors, lane){
  const cars = generateTrafficCar(N, speed, controlType, sensors, lane)
  let bestBrain = getBestBrain(BEST_CAR_KEY)
  if (bestBrain && (bestBrain != "undefined" || bestBrain != null)) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(bestBrain)
    if (i != 0) {
      console.log('traffic mutating')
      NeuralNetwork.mutate(cars[i].brain, 0.01)
    }
  }
}
  return cars // car array
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
let bestBrain = getBestBrain(BEST_CAR_KEY)
// console.log('bestBrain', bestBrain)
if (bestBrain && (bestBrain != "undefined" || bestBrain != null)) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(bestBrain)
    if (i != 0) {
      console.log('mutating')
      NeuralNetwork.mutate(cars[i].brain, 0.001)
    }
  }
}
// traffic computation
for(let j = 0; j < TRAFFIC_MAX; j++){
    const NUM_GENERATED_CLONES = 3 // CLONES OF TRAFFIC
    if( j % 2 == 0 && j % 3 !== 0 &&  j% 5 !== 0){
      const  trafficcars = getBestBrainAndReinforceTraffic(1, 2 , "DUMMY", 0, 1)
      traffic.push(...trafficcars)
    }
    else if(j % 3 == 0 && j % 2==0){
      const  trafficcars = getBestBrainAndReinforceTraffic(NUM_GENERATED_CLONES,undefined , "AI", 0, Math.floor(Math.random()*3))
      traffic.push(...trafficcars)
    }
    else if(j % 5 == 0){
      const  trafficcars = getBestBrainAndReinforceTraffic(1, 3 , "DUMMY", 0,3)
      traffic.push(...trafficcars)
    }

    else{
      const trafficcars = getBestBrainAndReinforceTraffic(1,3,"DUMMY",0,2)
    traffic.push(...trafficcars)
  }
}


// animate function with fps
console.log('start animating')

function animate(time) {
  //time is use to find refresh rate
  // time is got from requestAnimationFrame
  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

// Find the best car and save it
  bestCar = cars.find((c) => c.y <= Math.min(...cars.map((c) => c.y)))


  //context saving
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

  // This visualzie the network notice many network  can affect graphic  performance!
  if(VISUALIZE){
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
  }
  carCtx.restore()
  
  requestAnimationFrame(animate)
}
animate()

function save() {
  setBestBrain(BEST_CAR_KEY, bestCar.brain)
  //TODO: add best brain also to json file which can be load if present
  return alert('saved')
}
function discard() {
  removeBestBrain(BEST_CAR_KEY)
  return alert('removed')
}

// TODO:
// implement curves on the road
//  best fitness fxn
// fitness fxn that reward for being center of the road or going the futhers
// delete traffic when its off screen
