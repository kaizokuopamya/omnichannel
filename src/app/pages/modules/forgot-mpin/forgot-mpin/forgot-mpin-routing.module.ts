import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotMpinComponent } from './forgot-mpin.component';

const routes: Routes = [{path:'',component:ForgotMpinComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotMpinRoutingModule { }
