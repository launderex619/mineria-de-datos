import { Component, OnInit } from '@angular/core';
import { VersionesService } from 'src/app/services/versiones.service';
import { ToastController, AlertController } from '@ionic/angular';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss']
})
export class HistoricoPage implements OnInit {
  versiones = null;
  constructor(
    private versionesService: VersionesService,
    private toastController: ToastController,
    private fileService: FileService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

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
    this.fileService.getFile(version);
  }

  async upload(version) {
    const alert = await this.alertController.create({
      header: 'Atencion',
      message: 'Se creara una nueva version con el nuevo set, la version seleccionada permanecera intacta!',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = async e => {
              try {
                // @ts-ignore
                const file = e.target.files[0];
                const formData = new FormData();
                formData.append('archivo', file);
                const resp = await this.fileService.submitFile(version, formData).toPromise();
                // @ts-ignore
                if (resp.status === 'ok') {
                  // tslint:disable-next-line: deprecation
                  window.location.reload(true);
                  this.presentToast('Subido con exito');
                }
              } catch (error) {
                // @ts-ignore
                this.presentToast(resp.mensaje);
              }
            };
            input.click();
          }
        }
      ]
    });
    await alert.present();
  }
}
