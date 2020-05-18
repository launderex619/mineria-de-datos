import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-llenar-faltantes',
  templateUrl: './llenar-faltantes.page.html',
  styleUrls: ['./llenar-faltantes.page.scss'],
})
export class LlenarFaltantesPage implements OnInit {
  settings = null;
  array = null;
  valores = null;
  constructor(private navParams: NavParams, private modalControler: ModalController) { 
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
  }

  ngOnInit() {

    this.dibujarTabla("datosAntes");

    delete this.settings.settings['sl_no'];
    let tipo = Object.keys(this.settings.settings);
    this.array = this.settings.dataset;
    let llaves = Object.keys(this.array[0]);
    this.array.forEach(element => {
      delete element["_id"];
      delete element["sl_no"];
    });

    this.valores = this.llenarDatos();
    this.settings.dataset;

    this.dibujarTabla("datosDespues");

  }

  async closeModal() {
    setTimeout(() => {
      this.modalControler.dismiss();
    }, 500);
  }
  dameUnicosAtributo(atributo) {
    const elementos = {};
    this.array.forEach(valor => {
      if (valor[atributo] != "?" && valor[atributo] != "") {
        if (!elementos[valor[atributo]]) {
          elementos[valor[atributo]] = 1;
        } else {
          elementos[valor[atributo]]++
        }
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

  dameMedia(atributo) {
    let media = 0;
    let contador = 0;
    this.array.forEach(valor => {
      if (valor[atributo] != "?" && valor[atributo] != "") {
        media += Number(valor[atributo]);
        contador++;
      }
    });
    media /= contador;
    return media;
  }

  dameMediana(atributo) {
    const array = JSON.parse(JSON.stringify(this.array));
    let mediana = 0;
    let arreglo = [];
    let mitad = 0;
    array.forEach(valor => {
      if (valor[atributo] != "?" && valor[atributo] != "") {
        arreglo.push(Number(valor[atributo]));
      }
    });
    arreglo.sort(function (a, b) { return a - b });
    if (arreglo.length % 2 == 0) {
      mitad = arreglo.length / 2;
      mediana = Number(arreglo[mitad - 1]);
      mediana += Number(arreglo[mitad]);
      mediana = mediana / 2;

    } else {
      mitad = Math.round(arreglo.length / 2);
      mediana = Number(arreglo[mitad - 1]);
    }
    return mediana;
  }

  llenarDatos() {
    let llenado = {};
    let llaves = Object.keys(this.array[0]);
    let resultado = "media";
    llaves.forEach(llave => {
      let media = 0;
      let mediana = 0;
      if (this.settings.settings[llave] != "Numerico") {
        this.array.forEach(element => {
          if (element[llave] == '?' || element[llave] == '') {
            element[llave] = this.dameMaximo(this.dameUnicosAtributo(llave));
            llenado[llave] = this.dameMaximo(this.dameUnicosAtributo(llave));
          }
        });
      }
      if (this.settings.settings[llave] == "Numerico") {
        media = this.dameMedia(llave);
        mediana = this.dameMediana(llave);
        if ((media - mediana) <= 2 && (media - mediana) >= -2) {
          resultado = prompt("Escribe entre la media y mediana para " + llave, "media");
        } else {
          resultado = prompt("Escoge entre la media y mediana para " + llave, "mediana");
        }
        while (resultado == null || (resultado != "media" && resultado != "mediana")) {
          resultado = prompt("Escribe entre la media y mediana para " + llave, "media");
        }
        this.array.forEach(element => {
          if (element[llave] == '?' || element[llave] == '') {
            if (resultado == "media") {
              llenado[llave] = media;
              element[llave] = media;
            } else {
              element[llave] = mediana;
              llenado[llave] = mediana;
            }
          }
        });
      }
    });
    return llenado;
  }

  dibujarTabla(id) {
    const tabla = document.getElementById(id);
    let tablaString = `
      <table class="overflow">
      <thead>
          <tr>
      `;
    Object.keys(this.settings.settings).forEach(llaveConfig => {
      tablaString += `<th scope="col" class="ion-padding">${llaveConfig}</th>`;
    });
    tablaString += '</tr></thead><tbody>';
    this.settings.dataset.forEach(elemento => {
      const llaves = Object.keys(elemento);
      tablaString += `<tr>`;
      llaves.forEach(llave => {
        tablaString += `<td>${elemento[llave]}</td>`;
      });
      tablaString += `</tr>`;
    });
    tablaString += '</tbody></table>';
    tabla.innerHTML = tablaString;
  }
}