import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NavParams, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-element',
  templateUrl: './element.page.html',
  styleUrls: ['./element.page.scss']
})
export class ElementPage implements OnInit {
  properties = null;
  isNew = false;
  data = null;
  elementGroup: FormGroup;
  indexElement = null;

  constructor(
    private navParams: NavParams,
    private form: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController
  ) {
    this.properties = this.navParams.get('properties');
    this.isNew = this.navParams.get('isNew');
    this.data = this.navParams.get('data');
    this.indexElement = this.navParams.get('index');
    this.elementGroup = this.form.group({
      elements: this.form.array([this.getArrayAtribb()])
    });
    if (this.data) {
      this.fillInformation();
    } else {
      this.createInformation();
    }
  }

  ngOnInit() {}

  getArrayAtribb() {
    return this.form.group({
      name: [''],
      value: ['', Validators.required]
    });
  }

  fillInformation() {
    const control = this.elementGroup.controls.elements as FormArray;
    control.clear();
    this.properties.atributos_archivo_creado.forEach((element, index) => {
      control.push(
        this.form.group({
          name: [element.nombre_atributo],
          value: [
            this.data[element.nombre_atributo],
            Validators.compose([Validators.pattern(element.expresion_regular), Validators.required])
          ]
        })
      );
    });
  }

  createInformation() {
    const control = this.elementGroup.controls.elements as FormArray;
    control.clear();
    this.properties.atributos_archivo_creado.forEach((element, index) => {
      control.push(
        this.form.group({
          name: [element.nombre_atributo],
          value: [
            '',
            Validators.compose([Validators.pattern(element.expresion_regular), Validators.required])
          ]
        })
      );
    });
  }

  addControl() {
    const control = this.elementGroup.controls.elements as FormArray;
    control.push(this.getArrayAtribb());
  }

  removeControl(index) {
    console.log(index);
    const control = this.elementGroup.controls.elements as FormArray;
    control.removeAt(index);
  }

  async saveProperties() {
    const object = {};
    this.elementGroup.value.elements.forEach((element, index) => {
      object[element.name] = element.value;
    });
    console.log(object, this.elementGroup.value);
    let resp;
    if (this.isNew) {
      resp = await this.dataService.addItem(this.properties.version, object).toPromise();
    } else {
      resp = await this.dataService.editItem(this.properties.version,  this.indexElement, object).toPromise();
    }
    // @ts-ignore
    if (resp.status === 'ok') {
      // tslint:disable-next-line: deprecation
      window.location.reload(true);
      this.presentToast('Operacion realizada con exito');
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
