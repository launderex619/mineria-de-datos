import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OneRPage } from './one-r.page';

const routes: Routes = [
  {
    path: '',
    component: OneRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OneRPageRoutingModule {}
