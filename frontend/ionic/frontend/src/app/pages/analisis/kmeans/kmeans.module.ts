import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KmeansPageRoutingModule } from './kmeans-routing.module';

import { KmeansPage } from './kmeans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KmeansPageRoutingModule
  ],
  declarations: [KmeansPage]
})
export class KmeansPageModule {}
