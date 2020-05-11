import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NaiveBayesPage } from './naive-bayes.page';

const routes: Routes = [
  {
    path: '',
    component: NaiveBayesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NaiveBayesPageRoutingModule {}
