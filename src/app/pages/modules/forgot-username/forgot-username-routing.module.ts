import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotUsernameComponent } from './forgot-username.component';

const routes: Routes = [{path:'',component:ForgotUsernameComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotUsernameRoutingModule { }
