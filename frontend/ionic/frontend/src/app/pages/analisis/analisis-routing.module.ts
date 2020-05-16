import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalisisPage } from './analisis.page';

const routes: Routes = [
  {
    path: '',
    component: AnalisisPage
  },
  {
    path: 'zero-r',
    loadChildren: () => import('./zero-r/zero-r.module').then( m => m.ZeroRPageModule)
  },
  {
    path: 'one-r',
    loadChildren: () => import('./one-r/one-r.module').then( m => m.OneRPageModule)
  },
  {
    path: 'naive-bayes',
    loadChildren: () => import('./naive-bayes/naive-bayes.module').then( m => m.NaiveBayesPageModule)
  },
  {
    path: 'knn',
    loadChildren: () => import('./knn/knn.module').then( m => m.KnnPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalisisPageRoutingModule {}
