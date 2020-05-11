import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-naive-bayes',
  templateUrl: './naive-bayes.page.html',
  styleUrls: ['./naive-bayes.page.scss'],
})
export class NaiveBayesPage implements OnInit {
  settings = null;
  constructor(private navParams: NavParams) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
  }

  ngOnInit() {
  }

}
