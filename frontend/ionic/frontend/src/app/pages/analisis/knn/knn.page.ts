import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-knn',
  templateUrl: './knn.page.html',
  styleUrls: ['./knn.page.scss'],
})
export class KnnPage implements OnInit {
  settings = null;
  array = null;
  clase = null;
  matriz = [];
  sensibilidadyExactitud = [];
  cross = null;
  tipo = null;

  constructor(private navParams: NavParams, private modalControler: ModalController) { 
    this.settings = this.navParams.get('settings');
  }

  ngOnInit() {
    this.clase = this.settings.target;
    this.tipo = this.settings.targetType;
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
      this.cross = this.cross_validation(this.settings.validationMethodValue, this.settings.targetType);
    } else if (this.settings.validationMethod === "holdOut") {
      this.cross = this.hold_out(this.settings.validationMethodValue, this.settings.targetType);
    }

  }

  cross_validation(value, tipoDato) {
    let array = JSON.parse(JSON.stringify(this.array));
    let k = value;
    let iteracion = Math.round(this.array.length / k);
    let j = 0;
    let valor = this.array.length - (iteracion * k);
    let resultado = {};
    let promedio = 0;

    for (let i = 0; i < k; i++) {
      let modelo = [];
      for (; j < iteracion + valor; j++) {
        modelo.push(array.shift());
      }
      j = iteracion + valor;
      valor = j;

      if (tipoDato === "Numerico") {
        let confusion = this.errorCuadratico(array, modelo);
        resultado["M" + i] = confusion;
      } else if (tipoDato === "Categorico") {
        let confusion = this.llenarMatriz(array, modelo);
        resultado["M" + i] = this.exactitud(confusion); 
      }

      for (let k = 0; k < modelo.length; k++) {
        array.push(modelo[k]);
      }
    }

    for (let i = 0; i < k; i++) {
      if (tipoDato === "Numerico") {
        promedio += resultado["M" + i]; 
      } else if (tipoDato === "Categorico") {
        promedio += resultado["M" + i]["Exactitud"];
      }
    }
    resultado["Promedio"] = promedio / k;
    console.log(resultado);
    return resultado;
  }

  hold_out(value, tipoDato) {
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

      if (tipoDato === "Numerico") {
        let confusion = this.errorCuadratico(array, modelo);
        resultado["M" + i] = confusion;
      } else if (tipoDato === "Categorico") {
        let confusion = this.llenarMatriz(array, modelo);
        resultado["M" + i] = this.exactitud(confusion);
      }

      for (let k = 0; k < modelo.length; k++) {
        array.push(modelo[k]);
      }
    }
    for (let i = 0; i < 10; i++) {
      if (tipoDato === "Numerico") {
        promedio += resultado["M" + i];
      } else if (tipoDato === "Categorico") {
        promedio += resultado["M" + i]["Exactitud"];
      }
    }
    resultado["Promedio"] = promedio / 10;
    console.log(resultado);
    return resultado;
  }

  errorCuadratico(array, modelo) {
    let error = 0;
    let knn = new KNN(array, this.clase);
    const llaves = Object.keys(modelo[0]);
    let tipo = '';
    modelo.forEach(element => {
      let objeto = null;
      llaves.forEach(llave => {
        if (typeof (element[llave]) == 'number' && llave != this.clase) {
          tipo = 'number';
        } else if (typeof (element[llave]) == 'string' && llave != this.clase) {
          tipo = 'string';
        }
      });
      if (tipo == 'number') {
        objeto = knn.dameMaximo(knn.dameKnnRegresion(knn.dameNormalizacionObjeto(element)));
        error += (element[this.clase] - objeto);
      } else if (tipo == 'string') {
        objeto = knn.dameMaximo(knn.dameKnnRegresion(element));
        error += (element[this.clase] - objeto);
      }
    });
    error /= modelo.length;
    return error;
  }

  llenarMatriz(array, modelo) {
    let confusion = {};
    let knn = new KNN(this.array, this.clase);
    let clase = knn.dameUnicosAtributos(this.clase);
    clase.forEach(element => {
      confusion[element] = {};
      clase.forEach(valor => {
        confusion[element][valor] = 0;
      });
    });
    knn = new KNN(array, this.clase);
    const llaves = Object.keys(modelo[0]);
    let tipo = '';
    modelo.forEach(element => {
      let objeto = null;
      llaves.forEach(llave => {
        if (typeof (element[llave]) == 'number' && llave != this.clase) {
          tipo = 'number';
        } else if (typeof (element[llave]) == 'string' && llave != this.clase) {
          tipo = 'string';
        }
      });
      if (tipo == 'number') {
        objeto = knn.dameMaximo(knn.dameKnnClasificacion(knn.dameNormalizacionObjeto(element)));
      } else if (tipo == 'string') {
        objeto = knn.dameMaximo(knn.dameKnnClasificacion(element));
      }

      if (objeto != "") {
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
    this.sensibilidadyExactitud.push(resultado);
    return resultado;
  }

  async closeModal() {
    setTimeout(() => {
      this.modalControler.dismiss();
    }, 1000);
  }

}

class KNN {
  array = null;
  clase = null;
  constructor(array, clase) {
    this.array = array;
    this.clase = clase;
  }

  dameElementosClase(dato) {
    const elementos = {};
    dato.forEach(valor => {
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

  dameK(arreglo) {
    let arr = JSON.parse(JSON.stringify(arreglo));
    const knn = [];
    let k = 3;
    for (let i = 0; i < k; i++) {
      let posicion = 0;
      let min = arr[0]["Distance"];
      for (let j = 0; j < arr.length; j++) {
        if (arr[j]["Distance"] < min) {
          min = arr[j]["Distance"];
          posicion = j;
        }
      }
      knn.push(arr[posicion]);
      arr.splice(posicion, 1);
    }
    return knn;
  }

  dameNormalizacionObjeto(instancia) {
    const inst = instancia;
    const llaves = Object.keys(this.array[0]);
    llaves.forEach(elemento => {
      let max = 0;
      let min = 0;
      const tablas = [];
      this.array.forEach(valor => {
        tablas.push(valor[elemento]);
      });
      max = Math.max.apply(null, tablas);
      min = Math.min.apply(null, tablas);
      if (elemento != this.clase) {
        inst[elemento] = ((inst[elemento] - min) / (max - min));
      }
    });
    return inst;
  }

  dameNormalizacion() {
    const arreglo = JSON.parse(JSON.stringify(this.array));
    const llaves = Object.keys(this.array[0]);
    const llavesarray = Object.keys(this.array);
    llaves.forEach(elemento => {
      let max = 0;
      let min = 0;
      const tablas = [];
      this.array.forEach(valor => {
        tablas.push(valor[elemento]);
      });
      max = Math.max.apply(null, tablas);
      min = Math.min.apply(null, tablas);
      if (elemento != this.clase) {
        llavesarray.forEach(numero => {
          arreglo[numero][elemento] = ((arreglo[numero][elemento] - min) / (max - min));
        });
      }
    });
    return arreglo;
  }

  dameEuclidiana(instancia) {
    const llavesarray = Object.keys(this.array);
    const llaves = Object.keys(this.array[0]);
    let tipo = '';
    let objeto = [];
    llaves.forEach(element => {
      if (typeof (this.array[0][element]) == "number" && element != this.clase) {
        tipo = 'number';
      } else if (typeof (this.array[0][element]) == "string" && element != this.clase) {
        tipo = 'string';
      }
    });
    if (tipo == 'number') {
      objeto = JSON.parse(JSON.stringify(this.dameNormalizacion()));
    } else if (tipo == 'string') {
      objeto = JSON.parse(JSON.stringify(this.array));
    }
    llavesarray.forEach(numero => {
      let sumatoria = 0;
      llaves.forEach(elemento => {
        if (typeof (this.array[numero][elemento]) === "number" && elemento != this.clase) {
          if (elemento != this.clase) {
            sumatoria += Math.pow((Number(objeto[numero][elemento]) - Number(instancia[elemento])), 2);
            tipo = 'number';
          }
        } else if (typeof (this.array[numero][elemento]) === "string" && elemento != this.clase) {
          if (objeto[numero][elemento] != instancia[elemento]) {
            sumatoria++;
            tipo = 'string';
          }
        }
      });
      if (tipo == 'number') {
        objeto[numero]["Distance"] = Math.sqrt(sumatoria);
      } else if (tipo == 'string') {
        objeto[numero]["Distance"] = sumatoria;
      }

    });
    return objeto;
  }

  dameManhattan(instancia) {
    let arreglo = JSON.parse(JSON.stringify(this.dameNormalizacion()));
    const llavesarray = Object.keys(this.array);
    const llaves = Object.keys(this.array[0]);
    llavesarray.forEach(numero => {
      let sumatoria = 0;
      llaves.forEach(elemento => {
        if (elemento != this.clase) {
          sumatoria += Math.abs((arreglo[numero][elemento] - instancia[elemento]));
        }
      });
      arreglo[numero]["Distance"] = sumatoria;
    });
    return arreglo;
  }

  dameKnnClasificacion(instancia) {
    const arreglo = this.dameEuclidiana(instancia);
    const knn = this.dameK(arreglo);
    const resultado = this.dameElementosClase(knn);
    return resultado;
  }

  dameKnnRegresion(instancia) {
    const arreglo = this.dameEuclidiana(instancia);
    const knn = this.dameK(arreglo);
    let sumatoria = 0;
    let resultado = 0;
    for (let i = 0; i < knn.length; i++) {
      sumatoria += knn[i][this.clase];
    }
    resultado = sumatoria / knn.length;
    return resultado;
  }

}
