import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NumericoACategoricoPageRoutingModule } from './numerico-a-categorico-routing.module';

import { NumericoACategoricoPage } from './numerico-a-categorico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NumericoACategoricoPageRoutingModule
  ],
  declarations: [NumericoACategoricoPage]
})
export class NumericoACategoricoPageModule {}
