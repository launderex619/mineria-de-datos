import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NaiveBayesPageRoutingModule } from './naive-bayes-routing.module';

import { NaiveBayesPage } from './naive-bayes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NaiveBayesPageRoutingModule
  ],
  declarations: [NaiveBayesPage]
})
export class NaiveBayesPageModule {}
