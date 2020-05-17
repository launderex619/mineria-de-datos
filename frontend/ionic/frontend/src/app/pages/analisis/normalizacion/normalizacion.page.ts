import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-normalizacion',
  templateUrl: './normalizacion.page.html',
  styleUrls: ['./normalizacion.page.scss'],
})
export class NormalizacionPage implements OnInit {

  settings = null;
  constructor(private navParams: NavParams, private modalControler: ModalController) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.dibujarTabla('datosAntes');
    this.normalizarDatos();
    this.dibujarTabla('datosDespues');
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

  normalizarDatos() {
    const max = {};
    const min = {};
    const llavesSinFiltrar = Object.keys(this.settings.settings);
    const llaves = [];
    llavesSinFiltrar.forEach((llave, it) => {
      if (this.settings.settings[llave] === 'Numerico') {
        llaves.push(llave);
      }
    });

    llaves.forEach(llave => {
      max[llave] = Number.MIN_VALUE;
      min[llave] = Number.MAX_VALUE;
    });
    // encuentro los maximos y minimos de todos los atributos
    this.settings.dataset.forEach(elemento => {
      llaves.forEach(llave => {
        if (max[llave] < +elemento[llave]) {
          max[llave] = +elemento[llave];
        }
        if (min[llave] > +elemento[llave]) {
          min[llave] = +elemento[llave];
        }
      });
    });
    this.settings.dataset.forEach(elemento => {
      llaves.forEach(llave => {
        elemento[llave] = +((+elemento[llave] - min[llave]) / (max[llave] - min[llave])) * (1 - 0) + 0;
      });
    });
  }
}
