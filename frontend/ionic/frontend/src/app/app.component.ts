import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { VersionesService } from './services/versiones.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public version = null;
  public appPages = [
    {
      title: 'Set de Datos',
      url: '/tabla',
      icon: 'mail'
    },
    {
      title: 'Versiones',
      url: '/historico',
      icon: 'paper-plane'
    },
    {
      title: 'Configuracion',
      url: '/folder/Favorites',
      icon: 'heart'
    }
  ];
  public labels = ['Carlos Carvajal Vazquez', 'Jose Israel Flores Campos', 'Eduardo Guerra Alvarez'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private versiones: VersionesService
  ) {
    this.initializeApp();
    this.getInfo();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async getInfo() {
    try {
      const actualVersion = await this.versiones.getActualVersion().toPromise();
      if (actualVersion.status === 'ok') {
        this.version = actualVersion.version + '.json';
        this.appPages[0].url = this.appPages[0].url + '/' + this.version;
      }
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
