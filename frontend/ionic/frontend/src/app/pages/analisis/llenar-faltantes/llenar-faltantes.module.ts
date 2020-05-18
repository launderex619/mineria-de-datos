import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LlenarFaltantesPageRoutingModule } from './llenar-faltantes-routing.module';

import { LlenarFaltantesPage } from './llenar-faltantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LlenarFaltantesPageRoutingModule
  ],
  declarations: [LlenarFaltantesPage]
})
export class LlenarFaltantesPageModule {}
