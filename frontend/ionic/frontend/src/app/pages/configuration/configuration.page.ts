import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertiesPage } from '../modal/properties/properties.page';
import { PropertiesService } from 'src/app/services/properties.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss']
})
export class ConfigurationPage implements OnInit {
  properties = null;
  constructor(private route: ActivatedRoute, private modalController: ModalController, private propertiesSerive: PropertiesService) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.getProperties(this.route.snapshot.paramMap.get('version'));
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

  async createProperties() {
    const modal = await this.modalController.create({
      component: PropertiesPage,
      componentProps: {
        isEditing: false,
        properties: {
          descripcion: '',
          version: '',
          mongo: false,
          nombre_base_de_datos: null,
          tablas_base_de_datos: null,
          atributos_base_de_datos: null,
          atributos_archivo_creado: [],
          nombre_archivo_creado: null,
          valor_nulo: '?'
        }
      }
    });
    return await modal.present();
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
}
