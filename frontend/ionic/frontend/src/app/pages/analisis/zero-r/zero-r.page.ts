import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-zero-r',
  templateUrl: './zero-r.page.html',
  styleUrls: ['./zero-r.page.scss'],
})
export class ZeroRPage implements OnInit {
  settings = null;
  constructor(private navParams: NavParams) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
  }

  ngOnInit() {
  }

}
