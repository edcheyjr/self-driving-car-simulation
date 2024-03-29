class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = []
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      const level = new Level(neuronCounts[i], neuronCounts[i + 1])
      this.levels.push(level)
    }
  }

  static mutate(network, value) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, value)
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            value
          )
          console.log('level.biases[i]', level.weights[i][j])
        }
      }
    })
  }
  static feedFoward(givenInputs, network) {
    let outputs = Level.feedFoward(givenInputs, network.levels[0])
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedFoward(outputs, network.levels[i])
    }
    return outputs
  }
}

/**
 * Defined Level and its methods/functions
 */
class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount)
    this.outputs = new Array(outputCount)
    this.biases = new Array(outputCount)
    this.weights = []
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount) //creating a 2D array
    }
    Level.#randomize(this)
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1 // give a random value btwn -1 and 1
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1 // give a random value btwn -1 and 1
    }
  }

  static feedFoward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]
    }
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i]
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1
      } else {
        level.outputs[i] = 0
      }
    }
    return level.outputs
  }
}
