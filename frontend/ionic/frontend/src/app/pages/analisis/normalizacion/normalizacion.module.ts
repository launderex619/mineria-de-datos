import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NormalizacionPageRoutingModule } from './normalizacion-routing.module';

import { NormalizacionPage } from './normalizacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NormalizacionPageRoutingModule
  ],
  declarations: [NormalizacionPage]
})
export class NormalizacionPageModule {}
