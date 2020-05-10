import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from 'src/app/services/properties.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { FileService } from 'src/app/services/file.service';
import * as _ from 'lodash';
import { element } from 'protractor';
import { async } from '@angular/core/testing';

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
    } else {
      chart.push({
        y: data,
        name: attribName,
        type: 'histogram'
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
        list += `Elemento faltante: <br>${element} <br><br>`;
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
        list += `Elemento faltante: <br>${element} <br><br>`;
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
  getPearson(pearsonA: any[], pearsonB: any[]) {
    // variables
    let mediaA = 0;
    let mediaB = 0;
    let sumatoriaA = 0;
    let sumatoriaB = 0;
    let multiplicacion = 0;
    let q1 = 0;
    let q2 = 0;
    let nq1q2 = 0;
    const n = pearsonA.length;
    const resultado = 0;

    // Sacar media de A
    for (let i = 0; i < n; i++) {
      mediaA = mediaA + pearsonA[i];
    }
    mediaA = mediaA / n;
    // Sacar media de B
    for (let i = 0; i < n; i++) {
      mediaB = mediaB + pearsonB[i];
    }
    mediaB = mediaB / n;
    // Sacar la sumatoria
    for (let i = 0; i < n; i++) {
      multiplicacion = (pearsonA[i] - mediaA) * (pearsonB[i] - mediaB);
      sumatoriaA = sumatoriaA + multiplicacion;
    }
    multiplicacion = 0;
    // Sacar cuartil 1
    for (let i = 0; i < n; i++) {
      multiplicacion = Math.pow(pearsonA[i] - mediaA, 2);
      sumatoriaB = sumatoriaB + multiplicacion;
    }
    q1 = Math.sqrt(sumatoriaB / n);
    sumatoriaB = 0;
    multiplicacion = 0;

    // Sacar cuartil 2
    for (let i = 0; i < n; i++) {
      multiplicacion = Math.pow(pearsonB[i] - mediaB, 2);
      sumatoriaB = sumatoriaB + multiplicacion;
    }
    q2 = Math.sqrt(sumatoriaB / n);

    // Multiplicacion cuartil 1 y 2 por n
    nq1q2 = q1 * q2 * n;
    // Resultado Pearson rAB
    return '' + sumatoriaA / nq1q2;
  }
  getChiSquare(A: any[], B: any) {
    return 'No implementado :c';
  }

  async showList(message) {
    const alert = await this.alertController.create({
      header: 'Lista',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async startPearson() {
    const inputs = [];
    // tslint:disable-next-line: no-shadowed-variable
    this.properties.atributos_archivo_creado.forEach(element => {
      if (element.tipo_de_dato === 'Numerico') {
        inputs.push({
          name: element.nombre_atributo,
          type: 'radio',
          label: element.nombre_atributo,
          value: element.nombre_atributo,
          checked: false
        });
      }
    });
    if (inputs.length < 2) {
      this.presentToast('No hay suficientes atributos para comparar');
      return;
    }
    const alert = await this.alertController.create({
      header: 'Valor 1',
      inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: async val => {
            const alert2 = await this.alertController.create({
              header: 'Valor 2',
              inputs,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    console.log('Confirm Cancel');
                  }
                },
                {
                  text: 'Ok',
                  handler: async val2 => {
                    console.log(val);
                    const data1 = [];
                    const data2 = [];
                    // tslint:disable-next-line: no-shadowed-variable
                    this.dataset.forEach(element => {
                      if (element[val] !== '' && element[val] !== this.properties.valor_nulo) {
                        data1.push(+element[val]);
                      }
                      if (element[val2] !== '' && element[val2] !== this.properties.valor_nulo) {
                        data2.push(+element[val2]);
                      }
                    });
                    if (data1.length !== data2.length) {
                      this.presentToast('Los datos a comparar muestran una discrepancia en la cantidad de datos');
                      return;
                    }
                    const alert3 = await this.alertController.create({
                      header: 'Resultado',
                      message: this.getPearson(data1, data2),
                      buttons: ['OK']
                    });
                    await alert3.present();
                  }
                }
              ]
            });
            await alert2.present();
          }
        }
      ]
    });
    alert.present();
  }

  async startChi() {
    const inputs = [];
    // tslint:disable-next-line: no-shadowed-variable
    this.properties.atributos_archivo_creado.forEach(element => {
      if (element.tipo_de_dato !== 'Numerico') {
        inputs.push({
          name: element.nombre_atributo,
          type: 'radio',
          label: element.nombre_atributo,
          value: element.nombre_atributo,
          checked: false
        });
      }
    });
    if (inputs.length < 2) {
      this.presentToast('No hay suficientes atributos para comparar');
      return;
    }
    const alert = await this.alertController.create({
      header: 'Valor 1',
      inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: async val => {
            const alert2 = await this.alertController.create({
              header: 'Valor 2',
              inputs,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    console.log('Confirm Cancel');
                  }
                },
                {
                  text: 'Ok',
                  handler: async val2 => {
                    const data1 = [];
                    const data2 = [];
                    // tslint:disable-next-line: no-shadowed-variable
                    this.dataset.forEach(element => {
                      if (element[val] !== '' && element[val] !== this.properties.valor_nulo) {
                        data1.push(element[val]);
                      }
                      if (element[val2] !== '' && element[val2] !== this.properties.valor_nulo) {
                        data2.push(element[val2]);
                      }
                    });
                    if (data1.length !== data2.length) {
                      this.presentToast('Los datos a comparar muestran una discrepancia en la cantidad de datos');
                      return;
                    }
                    const alert3 = await this.alertController.create({
                      header: 'Resultado',
                      message: this.getChiSquare(data1, data2),
                      buttons: ['OK']
                    });
                    await alert3.present();
                  }
                }
              ]
            });
            await alert2.present();
          }
        }
      ]
    });
    alert.present();
  }
}
