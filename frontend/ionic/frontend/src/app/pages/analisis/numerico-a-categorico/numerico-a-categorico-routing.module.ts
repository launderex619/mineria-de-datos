import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NumericoACategoricoPage } from './numerico-a-categorico.page';

const routes: Routes = [
  {
    path: '',
    component: NumericoACategoricoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumericoACategoricoPageRoutingModule {}
