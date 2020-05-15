import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-naive-bayes',
  templateUrl: './naive-bayes.page.html',
  styleUrls: ['./naive-bayes.page.scss'],
})
export class NaiveBayesPage implements OnInit {
  settings = null;
  cross = {};
  array = null;
  clase = null;
  matriz = [];
  sensibilidadyExactitud = [];
  constructor(private navParams: NavParams, private modalControler: ModalController) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
  }

  ngOnInit() {
    // inicio del algoritmo
    // si el target es numerico: no se puede hacer zero R, solo para categoricos
    if (this.settings.targetType === 'Numerico') {
      return this.closeModal();
    }
    this.clase = this.settings.target;

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
      this.cross = this.cross_validation(this.settings.validationMethodValue);
    } else if (this.settings.validationMethod === "holdOut") {
      this.cross = this.hold_out(this.settings.validationMethodValue);
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
      console.log("Itineracion: " + i);
      let modelo = [];
      for (; j < iteracion + valor; j++) {
        modelo.push(array.shift());
      }
      j = iteracion + valor;
      valor = j;

      let confusion = this.llenarMatriz(array, modelo);
      resultado["Iteracion" + i] = this.exactitud(confusion);

      for (let k = 0; k < modelo.length; k++) {
        array.push(modelo[k]);
      }
    }

    for (let i = 0; i < k; i++) {
      promedio += resultado["Iteracion" + i]["Exactitud"];
    }
    resultado["Promedio"] = promedio / k;
    console.log(resultado);
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
        array.splice(Math.floor((Math.random() * array.length) + 0), 1);
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
    console.log(resultado);
    return resultado;
  }

  llenarMatriz(array, modelo) {
    let confusion = {};
    let bayes = new Bayes(this.array, this.clase);
    let clase = bayes.dameUnicosAtributos(this.clase);
    clase.forEach(element => {
      confusion[element] = {};
      clase.forEach(valor => {
        confusion[element][valor] = 0;
      });
    });
    console.log(array);
    bayes = new Bayes(array, this.clase);
    modelo.forEach(element => {
      /*console.log("objetivo");
      console.log(element[this.clase]);
      console.log("modelo");
      console.log(bayes.dameMaximo(bayes.dameProbabilidad(element)));*/
      let objeto = bayes.dameMaximo(bayes.dameProbabilidad(element));
      if(objeto != "") {
        confusion[element[this.clase]][objeto]++;
      }
    });
    console.log(confusion);
    this.matriz.push(confusion);
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
    console.log(resultado);
    this.sensibilidadyExactitud.push(resultado);
    return resultado;
  }

  async closeModal() {
    setTimeout(() => {
      this.modalControler.dismiss();
    }, 1000);
  }

}

class Bayes {
  array = null;
  clase = null;
  valoresClase = null;
  valorMaximo = null;
  tablasFrecuencia = null;
  tablasVerosimilitud = null;
  totalClase = null;

    constructor(array, clase) {
        this.array = array;
        this.clase = clase;
        this.valoresClase = this.dameElementosClase();
        this.valorMaximo = this.dameMaximo(this.valoresClase);
        this.tablasFrecuencia = this.dameTablasFrecuencia();
        this.tablasVerosimilitud = this.dameTablasVerosimilitud();
        this.totalClase = 0;
    }

    dameElementosClase() {
        const elementos = {};
        this.array.forEach(valor => {
            if (!elementos[valor[this.clase]]) {
                elementos[valor[this.clase]] = 1;
            } else {
                elementos[valor[this.clase]]++;
            }
        });
        return elementos;
    }

    dameUnicosAtributos(atributo) {
        const elementos = [];
        this.array.forEach(valor => {
            if (!elementos.includes(valor[atributo])) {
                elementos.push(valor[atributo]);
            }
        });
        return elementos;
    }

    dameMaximo(valoresClase) {
        let max = -1;
        let valor = '';
        for (const llave in valoresClase) {
            if (max < valoresClase[llave]) {
                max = valoresClase[llave]
                valor = llave;
            }
        }
        return valor;
    }

    dameIncidencias(atributo, valorAtributo, clase, valorClase) {
        let incidencias = 0;
        this.array.forEach(elemento => {
            if (elemento[atributo] === valorAtributo && elemento[clase] === valorClase) {
                incidencias++;
            }
        });
        return incidencias;
    }

    dameTablasFrecuencia() {
        const tablas = {};
        const llaves = Object.keys(this.array[0]);
        const elementosClase = this.dameUnicosAtributos(this.clase);
        llaves.forEach(elemento => {
            tablas[elemento] = {};
            if (typeof (this.array[0][elemento]) === "number") {
                elementosClase.forEach(elementoClase => {
                    let num = [];
                    this.array.forEach(element => {
                        if (element[this.clase] == elementoClase) {
                            num.push(element[elemento]);
                        }
                    });
                    tablas[elemento][elementoClase] = num;
                });
            }
            if (typeof (this.array[0][elemento]) === "string") {
                const valoresActuales = this.dameUnicosAtributos(elemento);
                valoresActuales.forEach(valor => {
                    tablas[elemento][valor] = {};
                    elementosClase.forEach(elementoClase => {
                        tablas[elemento][valor][elementoClase] = this.dameIncidencias(elemento, valor, this.clase, elementoClase);
                    });
                });
            }
        });
        delete tablas[this.clase];
        return tablas;
    }

    dameMyD(atributo, clase) {
        const numerico = {};
        let media = 0;
        let desviacion = 0;
        let cont = 0;
        this.array.forEach(element => {
            if (element[this.clase] == clase) {
                media += element[atributo];
                cont++;
            }
        });
        media /= cont;
        numerico["media"] = media;
        cont = 0;
        this.array.forEach(element => {
            if (element[this.clase] == clase) {
                desviacion += Math.pow((element[atributo] - media), 2);
                cont++;
            }
        });
        desviacion = Math.sqrt(desviacion / cont);
        if(desviacion == 0){
          desviacion = 1;
        }
        numerico["desviacion"] = desviacion;
        return numerico;
    }


    dameTablasVerosimilitud() {
        const tablas = {};
        const llaves = Object.keys(this.array[0]);
        const elementosClase = this.dameUnicosAtributos(this.clase);
        llaves.forEach(elemento => {
            tablas[elemento] = {};
            if (typeof (this.array[0][elemento]) === "number") {
                elementosClase.forEach(elementoClase => {
                    const valoresNumericos = this.dameMyD(elemento, elementoClase);
                    tablas[elemento][elementoClase] = valoresNumericos;
                });
            } else if (typeof (this.array[0][elemento]) === "string") {
                const valoresActuales = this.dameUnicosAtributos(elemento);
                valoresActuales.forEach(valor => {
                    tablas[elemento][valor] = {};
                    elementosClase.forEach(elementoClase => {
                        if (elemento != this.clase) {
                            tablas[elemento][valor][elementoClase] = (Number(this.dameIncidencias(elemento, valor, this.clase, elementoClase) + 1) / Number(this.dameElementosClase()[elementoClase])).toFixed(4);
                        } else {
                            if (this.dameIncidencias(elemento, valor, this.clase, elementoClase) != 0) {
                                tablas[elemento][elementoClase] = (Number(this.dameIncidencias(elemento, valor, this.clase, elementoClase)) / this.array.length).toFixed(4);
                            }
                        }
                    });
                });
            }
        });
        return tablas;
    }

    dameDensidad(elemento, instancia) {
        let resultado = 0;
        resultado = (1 / ((Math.sqrt(2 * Math.PI)) * elemento["desviacion"])) * Math.pow((Math.E), -(Math.pow((instancia - elemento["media"]), 2) / (2 * Math.pow(elemento["desviacion"], 2))));
        return resultado;
    }

    dameProbabilidad(instancia) {
        const probabilidad = {};
        let resultado = {}
        const verosimilitud = this.tablasVerosimilitud;
        Object.keys(this.valoresClase).forEach(clase => {
            let total = 1;
            Object.keys(verosimilitud).forEach(elemento => {
                if (typeof (instancia[elemento]) == "number") {
                    total *= this.dameDensidad(verosimilitud[elemento][clase], instancia[elemento]);
                } else if (typeof (instancia[elemento]) == "string") {
                  if (elemento != this.clase && instancia[elemento] != "" && elemento == instancia[elemento]) {
                        total *= Number(verosimilitud[elemento][instancia[elemento]][clase]);
                    } else if (elemento == this.clase) {
                        total *= Number(verosimilitud[this.clase][clase]);
                    }
                }
            });
            probabilidad[clase] = total;
        });

        resultado = this.dameNormalizacion(probabilidad);
        return resultado;
    }

    dameNormalizacion(valor) {
        let resultado = {};
        Object.keys(valor).forEach(dato => {
            let suma = 0;
            Object.keys(valor).forEach(elemento => {
                suma += Number(valor[elemento]);
            });
            resultado[dato] = (Number(valor[dato]) / suma).toFixed(4);
        });
        return resultado;
    }
}
