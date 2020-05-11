import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZeroRPage } from './zero-r.page';

const routes: Routes = [
  {
    path: '',
    component: ZeroRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZeroRPageRoutingModule {}
