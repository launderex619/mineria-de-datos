import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LlenarFaltantesPage } from './llenar-faltantes.page';

const routes: Routes = [
  {
    path: '',
    component: LlenarFaltantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LlenarFaltantesPageRoutingModule {}
