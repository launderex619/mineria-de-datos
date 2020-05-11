import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZeroRPageRoutingModule } from './zero-r-routing.module';

import { ZeroRPage } from './zero-r.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZeroRPageRoutingModule
  ],
  declarations: [ZeroRPage]
})
export class ZeroRPageModule {}
