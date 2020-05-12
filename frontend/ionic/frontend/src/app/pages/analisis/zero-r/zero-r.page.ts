import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-zero-r',
  templateUrl: './zero-r.page.html',
  styleUrls: ['./zero-r.page.scss'],
})
export class ZeroRPage implements OnInit {
  settings = null;
  table = {};
  tableClasses = [];
  mayorClass = '';
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
    // construyo la table de frecuencia de la clase, de la forma: {clase: elementos}
    this.settings.dataset.forEach(data => {
      if (this.table[data[this.settings.target]]) {
        this.table[data[this.settings.target]] += 1;
      } else {
        this.table[data[this.settings.target]] = 1;
      }
    });
    this.tableClasses = Object.keys(this.table);
    let max = Number.MIN_VALUE;
    this.tableClasses.forEach(data => {
      if (max < this.table[data]) {
        max = this.table[data];
        this.mayorClass = data;
      }
    });
    console.log(this.table);
  }

  async closeModal() {
    setTimeout(() => {
      this.modalControler.dismiss();
    }, 1000);
  }

}
