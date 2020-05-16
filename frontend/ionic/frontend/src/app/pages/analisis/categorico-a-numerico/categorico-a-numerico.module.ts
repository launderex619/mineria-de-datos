import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoricoANumericoPageRoutingModule } from './categorico-a-numerico-routing.module';

import { CategoricoANumericoPage } from './categorico-a-numerico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoricoANumericoPageRoutingModule
  ],
  declarations: [CategoricoANumericoPage]
})
export class CategoricoANumericoPageModule {}
