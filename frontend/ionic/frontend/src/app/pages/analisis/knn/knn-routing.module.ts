import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KnnPage } from './knn.page';

const routes: Routes = [
  {
    path: '',
    component: KnnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnnPageRoutingModule {}
