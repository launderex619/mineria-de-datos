import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PropertiesService } from 'src/app/services/properties.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss']
})
export class PropertiesPage implements OnInit {
  properties = null;
  createNew = false;
  isEditionMode = false;
  propertiesGroup: FormGroup;

  constructor(
    private navParams: NavParams,
    private form: FormBuilder,
    private propertiesService: PropertiesService,
    private toastController: ToastController
  ) {
    this.properties = this.navParams.get('properties');
    this.createNew = this.navParams.get('isEditing');
    console.log(this.properties);
    this.propertiesGroup = this.form.group({
      descripcion: [this.properties.descripcion, Validators.required],
      mongo: [false],
      nombre_base_de_datos: [null],
      tablas_base_de_datos: [null],
      atributos_base_de_datos: [null],
      version: [this.properties.version],
      valor_nulo: [this.properties.valor_nulo, Validators.required],
      nombre_archivo_creado: [this.properties.nombre_archivo_creado],
      atributos_archivo_creado: this.form.array([this.getArrayAtribb()])
    });
    this.fillInformation();
  }

  ngOnInit() {}

  getArrayAtribb() {
    return this.form.group({
      nombre_atributo: ['', Validators.required],
      tipo_de_dato: ['', Validators.required],
      target: [false, Validators.required],
      expresion_regular: ['', Validators.required]
    });
  }

  fillInformation() {
    const control = this.propertiesGroup.controls.atributos_archivo_creado as FormArray;
    control.clear();
    this.properties.atributos_archivo_creado.forEach(element => {
      control.push(
        this.form.group({
          nombre_atributo: [element.nombre_atributo, Validators.required],
          tipo_de_dato: [element.tipo_de_dato, Validators.required],
          target: [element.target, Validators.required],
          expresion_regular: [element.expresion_regular, Validators.required]
        })
      );
    });
  }

  addControl() {
    const control = this.propertiesGroup.controls.atributos_archivo_creado as FormArray;
    control.push(this.getArrayAtribb());
  }

  removeControl(index) {
    console.log(index);
    const control = this.propertiesGroup.controls.atributos_archivo_creado as FormArray;
    control.removeAt(index);
  }

  async saveProperties() {
    console.log(this.propertiesGroup);
    let resp;
    if ( this.createNew ) {
      resp = await this.propertiesService.createProperties(this.propertiesGroup.value).toPromise();
    }
    else {
      resp = await this.propertiesService.modifyProperties(this.propertiesGroup.value).toPromise();
    }
    // @ts-ignore
    if (resp.status === 'ok') {
      this.presentToast('Archivo properties modificado correctamente');
      // tslint:disable-next-line: deprecation
      window.location.reload(true);
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
