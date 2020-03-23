import { Component, OnInit } from '@angular/core';
import { VersionesService } from 'src/app/services/versiones.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  versiones = null ;
  constructor( private versionesService: VersionesService, private toastController: ToastController) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    try {
      const resp = await this.versionesService.getVersions().toPromise();
    // @ts-ignore
      if (resp.status === 'ok') {
        // @ts-ignore
        this.versiones = resp.versiones;
      }
    } catch (error) {
      // @ts-ignore
      this.presentToast(resp.mensaje);
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  download(version) {
    console.log(version);
  }

}
