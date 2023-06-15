/**
 * interpolation fxn
 * @param {*} A start position
 * @param {*} B last position
 * @param {*} t percentage difference between the positions
 * @returns {int} position btwn postions A and B
 */
function lerp(A, B, t) {
  return A + (B - A) * t
}

/**
 * intersection fxn
 * @param {*} A start.x
 * @param {*} B start.y
 * @param {*} C end.x
 * @param {*} D end.y
 * @returns {object | null} with x,y positions from the interection of the object against the sensors and the offset
 */
function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y)

  if (bottom != 0) {
    const t = tTop / bottom
    const u = uTop / bottom
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      }
    }
  }
  return null
}
/**
 * Test for intersection
 * @param {array} poly1 polygon one
 * @param {array} poly2 polygon two
 * @returns {bool} true | false depending if whether the two polygon intersect
 */
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      )
      if (touch) {
        return true
      }
    }
  }
  return false
}
/**
 *
 * @param {int} value
 * @returns {string}rgba value of a color
 */
function getRGBA(value) {
  const alpha = Math.abs(value)
  const R = value < 0 ? 0 : 255
  const G = R
  const B = value > 0 ? 0 : 255
  return 'rgba(' + R + ',' + G + ',' + B + ',' + alpha + ')'
}


/**
 *  get localstorage
 *  @param {string} key  this is use as the key or the identifier for the data
 *  @returns {any} data stored
 */

function getBestBrain(key){
  try{
   let bestBrain = window.localStorage.getItem(key)
   console.log('bestBrain', bestBrain)
   if(bestBrain){
    return bestBrain
   }
   else{
    throw Error("no brain currently, Try again")
   }
  }catch(err){
    console.error(`The was an error, Error:-${err}`)
    console.warn(`Suggested fix start and save for it to register`)
  }
  // by default return null
  return null
}

/**
 *  set any data for bestbrain  in the localstorage
 * @param {string} key this is use as the key or the id for the data
 * @param {any} data the data to be stored
 */
function setBestBrain(key, data){
  try {
    localStorage.setItem(key, JSON.stringify(data))
    console.log(`successfully set ${key} with value ${data}`) 
  } catch (error) {
    console.error(`The was an error, Error:-${err}`)
  }
}

/**
 * REMOVE BESTBRAIN
 *
 */

function removeBestBrain(key){
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`The was an error, Error:-${err}`)
  }
}

function addBestBrainJson(brain){
  //create a empty json file at root address
  // write on the file
}

function getBestBrainJson(){
  return "./bestBrain.json"
}