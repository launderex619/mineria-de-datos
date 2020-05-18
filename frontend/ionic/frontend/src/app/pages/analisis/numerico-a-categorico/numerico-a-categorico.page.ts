import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-numerico-a-categorico',
  templateUrl: './numerico-a-categorico.page.html',
  styleUrls: ['./numerico-a-categorico.page.scss'],
})
export class NumericoACategoricoPage implements OnInit {

  canShowButtons = true;
  settings = null;
  constructor(private navParams: NavParams, private modalControler: ModalController) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
  }

  ngOnInit() {
  }

  equalWidth() {
    this.dibujarTabla('datosAntes');
    this.canShowButtons = false;
    const llavesSinFiltrar = Object.keys(this.settings.settings);
    const llavesFiltradas = [];
    llavesSinFiltrar.forEach(llave => {
      if (this.settings.settings[llave] === 'Numerico') {
        llavesFiltradas.push(llave);
        this.settings.settings[llave] = 'Ordinal';
        this.settings.properties.
        atributos_archivo_creado.forEach(valor => {
          valor.tipo_de_dato = 'Categorico';
        });
      }
    });
    const categorias = {};
    llavesFiltradas.forEach(llave => {
      const divisores = [];
      categorias[llave] = [];
      this.settings.dataset.forEach(dato => {
        if (!categorias[llave].includes(+dato[llave])) {
          categorias[llave].push(+dato[llave]);
        }
      });
      let numeroDePartes = 0;
      do {
        numeroDePartes = +prompt(`Ingresa el numero de categorias que deseas para el atributo ${llave},
          no mas de ${categorias[llave].length} categorias`, '2');
      } while (numeroDePartes >= categorias[llave].length);
      categorias[llave].sort((a, b) => a - b);
      divisores.push(categorias[llave][0]);
      let cont = 1;
      for (let i = categorias[llave].length - 1; i > 0; i -= Math.floor(categorias[llave].length / (numeroDePartes))) {
        divisores.push(categorias[llave][i]);
        if (cont++ >= numeroDePartes) {
          break;
        }
      }
      divisores.sort((a, b) => a - b);
      this.settings.dataset.forEach(dato => {
        let i = 1;
        while (dato[llave] > divisores[i] && i < numeroDePartes) {
          i++;
        }
        dato[llave] = `${divisores[i-1]} >-< ${divisores[i]}`;
      });
    });
    this.dibujarTabla('datosDespues');
  }

  equalHeight() {
    this.dibujarTabla('datosAntes');
    this.canShowButtons = false;
    this.canShowButtons = false;
    const llavesSinFiltrar = Object.keys(this.settings.settings);
    const llavesFiltradas = [];
    llavesSinFiltrar.forEach(llave => {
      if (this.settings.settings[llave] === 'Numerico') {
        llavesFiltradas.push(llave);
        this.settings.settings[llave] = 'Ordinal';
        this.settings.properties.
        atributos_archivo_creado.forEach(valor => {
          valor.tipo_de_dato = 'Categorico';
        });
      }
    });
    const categorias = {};
    llavesFiltradas.forEach(llave => {
      const divisores = [];
      categorias[llave] = [];
      this.settings.dataset.forEach(dato => {
        categorias[llave].push(+dato[llave]);
      });
      categorias[llave].sort((a, b) => a - b);
      divisores.push(categorias[llave][0]);
      let numeroDePartes = 0;
      do {
        numeroDePartes = +prompt(`Ingresa la altura aproximada que deseas para el atributo ${llave},
          no mas de ${Math.floor(categorias[llave].length / 2)} de  altura`, '2');
      } while (numeroDePartes >= categorias[llave].length);
      let i = 1;
      let anterior = categorias[llave][0];
      let actual = categorias[llave][1];
      let alcanzoLimite = false;
      while (i < categorias[llave].length) {
        anterior = categorias[llave][i - 1];
        actual = categorias[llave][i];
        if (i % numeroDePartes === 0) {
          alcanzoLimite = true;
        }
        if (alcanzoLimite) {
          if (anterior !== actual) {
            alcanzoLimite = false;
            divisores.push(categorias[llave][i]);
          }
        }
        i++;
      }
      divisores.sort((a, b) => a - b);
      this.settings.dataset.forEach(dato => {
        i = 0;
        while (dato[llave] >= divisores[i] && i < divisores.length) {
          i++;
        }
        dato[llave] = `${divisores[i-1]} >-< ${divisores[i]}`;
      });
      console.log(categorias, divisores);
    });
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


}
