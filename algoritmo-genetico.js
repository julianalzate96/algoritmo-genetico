/**
 * SE CONTRUYE UN DICCIONARIO DE DATOS CON LOS CARACTERES
 *  QUE TIENE LA CADENA DEFINIDA PARA ASI AGILIZAR LA CONVERGENCIA
 */
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
];

/**
 * LA PROBABILIDAD DE MUTACION LA ESTAMOS UTILIZANDO PARA
 * QUE NOS DE UN VALOR DE 0 A 5 Y SEA LA CANTIDAD DE CARACTERES QUE VAN A MUTAR
 * EN EL ARREGLO
 */
const PROBABILIDAD_MUTACION = Math.floor(Math.random() * 5);

/**
 * SE DEFINE LA CADENA OBJETIVO Y SE TRANSFORMA
 * EN UN ARRAY DE CARACTERES
 * (LA CADENA OBJETIVO SE DEFINE EN MINUSCULA PARA ASI MINIMIZAR EL DICCIONARIO)
 * */
const GOAL = "politecnico colombiano jaime isaza cadavid";
let goalArray = GOAL.split("");

/**
 * SE DEFINEN LAS VARIABLES NECESARIAS PARA EL ALGORITMO
 */
let generation = 0; //GENERACION YA QUE EL ALGORITMO SE VA A BASAR EN GENERACION Y NO EN CONVERGENCIA
let bestCromosomas = []; //ARREGLO CON LOS MEJORES CROMOSOMAS DE LA GENERACION
let childs = []; // HIJOS RESULTANTES DE EL CRUZE Y LA MUTACION
var poblation = []; // POBLACION

/**
 * FUNCION FITNESS ESTA ESTA DEFINIDA PARA CONTAR CUANTOS CARACTERES ESYAN
 * EN LA POSICION CORRECTA DENTRO DEL VECTOR
 * PARA QUE EL CROMOSOMA SEA IGUAL A LA CADENA OBJETIVO TENDRIA QUE TENER
 * UN FITNESS DE 42
 * (EN LAS PRUEBAS LO MAXIMO QUE HEMOS LOGRADO OBTENER CON 2000 GENERACIONES A SIDO UN
 * FITNESS DE 39)
 */
const getFitness = (cromosoma) => {
  let fitness = 0;

  //SE RECORRE LA FUNCION OBJETIVO Y SE VALIDA EN CADA POSICION SY SON IGUALES
  for (let index = 0; index < goalArray.length; index++) {
    if (goalArray[index] === cromosoma[index]) {
      fitness += 1;
    }
  }
  return fitness;
};

/**
 * FUNCION PARA GENERAR LA POBLACION LA CUAL RECIBE COMO PARAMETRO
 * EL TAMAÑO DE LA POBLACION Y SU FUNCIONAMIENTO ES GENERAR UN NUMERO
 * RANDOM DEL 0 AL 13 PARA ASI SACAR UN CARACTER DEL DICCIONARIO Y GENERAR
 * UN ARREGLO DEL TAMAÑO DE LA CADENA OBJETIVO
 */
const generatePoblation = (n) => {
  let cromosomas = [];
  for (let index = 0; index < n; index++) {
    let cromosoma = [];
    for (let index = 0; index < goalArray.length; index++) {
      let random = Math.floor(Math.random() * DICTIONARY.length);
      cromosoma[index] = DICTIONARY[random];
    }
    cromosomas.push(cromosoma);
  }
  return cromosomas;
};

// FUNCION DE SELECCION Y CRUCE
const selection_and_cruce = (firstTime) => {
  let pointCruze = 0;
  let child1 = [];
  let child2 = [];

  // SE LIMPIA EL ARREGLO DE HIJOS
  childs = [];

  /**
   * ESTA VALIDACION ES SOLO PARA MOSTRAR LOS MEJORES CROMOSOMAS EN DEFINIDAS GENERACIONES
   */
  if (generation === 250 || generation === 500 || generation === 750) {
    console.log("MEJORES CROMOSOMAS EN LA GENERACION: ", generation);
    bestCromosomas.forEach((cromosoma) => {
      console.log("CROMOSOMA PADRE: ", cromosoma.cromosoma.join(""));
      console.log("FITNESS: ", cromosoma.fitness);
      console.log("-");
    });
    console.log("-----------------------");
  }

  /**
   * SE RECORRE LA POBLACION Y SE SACAN LOS 2 MEJORES CROMOSOMAS
   */
  poblation.forEach((cromosoma) => {
    let resultFitness = getFitness(cromosoma); //SE OBTIENE EL FITNESS DE EL CROMOSOMA

    if (bestCromosomas.length > 1) {
      //SE VALIDA QUE EL ARRAY DE BESTCROMOSOMAS TENGA ALMENOS 2
      bestCromosomas.sort((a, b) => {
        //SE ORDENA DE MAYOR A MENOR PARA ASI DACILITAR LA VALIDACION
        return a.fitness - b.fitness;
      });

      /**
       * SE VALIDA QUE EL FITNESS SEA MAYOR QUE EL QUE MENOS TIENE EN EL ARREGLO
       * Y QUE EL CROMOSOMA NO SEA IGUAL AL QUE YA ESTA EN EL ARREGLO
       */
      if (
        resultFitness > bestCromosomas[0].fitness &&
        cromosoma !== bestCromosomas[1].cromosoma
      ) {
        bestCromosomas[0] = { fitness: resultFitness, cromosoma };
      }
    } else {
      //EN ESTA VALIDACION NOS ASEGURAMOS DE QUE LOS 2 PRIMEROS CROMOSOMAS NO SEAN IGUALES
      if (bestCromosomas.length) {
        if (bestCromosomas[0].cromosoma !== cromosoma) {
          bestCromosomas.push({ cromosoma, fitness: resultFitness });
        }
      } else {
        bestCromosomas.push({ cromosoma, fitness: resultFitness });
      }
    }
  });

  /**
   * ESTA VALIDACION ERA PARA LIMPIAR LA POBLACION
   * ESTA ES UNA DE LAS COSAS QUE SE PUEDE MEJORAR EN
   * EL ALGORITMO YA QUE LO QUE HACEMOS ES LOS HIJOS QUE GENERAMOS
   *  LOS INSERTAMOS EN LA POBLACION Y DE AHI SACA LOS MEJORES
   */
  //   if (firstTime || poblation.length > 11) {
  //     console.log("a")
  //     poblation = [...bestCromosomas]
  //   }

  /**
   * LA PROBABILIDAD DE CRUZE NOS VA A GENERAR UN VALOR ALEATORIO ENTRE
   * 0 Y EL TAMAÑO DE DE LA CADENA OBJETIVO PARA SI PARTIR EL ARREGLO
   */
  pointCruze = Math.floor(Math.random() * goalArray.length);

  //SE PARTE EL PADRE DESDE EL PUNTO CRUCE HASTA EL FINAL Y SE LE ASIGNA AL HIJO
  child1 = bestCromosomas[1].cromosoma.slice(
    pointCruze,
    bestCromosomas[1].cromosoma.length
  );
  // SE PARTE EL OTRO PADRE DEL PRINCIPIO HASTA EL PUNTO DE CRUCE Y SE CONCATENA CON ELE OTRO
  child1 = [...bestCromosomas[0].cromosoma.slice(0, pointCruze), ...child1];

  //IGUAL PARA GENERAR EL OTRO HIJO
  child2 = bestCromosomas[0].cromosoma.slice(
    pointCruze,
    bestCromosomas[0].cromosoma.length
  );
  child2 = [...bestCromosomas[1].cromosoma.slice(0, pointCruze), ...child2];

  //SE AGREGAN LOS HIJOS AL ARREGLO DE HIJOS
  childs.push(child1);
  childs.push(child2);
};

/**
 * FUNCION DE MUTACION LA CUAL DEPENDIENDO DE LA PROBABILIDAD DE MUTACION VA
 * A CAMBIAR X CARACTERES EN EL ARREGLO Y A SU VEZ VA A GENERAR VALOR ALEATORIO
 * QUE VA A SER EL NUEVO CARACTER
 */
const mutation = () => {
  childs.forEach((child) => {
    for (let i = 0; i < PROBABILIDAD_MUTACION; i++) {
      let probMutation = Math.floor(Math.random() * goalArray.length); //POSICION QUE VA A CAMBIAR
      let newValue = Math.floor(Math.random() * DICTIONARY.length); //VALOR EN EL DICCIONARIO QUE VAMOS A USAR

      child[probMutation] = DICTIONARY[newValue]; //SE MUTA EL HIJO
    }
  });

  // VALIDACION SOLO PARA MOSTRAR LOS HIJOS EN CIERTAS GENERACIONES
  if (generation === 250 || generation === 500 || generation === 750) {
    console.log(
      "HIJOS DE LOS MEJORES CROMOSOMAS EN LA GENERACION: ",
      generation
    );
    childs.forEach((child) => {
      console.log("CROMOSOMA HIJO; ", child.join(""));
      console.log("-");
    });
    console.log("-----------------------");
  }

  /**
   * SE AGREGAN LOS HIJOS A LA POBLACION PARA ASI SER VALIDADOS EN LA SELECCION
   */

  poblation = [...childs, ...poblation];
};

// GENERAMOS LA POBLACION INICIAL
poblation = generatePoblation(10);

console.log("POBLACION INICIAL: ");
console.log("-----------------------");

// MOSTRAMOS LA POBLACION
poblation.forEach((cromosoma) => {
  console.log(cromosoma.join(""));
  console.log("-");
});
console.log("-----------------------");

//WHILE DE GENERACIONES
while (generation < 2000) {
  selection_and_cruce(generation === 1);
  mutation();
  generation += 1;
}

//SE MUESTRA EL CROMOSOMA CON EL MEJOR FITNESS
console.log("MEJOR CROMOSOMA: ", bestCromosomas[0].cromosoma.join(""));
console.log("FITNESS: ", bestCromosomas[0].fitness);
