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
  },
  {
    path: 'kmeans',
    loadChildren: () => import('./kmeans/kmeans.module').then( m => m.KmeansPageModule)
  },
  {
    path: 'categorico-a-numerico',
    loadChildren: () => import('./categorico-a-numerico/categorico-a-numerico.module').then( m => m.CategoricoANumericoPageModule)
  },
  {
    path: 'normalizacion',
    loadChildren: () => import('./normalizacion/normalizacion.module').then( m => m.NormalizacionPageModule)
  },
  {
    path: 'llenar-faltantes',
    loadChildren: () => import('./llenar-faltantes/llenar-faltantes.module').then( m => m.LlenarFaltantesPageModule)
  },
  {
    path: 'numerico-a-categorico',
    loadChildren: () => import('./numerico-a-categorico/numerico-a-categorico.module').then(m => m.NumericoACategoricoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalisisPageRoutingModule {}
