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
    var opcion;
    do {
     opcion = +prompt("Eliga el metodo de normalizacion. 1 para Min-Max. 2 para Z-score (absoluta). 3 para Z-score (estandar)")
    }while(opcion < 1 || opcion > 3)
    
    const max = {};
    const min = {};
    const llavesSinFiltrar = Object.keys(this.settings.settings);
    const llaves = [];
    llavesSinFiltrar.forEach((llave, it) => {
      if (this.settings.settings[llave] === 'Numerico') {
        llaves.push(llave);
      }
    });
    //MIN-MAX
    if(opcion == 1){
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
  const media = {};
  const nDelAtributo = {};
  llaves.forEach(llave => {
    if(llave != "sl_no"){
    media[llave] = 0;
    nDelAtributo[llave] = 0;
    }
  })
  //primer paso: obtenemos la media de cada atributo
  this.settings.dataset.forEach(elemento => {
    llaves.forEach(llave => {
      if (+elemento[llave] != null && +elemento[llave] != NaN && llave != "sl_no") {
        media[llave] += +elemento[llave];
        nDelAtributo[llave]++;
      }        
    });
  });
  llaves.forEach(llave => {
    if(llave != "sl_no")
    media[llave] /= nDelAtributo[llave];
  });
  //DESVIACION ESTANDAR ABSOLUTA
  if(opcion == 2){
    const desviacionEstAbs = {};
    llaves.forEach(llave => {
      if(llave != "sl_no"){      
      desviacionEstAbs[llave] = 0;
      }
    });    
    //segunda parte A: encontrar la desviacion estandar absoluta
    this.settings.dataset.forEach(elemento => {
      llaves.forEach(llave => {
        if (+elemento[llave] != null && +elemento[llave] != NaN && llave != "sl_no") {
          desviacionEstAbs[llave] += Math.abs(+elemento[llave] - media[llave])          
        }
      });
    });
    llaves.forEach(llave => {
      if(llave != "sl_no")
      desviacionEstAbs[llave] /= nDelAtributo[llave];
    });    
    //Editamos el dataset con la operacion (x-Media)/desvEst
    this.settings.dataset.forEach(elemento => {
      llaves.forEach(llave => {
        if (llave != "sl_no" )
        elemento[llave] = +((+elemento[llave] - media[llave]) / desviacionEstAbs[llave] );
      });
    });
  }
  //DESVIACION ESTANDAR SIMPLE
    if(opcion == 3){
    const desviacionEst = {};
    llaves.forEach(llave => {
      if(llave != "sl_no"){      
      desviacionEst[llave] = 0;      
      }
    });
    //segunda parte B: encontrar la desviacion estandar
    //sumamos las diferencias al cuadrado
    this.settings.dataset.forEach(elemento => {
      llaves.forEach(llave => {
        if (+elemento[llave] != null && +elemento[llave] != NaN && llave != "sl_no") {
          desviacionEst[llave] += Math.pow( (+elemento[llave] - media[llave]) ,2)
        }
      });
    });
    //dividimos entre n cada sumatoria
    llaves.forEach(llave => {
      if(llave != "sl_no")
      desviacionEst[llave] /= nDelAtributo[llave];
    });
    //encontramos la desvEst aplicando raiz cuadrada
    llaves.forEach(llave => {
      if(llave != "sl_no")
      desviacionEst[llave] = Math.sqrt(desviacionEst[llave]);
    });
    //asignacion al dataset
    this.settings.dataset.forEach(elemento => {
      llaves.forEach(llave => {
        if (llave != "sl_no" )
        elemento[llave] = +((+elemento[llave] - media[llave]) / desviacionEst[llave] );
      });
    });
    }
    /*console.log("encontrado como media:")
    console.log(media)    
    console.log("encontrado como desviacion estandar:")
    console.log(desviacionEst)
    console.log("El set resultante")
    console.log(this.settings.dataset)*/
  }
}
