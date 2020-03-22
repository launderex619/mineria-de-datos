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
      icon: 'copy'
    },
    {
      title: 'Versiones',
      url: '/historico',
      icon: 'git-network'
    },
    {
      title: 'Configuracion',
      url: '/folder/Favorites',
      icon: 'settings'
    }
  ];
  public labels = ['Carlos Carvajal Vazquez', 'Jose Israel Flores Campos', 'Eduardo Guerra Alvarez'];
  public versionNames = null;

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
      const allVersions = await this.versiones.getVersions().toPromise();
      if (actualVersion.status === 'ok') {
        this.version = actualVersion.version;
        this.appPages[0].url = this.appPages[0].url + '/' + this.version;
      }
      if (allVersions.status === 'ok') {
        this.versionNames = allVersions.versiones;
      }
    } catch (error) {
      console.error(error);
    }
  }

  changeVersion(name) {
    console.log(name);
    
    this.version = name;
    this.appPages[0].url = 'tabla/' + this.version;
    console.log(this.version);
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
