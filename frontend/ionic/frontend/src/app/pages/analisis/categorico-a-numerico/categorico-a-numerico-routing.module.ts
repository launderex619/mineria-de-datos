import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoricoANumericoPage } from './categorico-a-numerico.page';

const routes: Routes = [
  {
    path: '',
    component: CategoricoANumericoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoricoANumericoPageRoutingModule {}
