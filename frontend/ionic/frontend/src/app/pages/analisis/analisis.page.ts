import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertiesService } from 'src/app/services/properties.service';
import { DataService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';

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
  constructor(private route: ActivatedRoute, private propertiesSerive: PropertiesService,
              private toastController: ToastController, private dataService: DataService) {}

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
      }
    } catch (error) {
      console.error(error);
    }
  }

  findTarget() {
    this.properties.atributos_archivo_creado.forEach(atrib => {
      if(atrib.target) {
        this.target.nombre_atributo = atrib.nombre_atributo;
        this.target.tipo_de_dato = atrib.tipo_de_dato;
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
        console.log(this.dataset);
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

  muestraLog(message) {
    console.log(message);
  }
}
