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
import { NormalizacionPage } from './normalizacion/normalizacion.page';
<<<<<<< HEAD
import { LlenarFaltantesPage } from './llenar-faltantes/llenar-faltantes.page';
=======
import { NumericoACategoricoPage } from './numerico-a-categorico/numerico-a-categorico.page';
>>>>>>> 62e98ec70cb0b95e1cc2e332df95a19d01c4fcf8

@NgModule({
  declarations: [
    AnalisisPage,
    OneRPage,
    ZeroRPage,
    NaiveBayesPage,
    KnnPage,
    KmeansPage,
    CategoricoANumericoPage,
    NormalizacionPage,
<<<<<<< HEAD
    LlenarFaltantesPage
=======
    NumericoACategoricoPage
>>>>>>> 62e98ec70cb0b95e1cc2e332df95a19d01c4fcf8
  ],
  entryComponents: [
    ZeroRPage,
    OneRPage,
    NaiveBayesPage,
    KnnPage,
    KmeansPage,
    CategoricoANumericoPage,
    NormalizacionPage,
<<<<<<< HEAD
    LlenarFaltantesPage
=======
    NumericoACategoricoPage
>>>>>>> 62e98ec70cb0b95e1cc2e332df95a19d01c4fcf8
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalisisPageRoutingModule
  ]
})
export class AnalisisPageModule {}
