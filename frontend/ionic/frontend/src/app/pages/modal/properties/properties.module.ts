import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertiesPageRoutingModule } from './properties-routing.module';

import { PropertiesPage } from './properties.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PropertiesPageRoutingModule
  ],
  declarations: [PropertiesPage]
})
export class PropertiesPageModule {}
