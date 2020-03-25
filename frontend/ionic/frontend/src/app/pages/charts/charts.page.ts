import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from 'src/app/services/properties.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { FileService } from 'src/app/services/file.service';
import * as _ from 'lodash';
import { element } from 'protractor';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss']
})
export class ChartsPage implements OnInit {
  dataset = null;
  nameDataset = '';
  stadistics = [];
  properties = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertiesSerive: PropertiesService,
    private dataService: DataService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private fileService: FileService
  ) {
    const version = this.route.snapshot.paramMap.get('version');
    this.nameDataset = version;
  }

  ngOnInit() {}

  async ionViewDidEnter() {
    const version = this.route.snapshot.paramMap.get('version');
    await this.getProperties(version);
    await this.getData(version);

    this.loadCharts();
  }

  async getProperties(version) {
    try {
      const resp = await this.propertiesSerive.getProperties(version).toPromise();
      // @ts-ignore
      if (resp.status === 'ok') {
        // @ts-ignore
        this.properties = resp.archivo;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 4000
    });
    toast.present();
  }

  async getData(version) {
    try {
      const resp = await this.dataService.getData(version).toPromise();
      // @ts-ignore
      if (resp.status === 'ok') {
        // @ts-ignore
        this.dataset = resp.datos;
        const datasetCopy = [];
        // tslint:disable-next-line: no-shadowed-variable
        this.dataset.forEach((element, index) => {
          element._id = index;
        });
        if (this.dataset.length > 500) {
          this.presentToast(
            'Por temas de performance, solo se mostraran los primeros 500 elementos, numero de elementos: ' + this.dataset.length
          );
          for (let i = 0; i < 500; i++) {
            datasetCopy.push(this.dataset[i]);
          }
          this.dataset = datasetCopy;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadCharts() {
    this.properties.atributos_archivo_creado.forEach(item => {
      // tslint:disable-next-line: no-shadowed-variable
      const element = document.getElementById(item.nombre_atributo);
      // @ts-ignore
      Plotly.plot(element, this.getChart(item.tipo_de_dato, item.nombre_atributo, item.expresion_regular));
    });
  }

  getChart(dataType, attribName, regex) {
    const data = [];
    // tslint:disable-next-line: no-shadowed-variable
    this.dataset.forEach(element => {
      data.push(element[attribName]);
    });
    const variables = {
      missing_instances_number: this.getMissingInstancesNumber(data),
      missing_instances_list: this.getMissingInstancesString(data),
      instances_out_domain_number: this.getInstancesOutDomain(data, regex),
      instances_out_domain_list: this.getInstancesOutDomainString(data, regex),
      average: this.getAverage(data, dataType),
      median: this.getMedian(data, dataType),
      mode: this.getMode(data, dataType)
    };
    this.stadistics.push(variables);
    const chart = [];
    if (dataType === 'Numerico') {
      chart.push({
        y: data,
        name: attribName,
        jitter: 0.3,
        pointpos: -1.8,
        type: 'box',
        boxpoints: 'all'
      });
    } else if (dataType === 'Texto') {
      chart.push({
        y: data,
        name: attribName,
        type: 'histogram'
      });
    } else {
      chart.push({
        y: [1, 1, 1, 1, 1, 1, 12, 3, 3, 3, 5],
        name: attribName,
        jitter: 0.3,
        pointpos: -1.8,
        type: 'box',
        boxpoints: 'all'
      });
    }
    return chart;
  }
  getMissingInstancesNumber(data: any[]) {
    let counter = 0;
    // tslint:disable-next-line: no-shadowed-variable
    data.forEach(element => {
      if (element === this.properties.valor_nulo || element === '') {
        counter++;
      }
    });
    return counter;
  }
  getMissingInstancesString(data: any[]) {
    let list = '';
    // tslint:disable-next-line: no-shadowed-variable
    data.forEach((element, index) => {
      if (element === this.properties.valor_nulo || element === '') {
        list += `Elemento faltante: ${index} <br>`;
      }
    });
    return list;
  }
  getInstancesOutDomain(data: any[], regex) {
    let counter = 0;
    const regExp = new RegExp(regex);
    // tslint:disable-next-line: no-shadowed-variable
    data.forEach((element: string, index) => {
      if (!regExp.test(element)) {
        counter++;
      }
    });
    return counter;
  }
  getInstancesOutDomainString(data: any[], regex) {
    let list = '';
    const regExp = new RegExp(regex);
    // tslint:disable-next-line: no-shadowed-variable
    data.forEach((element: string, index) => {
      if (!regExp.test(element)) {
        list += `Elemento faltante: ${index} <br>`;
      }
    });
    return list;
  }
  getAverage(data: any[], dataType) {
    if (dataType !== 'Numerico') {
      return null;
    }
    let counter = 0;
    let sum = 0;
    // tslint:disable-next-line: no-shadowed-variable
    data.forEach(element => {
      if (element !== this.properties.valor_nulo && element !== '') {
        counter++;
        try {
          sum += +element;
        } catch (error) {
          this.presentToast('Error al intentar castear de cadena a Numero');
          return null;
        }
      }
    });
    if (counter === 0) {
      return 0;
    }
    return sum / counter;
  }
  getMedian(data: any[], dataType) {
    if (dataType !== 'Numerico') {
      return null;
    }
    data = data.filter(e => {
      return e !== '' && e !== this.properties.valor_nulo;
    });
    try {
      data.sort((a, b) => +a - +b);
    } catch (error) {
      this.presentToast('Error al intentar castear de cadena a Numero');
      return null;
    }
    const lowMiddle = Math.floor((data.length - 1) / 2);
    const highMiddle = Math.ceil((data.length - 1) / 2);
    return (+data[lowMiddle] + +data[highMiddle]) / 2;
  }
  getMode(data: any[], dataType) {
    if (dataType !== 'Numerico') {
      return null;
    }
    data = data.filter(e => {
      return e !== '' && e !== this.properties.valor_nulo;
    });
    return data.sort((a, b) => data.filter(v => v === a).length - data.filter(v => v === b).length).pop();
  }
  getPearson(data: any[], dataType: any) {
    // pendiente
  }
  getChiSquare(data: any[], dataType: any) {
    // pendiente
  }

  async showList(message) {
    const alert = await this.alertController.create({
      header: 'Lista',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
