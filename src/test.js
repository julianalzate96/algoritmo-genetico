const DICTIONARY = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "i",
  "j",
  "l",
  "m",
  "n",
  "o",
  "p",
  "v",
  "z",
  " ",
  "í",
]
const GOAL = "politecnico colombiano jaime isaza cadavid"
const PROBABILIDAD_MUTACION = Math.floor(Math.random() * 5)

let goalArray = GOAL.split("") //Convertimos el string en array
let generation = 0
let bestCromosomas = []
let childs = []
var poblation = []

const getFitness = (cromosoma) => {
  let fitness = 0
  for (let index = 0; index < goalArray.length; index++) {
    if (goalArray[index] === cromosoma[index]) {
      fitness += 1
    }
  }
  return fitness
}

const generatePoblation = (n) => {
  let cromosomas = []
  for (let index = 0; index < n; index++) {
    let cromosoma = []
    for (let index = 0; index < goalArray.length; index++) {
      let random = Math.floor(Math.random() * DICTIONARY.length)
      cromosoma[index] = DICTIONARY[random]
    }
    cromosomas.push(cromosoma)
  }
  return cromosomas
}

// Obtenemos los 2 mejores
const selection_and_cruce = (firstTime) => {
  let pointCruze = 0
  let child1 = []
  let child2 = []

  childs = []

  if (generation === 250 || generation === 500 || generation === 750) {
    console.log("MEJORES CROMOSOMAS EN LA GENERACION: ", generation)
    bestCromosomas.forEach((cromosoma) => {
      console.log("CROMOSOMA PADRE: ", cromosoma.cromosoma.join(""))
      console.log("FITNESS: ", cromosoma.fitness)
      console.log("-")
    })
    console.log("-----------------------")
  }

  poblation.forEach((cromosoma) => {
    let resultFitness = getFitness(cromosoma)

    if (bestCromosomas.length > 1) {
      bestCromosomas.sort((a, b) => {
        return a.fitness - b.fitness
      })
      if (
        resultFitness > bestCromosomas[0].fitness &&
        cromosoma !== bestCromosomas[1].cromosoma
      ) {
        bestCromosomas[0] = { fitness: resultFitness, cromosoma }
      }
    } else {
      if (bestCromosomas.length) {
        if (bestCromosomas[0].cromosoma !== cromosoma) {
          bestCromosomas.push({ cromosoma, fitness: resultFitness })
        }
      } else {
        bestCromosomas.push({ cromosoma, fitness: resultFitness })
      }
    }
  })

  //   if (firstTime || poblation.length > 11) {
  //     console.log("a")
  //     poblation = [...bestCromosomas]
  //   }

  pointCruze = Math.floor(Math.random() * goalArray.length)

  child1 = bestCromosomas[1].cromosoma.slice(
    pointCruze,
    bestCromosomas[1].cromosoma.length
  )
  child1 = [...bestCromosomas[0].cromosoma.slice(0, pointCruze), ...child1]

  child2 = bestCromosomas[0].cromosoma.slice(
    pointCruze,
    bestCromosomas[0].cromosoma.length
  )
  child2 = [...bestCromosomas[1].cromosoma.slice(0, pointCruze), ...child2]

  childs.push(child1)
  childs.push(child2)
}

//Mutacion
const mutation = () => {
  childs.forEach((child) => {
    for (let i = 0; i < PROBABILIDAD_MUTACION; i++) {
      let probMutation = Math.floor(Math.random() * goalArray.length)
      let newValue = Math.floor(Math.random() * DICTIONARY.length)

      child[probMutation] = DICTIONARY[newValue]
    }
  })

  if (generation === 250 || generation === 500 || generation === 750) {
    console.log(
      "HIJOS DE LOS MEJORES CROMOSOMAS EN LA GENERACION: ",
      generation
    )
    childs.forEach((child) => {
      console.log("CROMOSOMA HIJO; ", child.join(""))
      console.log("-")
    })
    console.log("-----------------------")
  }

  poblation = [...childs, ...poblation]
}

// Generamos nuestra poblacion inicial
poblation = generatePoblation(10)

console.log("POBLACION INICIAL: ")
console.log("-----------------------")

poblation.forEach((cromosoma) => {
  console.log(cromosoma.join(""))
  console.log("-")
})

console.log("-----------------------")

while (generation < 2000) {
  selection_and_cruce(generation === 1)
  mutation()
  generation += 1
}

console.log(bestCromosomas[0].cromosoma.join(""))
console.log(bestCromosomas[0].fitness)
