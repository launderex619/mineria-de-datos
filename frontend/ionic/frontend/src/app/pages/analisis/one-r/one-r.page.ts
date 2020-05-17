import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-one-r',
  templateUrl: './one-r.page.html',
  styleUrls: ['./one-r.page.scss'],
})
export class OneRPage implements OnInit {
  settings = null;
  one_r = {};
  array = null;
  clase = null;
  matriz = [];
  sensibilidadyExactitud = [];
  constructor(private navParams: NavParams, private modalControler: ModalController) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings.settings);
  }

  ngOnInit() {
    if (this.settings.targetType === 'Numerico') {
      return this.closeModal();
    }
    delete this.settings.settings['sl_no'];
    let tipo = Object.keys(this.settings.settings);
    tipo.forEach(tipoDato => {
      if (this.settings.settings[tipoDato] === 'Numerico') {
       return  this.closeModal(); 
      }
    });

    this.clase =  this.settings.target;

    let array = JSON.parse(JSON.stringify(this.settings.dataset));
    let llaves = Object.keys(array[0]);
    array.forEach(element => {
      delete element["_id"];
      delete element["sl_no"];
      llaves.forEach(llave => {
        if (!isNaN(Number(element[llave]))) {
          element[llave] = Number(element[llave]);
        }
      });
    });
    this.array = array;
    if (this.settings.validationMethod === "kFoldCrossValidation") {
      this.one_r = this.cross_validation(this.settings.validationMethodValue);
    } else if (this.settings.validationMethod === "holdOut") {
      this.one_r = this.hold_out(this.settings.validationMethodValue);
    }

  }

  cross_validation(value) {
    let array = JSON.parse(JSON.stringify(this.array));
    let k = value;
    let iteracion = Math.round(this.array.length / k);
    let j = 0;
    let valor = this.array.length - (iteracion * k);
    let resultado = {};
    let promedio = 0;

    for (let i = 0; i < k; i++) {
      //console.log("Itineracion: " + i);
      let modelo = [];
      for (; j < iteracion + valor; j++) {
        modelo.push(array.shift());
      }
      j = iteracion + valor;
      valor = j;

      let confusion = this.llenarMatriz(array, modelo);
      resultado["M" + i] = this.exactitud(confusion);

      for (let k = 0; k < modelo.length; k++) {
        array.push(modelo[k]);
      }
    }

    for (let i = 0; i < k; i++) {
      promedio += resultado["M" + i]["Exactitud"];
    }
    resultado["Promedio"] = promedio / k;
    return resultado;
  }

  llenarMatriz(array, modelo) {
    let confusion = {};
    let one = new One_R(this.array, this.clase);
    let clase = one.dameElementosUnicosAtributo(this.clase);
    clase.forEach(element => {
      confusion[element] = {};
      clase.forEach(valor => {
        confusion[element][valor] = 0;
      });
    });
    one = new One_R(array, this.clase);
    let objeto = one.dameAtributoMenorError();
    let llave = Object.keys(objeto);
    let atributo = llave.shift();
    modelo.forEach(element => {
      confusion[element[this.clase]][objeto[atributo][element[atributo]]["elegido"]]++;
    });
    console.log(confusion);
    return confusion;
  }

  exactitud(matriz) {
    let resultado = {};
    let exactitud = 0;
    let sumaexact = 0;
    const llaves = Object.keys(matriz);
    let i = 0;
    llaves.forEach(element => {
      let sensibilidad = 0;
      let suma = 0;
      Object.keys(matriz[element]).forEach(valor => {
        if (element == valor) {
          sensibilidad = matriz[element][valor];
          exactitud += matriz[element][valor];
        }
        sumaexact += matriz[element][valor];
        suma += matriz[element][valor];
      });
      sensibilidad /= suma;
      i++;
      resultado["C" + i] = sensibilidad;
    });
    exactitud /= sumaexact;
    resultado["Exactitud"] = exactitud;
    //console.log(resultado);
    return resultado;
  }

  hold_out(value) {
    let array = JSON.parse(JSON.stringify(this.array));
    let porsentaje = value / 100;
    let iteracion = Math.round(this.array.length * porsentaje);
    let resultado = {};
    let promedio = 0;
    for (let i = 0; i < 10; i++) {
      let modelo = [];

      for (let j = 0; j < iteracion; j++) {
        modelo.push(array[Math.floor((Math.random() * array.length) + 0)]);
        array.splice(Math.floor((Math.random() * array.length) + 0), 1)
      }

      let confusion = this.llenarMatriz(modelo, array);
      resultado["M" + i] = this.exactitud(confusion);

      for (let k = 0; k < modelo.length; k++) {
        array.push(modelo[k]);
      }
    }
    for (let i = 0; i < 10; i++) {
      promedio += resultado["M" + i]["Exactitud"];
    }
    resultado["Promedio"] = promedio / 10;
    //console.log(resultado);
    return resultado;
  }



  async closeModal() {
    setTimeout(() => {
      this.modalControler.dismiss();
    }, 1000);
  }

}

class One_R {
  arreglo = null;
  clase = null;
  tablasFrecuencia = null;
  atributoMenorError = null;
  reglas = null;
  /**
   * @param {String} arreglo de objetos (informacion contenida)
   * @param {String} clase target, sobre el que se hara el analisis
   */
  constructor(arreglo, clase) {
    this.arreglo = arreglo;
    this.clase = clase;
    this.tablasFrecuencia = this.dameTablasFrecuencia();
    this.atributoMenorError = {};
    this.reglas = this.dameReglas();
  }

  /**
   * @param {String} atributo a obtener los elementos unicos
   * @returns {Array} regresa una lista de todos los valores de dicho atributo sin repetir
   */
  dameElementosUnicosAtributo(atributo) {
    const elementos = [];
    this.arreglo.forEach(valor => {
      if (!elementos.includes(valor[atributo])) {
        elementos.push(valor[atributo]);
      }
    });
    return elementos;
  }

  /**
   * @param {String} atributo a iterar
   * @param {String} el valor del atributo a ser comparado
   * @param {String} el atributo target
   * @param {String} el valor del target a ser comparado
   * @returns {Number} regresa el numero de incidencias de este par en el arreglo de informacion
   */
  dameIncidencias(atributo, valorAtributo, clase, valorClase) {
    let incidencias = 0;
    this.arreglo.forEach(elemento => {
      if (elemento[atributo] === valorAtributo && elemento[clase] === valorClase) {
        incidencias++;
      }
    });
    return incidencias;
  }

  /**
   * @returns {Object} Regresa un objeto que representa las tablas de frecuencia, dado por el formato:
   *  objeto -> atributo -> valoresAtributoSinRepetir -> elementoClaseMasRepetido
   */
  dameTablasFrecuencia() {
    // declaracion de variables
    const tablas = {};
    const llaves = Object.keys(this.arreglo[0]);
    const elementosClase = this.dameElementosUnicosAtributo(this.clase);
    // inicializo la tabla de frecuencias
    llaves.forEach(elemento => {
      const valoresActuales = this.dameElementosUnicosAtributo(elemento);
      tablas[elemento] = {};
      valoresActuales.forEach(valor => {
        tablas[elemento][valor] = {};
        elementosClase.forEach(elementoClase => {
          tablas[elemento][valor][elementoClase] =
            this.dameIncidencias(elemento, valor, this.clase, elementoClase);
        });
      });
    });
    delete tablas[this.clase];
    return tablas;
  }
  /**
   * @returns {Object} Regresa un objeto que representa las reglas:
   *  objeto -> atributo -> valoresAtributoSinRepetir -> elementoClaseMasRepetido
   */
  dameReglas() {
    const reglas = { ...this.tablasFrecuencia };
    let errorTotalMenor = Number.MAX_VALUE;
    let atributoMenorLocal = '';
    Object.keys(reglas).forEach(atributo => {
      let errorTotal = 0;
      Object.keys(reglas[atributo]).forEach(elementoAtributo => {
        let mayor = -1;
        let totales = 0;
        let elementoClaseMayor = '';
        Object.keys(reglas[atributo][elementoAtributo]).forEach(elementoClase => {
          totales += reglas[atributo][elementoAtributo][elementoClase];
          if (mayor < reglas[atributo][elementoAtributo][elementoClase]) {
            mayor = reglas[atributo][elementoAtributo][elementoClase];
            elementoClaseMayor = elementoClase;
          }
        })
        reglas[atributo][elementoAtributo] = {
          elegido: elementoClaseMayor,
          incidencias: mayor,
          errores: `${totales - mayor}/${totales}`
        }
        errorTotal += totales - mayor;
      })
      reglas[atributo].errorTotal = `${errorTotal}/${this.arreglo.length}`;
      if (errorTotalMenor > errorTotal) {
        errorTotalMenor = errorTotal;
        atributoMenorLocal = atributo;
      }
    })
    this.atributoMenorError[atributoMenorLocal] = reglas[atributoMenorLocal];
    return reglas;
  }

  /**
   * @returns {Object} Regresa un objeto que representa las tablas de frecuencia, dado por el formato:
   *  objeto -> atributo -> valoresAtributoSinRepetir -> elementoClaseMasRepetido
   */
  dameTablaFrecuencia() {
    return this.tablasFrecuencia;
  }

  /**
   * @returns {Object} Regresa un objeto que representa la mejor regla (la de menor error):
   *  objeto -> atributo -> valoresAtributoSinRepetir -> elementoClaseMasRepetido
   */
  dameAtributoMenorError() {
    return this.atributoMenorError;
  }
}
