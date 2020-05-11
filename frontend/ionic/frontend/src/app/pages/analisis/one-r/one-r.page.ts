import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-one-r',
  templateUrl: './one-r.page.html',
  styleUrls: ['./one-r.page.scss'],
})
export class OneRPage implements OnInit {
  settings = null;
  constructor(private navParams: NavParams) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
  }

  ngOnInit() {
  }

}
