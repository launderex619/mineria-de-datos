import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PropertiesService } from 'src/app/services/properties.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { PropertiesPage } from '../modal/properties/properties.page';
import { ElementPage } from '../modal/element/element.page';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.page.html',
  styleUrls: ['./tabla.page.scss']
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
    this.getProperties(version);
    this.getData(version);
  }

  ngOnInit() {}

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
          this.presentToast('Por temas de performance, solo se mostraran los primeros 500 elementos, numero de elementos: ' +
            this.dataset.length);
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
          handler: blah => {}
        },
        {
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

  async addAtribb() {
    const prompt = await this.alertController.create({
      header: 'Crear Atributo',
      message:
        'Ingresa el nombre del nuevo atributo a generar, posteriormente el valor' +
        ' que tendran todas las filas del atributo, por defecto se creara como tipo de dato numerico.' +
        ' Se puede cambiar mas adelante en el menu de properties',
      inputs: [
        {
          name: 'nombre_atributo',
          type: 'text',
          placeholder: 'Atributo ej. peso'
        },
        {
          name: 'expresion_regular',
          placeholder: 'Expresion regular'
        },
        {
          name: 'valores',
          type: 'number',
          placeholder: 'Valores'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {}
        },
        {
          text: 'Guardar',
          handler: async data => {
            const atrib = {};
            atrib[data.nombre_atributo] = data.valores;
            data.tipo_de_dato = 'Numerico';
            data.target = false;
            const atributo = {
              atributo: data,
              valor: Array(this.dataset.length).fill(atrib)
            };
            try {
              const resp = await this.dataService.addAttrib(this.properties.version, atributo).toPromise();
              // tslint:disable-next-line: deprecation
              window.location.reload(true);
              // @ts-ignore
              if (resp.status === 'ok') {
                this.presentToast('Creado con exito');
              } else {
                // @ts-ignore
                this.presentToast(resp.mensaje);
              }
            } catch (error) {
              this.presentToast(error.error.mensaje);
            }
          }
        }
      ]
    });
    await prompt.present();
  }

  async deleteAttrib() {
    const prompt = await this.alertController.create({
      header: 'Borrar atributo',
      message: 'Ingresa el nombre del atributo a eliminar... (si te equivocas siempre puedes regresar a una version anterior)',
      inputs: [
        {
          name: 'nombre_atributo',
          type: 'text',
          placeholder: 'Atributo ej. peso'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {}
        },
        {
          text: 'Borrar',
          handler: async data => {
            try {
              const resp = await this.dataService.deleteAttrib(this.properties.version, data.nombre_atributo).toPromise();
              // @ts-ignore
              if (resp.status === 'ok') {
                // tslint:disable-next-line: deprecation
                window.location.reload(true);
                this.presentToast('Borrado con exito');
              } else {
                // @ts-ignore
                this.presentToast(resp.mensaje);
              }
            } catch (error) {
              this.presentToast(error.error.mensaje);
            }
          }
        }
      ]
    });
    await prompt.present();
  }

  saveSet() {
    this.fileService.getFile(this.properties.version);
  }

  goCharts() {
    this.router.navigateByUrl(`/graficos/${this.properties.version}`);
  }
}
