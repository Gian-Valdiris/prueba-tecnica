import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'
import { ProductsComponent } from './pages/products/products.component'
import {  AuthGuard } from './auth.guard'
const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'products',
    component:ProductsComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
