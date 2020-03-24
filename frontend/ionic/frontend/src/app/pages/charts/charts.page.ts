import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from 'src/app/services/properties.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { FileService } from 'src/app/services/file.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss']
})

export class ChartsPage implements OnInit {

  dataset = null;
  nameDataset = '';
  columns = [];
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

   ngOnInit() {
  }

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
        if (!this.properties.atributos_archivo_creado._id) {
          this.columns.push({ name: '_id', prop: '_id' });
        }
        this.properties.atributos_archivo_creado.forEach(element => {
          this.columns.push({ name: element.nombre_atributo, prop: element.nombre_atributo });
        });
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
        this.dataset.forEach((element, index) => {
          element._id = index;
        });
        if (this.dataset.length > 500) {
          this.presentToast('Por temas de performance, solo se mostraran los primeros 500 elementos, numero de elementos: ' +
            this.dataset.length);
          for (let i = 0; i < 500; i++) {
            datasetCopy.push(this.dataset[i]);
          }
          this.dataset = datasetCopy;
        }
        console.log(this.dataset);
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadCharts() {
    this.properties.atributos_archivo_creado.forEach(item => {
      const element = document.getElementById(item.nombre_atributo);
      // @ts-ignore
      Plotly.plot( element, this.getChart(item.tipo_de_dato, item.nombre_atributo));
      });
  }

  getChart( dataType, attribName ) {
    const data = [];
    this.dataset.forEach(element => {
      data.push(element[attribName]);
    });

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
        type: 'histogram',
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
}
