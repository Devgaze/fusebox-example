import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public-comp';
// import { RoutedComponent } from './routed-comp';
import { Noauth404Component } from './shared';

const ROUTES: Routes = [
  { path: '', component: PublicComponent, pathMatch: 'full' },
  { path: '404', component: Noauth404Component, pathMatch: 'full'},
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
