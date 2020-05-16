import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-categorico-a-numerico',
  templateUrl: './categorico-a-numerico.page.html',
  styleUrls: ['./categorico-a-numerico.page.scss'],
})
export class CategoricoANumericoPage implements OnInit {

  settings: any;
  configuracion: any;

  constructor(private navParams: NavParams, private modalControler: ModalController) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    this.configuracion = this.settings.settings;
    console.log(this.settings);
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.dibujarTabla('datosAntes');
    this.fijarConfiguracion();
    this.dibujarTabla('datosDespues');
  }

  dibujarTabla(id) {
    const tabla = document.getElementById(id);
    let tablaString = `
      <table class="overflow">
      <thead>
          <tr>
      `;
    Object.keys(this.configuracion).forEach(llaveConfig => {
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

  fijarConfiguracion() {
    const llavesConfig = Object.keys(this.configuracion);
    llavesConfig.forEach(llave => {
      switch (this.configuracion[llave]) {
        case 'Numerico':
          this.configuracion[llave] = {
            tipo: 'Numerico'
          };
          this.settings.dataset.forEach(elemento => {
            elemento[llave] = +elemento[llave];
          });
          break;
        case 'Nominal':
          this.crearColumna(llave);
          break;
        case 'Ordinal':
          this.configuracion[llave] = {
            tipo: 'Numerico'
          };
          this.cambiaOrdinalNumerico(llave);
          break;
      }
    });
  }

  crearColumna(llave) {
    const copiaDataset = [...this.settings.dataset];
    const copiaConfig = { ...this.configuracion };
    const elementosUnicos = [];
    // encontrar los elementos unicos del atributo
    copiaDataset.forEach(elemento => {
      if (!elementosUnicos.includes(elemento[llave])) {
        elementosUnicos.push(elemento[llave]);
      }
    });
    // crear columna con los datos unicos encontrados
    copiaDataset.forEach((elemento, it) => {
      const valorAntesDeBorrar = elemento[llave];
      delete copiaDataset[it][llave];
      elementosUnicos.forEach(valor => {
        copiaDataset[it][valor] = (valor === valorAntesDeBorrar) ? 1 : 0;
      });
    });
    // crear nueva configuracion con la columna agregada
    delete copiaConfig[llave];
    elementosUnicos.forEach(elemento => {
      copiaConfig[elemento] = {
        tipo: 'Numerico'
      };
    });
    this.settings.dataset = copiaDataset;
    this.configuracion = copiaConfig;
  }

  cambiaOrdinalNumerico(llaveConfig) {
    // necesito el orden de los datos, para ello le pregunto al usuario el orden de prioridad
    const datosUnicos = {};
    this.settings.dataset.forEach(elemento => {
      if (!datosUnicos[elemento[llaveConfig]]) {
        datosUnicos[elemento[llaveConfig]] = 0;
      }
    });
    Object.keys(datosUnicos).forEach(elemento => {
      datosUnicos[elemento] = +prompt(`Por favor, ingresa el orden del elemento "${elemento}" del atributo "${llaveConfig}"`, '0');
    });
    // teniendo el orden, cambio los valores en el dataset
    this.settings.dataset.forEach(elemento => {
      elemento[llaveConfig] = datosUnicos[elemento[llaveConfig]];
    });
  }

}
