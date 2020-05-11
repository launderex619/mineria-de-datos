import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneRPageRoutingModule } from './one-r-routing.module';

import { OneRPage } from './one-r.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OneRPageRoutingModule
  ],
  declarations: [OneRPage]
})
export class OneRPageModule {}
