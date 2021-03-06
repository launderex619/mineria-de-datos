import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertiesService } from 'src/app/services/properties.service';
import { DataService } from 'src/app/services/data.service';
import { ToastController, ModalController } from '@ionic/angular';
import { ZeroRPage } from './zero-r/zero-r.page';
import { OneRPage } from './one-r/one-r.page';
import { NaiveBayesPage } from './naive-bayes/naive-bayes.page';
import { KnnPage } from './knn/knn.page';
import { KmeansPage } from './kmeans/kmeans.page';
import { CategoricoANumericoPage } from './categorico-a-numerico/categorico-a-numerico.page';
import { NormalizacionPage } from './normalizacion/normalizacion.page';
import { LlenarFaltantesPage } from './llenar-faltantes/llenar-faltantes.page';
import { NumericoACategoricoPage } from './numerico-a-categorico/numerico-a-categorico.page';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.page.html',
  styleUrls: ['./analisis.page.scss'],
})
export class AnalisisPage implements OnInit {
  properties = null;
  dataset = null;
  target = {
    nombre_atributo: '',
    tipo_de_dato: ''
  };
  settings = {};
  kFoldCrossValidationValue = 2;
  holdOutValue = 40;
  selectedValidationMethod = 'holdOut';
  constructor(private route: ActivatedRoute,
              private propertiesSerive: PropertiesService,
              private toastController: ToastController,
              private modalController: ModalController,
              private dataService: DataService) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.getProperties(this.route.snapshot.paramMap.get('version'));
    this.getData(this.route.snapshot.paramMap.get('version'));
  }

  async getProperties(version) {
    try {
      const resp = await this.propertiesSerive.getProperties(version).toPromise();
      // @ts-ignore
      if (resp.status === 'ok') {
        // @ts-ignore
        this.properties = resp.archivo;
        console.log(this.properties);
        this.findTarget();
        this.createSettings();
      }
    } catch (error) {
      console.error(error);
    }
  }

  findTarget() {
    this.properties.atributos_archivo_creado.forEach(atrib => {
      if (atrib.target) {
        this.target.nombre_atributo = atrib.nombre_atributo;
        this.target.tipo_de_dato = atrib.tipo_de_dato;
      }
    });
  }

  createSettings() {
    this.properties.atributos_archivo_creado.forEach(atribb => {
      const datatype = atribb.tipo_de_dato;
      if (datatype === 'Numerico') {
        this.settings[atribb.nombre_atributo] = datatype;
      } else {
        this.settings[atribb.nombre_atributo] =
          prompt(`Por favor, ingresa que tipo de dato categorico es el atributo
            ${atribb.nombre_atributo} con la expresion ${atribb.expresion_regular}`, 'Ordinal');
      }
    });
  }

  async getData(version) {
    try {
      const resp = await this.dataService.getData(version).toPromise();
      // @ts-ignore
      if (resp.status === 'ok') {
        // @ts-ignore
        this.dataset = resp.datos;
        const datasetCopy = [];
        if (this.dataset.length > 500) {
          this.presentToast(
            'Por temas de performance, solo se mostraran los primeros 500 elementos, numero de elementos: ' + this.dataset.length
          );
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

  getComponentProps() {
    const validationMethodValue = (this.selectedValidationMethod === 'holdOut') ? this.holdOutValue : this.kFoldCrossValidationValue;
    return {
      settings: {
        target: this.target.nombre_atributo,
        targetType: this.target.tipo_de_dato,
        validationMethod: this.selectedValidationMethod,
        validationMethodValue,
        dataset: this.dataset,
        properties: this.properties,
        settings: this.settings
      }
    };
  }

  async showZeroR() {
    const modal = await this.modalController.create({
      component: ZeroRPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();
  }

  async showOneR() {
    const modal = await this.modalController.create({
      component: OneRPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();

  }

  async showNaiveBayes() {
    const modal = await this.modalController.create({
      component: NaiveBayesPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();

  }

  async showKnn() {
    const modal = await this.modalController.create({
      component: KnnPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();
  }

  async showKmeans() {
    const modal = await this.modalController.create({
      component: KmeansPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();
  }

  async llenarFaltantes() {
    const modal = await this.modalController.create({
      component: LlenarFaltantesPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();
  }

  async transformCategoricToNumeric() {
    const modal = await this.modalController.create({
      component: CategoricoANumericoPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();
  }

  async transformNumericToCategoric() {
    const modal = await this.modalController.create({
      component: NumericoACategoricoPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();
  }
  async normalize() {
    const modal = await this.modalController.create({
      component: NormalizacionPage,
      componentProps: this.getComponentProps()
    });
    return await modal.present();
  }

  changeRangeValidationMethod(method, value) {
    if (method === 'holdOut') {
      this.holdOutValue = value.detail.value;
    } else {
      this.kFoldCrossValidationValue = value.detail.value;
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 4000
    });
    toast.present();
  }

  changeValidationMethod(method) {
    this.selectedValidationMethod = method;
  }
}
