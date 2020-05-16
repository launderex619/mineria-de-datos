import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KnnPageRoutingModule } from './knn-routing.module';

import { KnnPage } from './knn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KnnPageRoutingModule
  ],
  declarations: [KnnPage]
})
export class KnnPageModule {}
