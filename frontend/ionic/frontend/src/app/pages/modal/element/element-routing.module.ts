import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElementPage } from './element.page';

const routes: Routes = [
  {
    path: '',
    component: ElementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElementPageRoutingModule {}
