import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PropertiesService } from 'src/app/services/properties.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { PropertiesPage } from '../modal/properties/properties.page';
import { ElementPage } from '../modal/element/element.page';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.page.html',
  styleUrls: ['./tabla.page.scss'],
})
export class TablaPage implements OnInit {

  dataset = null;
  nameDataset = '';
  datasetCopy = null;
  columns = [];
  properties = null;
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private propertiesSerive: PropertiesService,
    private dataService: DataService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
    ) { }

    ngOnInit() {}
  ionViewDidEnter() {
    const version = this.route.snapshot.paramMap.get('version');
    this.nameDataset = version;
    this.getProperties(version);
    this.getData(version);
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
        this.datasetCopy = [];
        this.dataset.forEach((element, index) => {
          element._id = index;
        });
        if (this.dataset.length > 500) {
          this.presentToast('Por temas de performance, solo se mostraran los primeros 500 elementos');
          for (let i = 0; i < 500; i++) {
            this.datasetCopy.push(this.dataset[i]);
          }
        } else {
          this.datasetCopy = this.dataset;
        }
        this.loaded = true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async showProperties() {
    const modal = await this.modalController.create({
      component: PropertiesPage,
      componentProps: {
        isEditing: true,
        properties: this.properties
      }
    });
    return await modal.present();
  }

  async askDelete(index) {
    console.log(index);
    const alert = await this.alertController.create({
        header: 'Eliminar',
        message: 'Estas seguro?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => { }
          }, {
            text: 'Si',
            handler: () => {
              this.deleteItem(index);
            }
          }
        ]
      });
    await alert.present();
  }

  async deleteItem(index) {
    try {
      const resp = await this.dataService.deleteItem(index, this.properties.version).toPromise();
      // @ts-ignore
      if (resp.status === 'ok') {
        this.presentToast('Eliminado con exito');
        // tslint:disable-next-line: deprecation
        window.location.reload(true);
      } else {
        this.presentToast('resp.mensaje');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addItem() {
    const modal = await this.modalController.create({
      component: ElementPage,
      componentProps: {
        isNew: true,
        properties: this.properties,
        data: null,
        index: null
      }
    });
    return await modal.present();
  }

  async editItem(index) {
    const modal = await this.modalController.create({
      component: ElementPage,
      componentProps: {
        isNew: false,
        properties: this.properties,
        data: this.datasetCopy[index],
        index
      }
    });
    return await modal.present();
  }
}
