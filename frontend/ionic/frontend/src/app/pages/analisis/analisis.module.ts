import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalisisPageRoutingModule } from './analisis-routing.module';

import { AnalisisPage } from './analisis.page';
import { OneRPage } from './one-r/one-r.page';
import { ZeroRPage } from './zero-r/zero-r.page';
import { NaiveBayesPage } from './naive-bayes/naive-bayes.page';
import { KnnPage } from './knn/knn.page';
import { KmeansPage } from './kmeans/kmeans.page';
import { CategoricoANumericoPage } from './categorico-a-numerico/categorico-a-numerico.page';

@NgModule({
  declarations: [AnalisisPage, OneRPage, ZeroRPage, NaiveBayesPage, KnnPage, KmeansPage, CategoricoANumericoPage],
  entryComponents: [
    ZeroRPage,
    OneRPage,
    NaiveBayesPage,
    KnnPage,
    KmeansPage,
    CategoricoANumericoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalisisPageRoutingModule
  ]
})
export class AnalisisPageModule {}
