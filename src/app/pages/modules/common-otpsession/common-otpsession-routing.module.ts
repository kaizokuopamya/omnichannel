import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonOtpsessionComponent } from './common-otpsession.component';

const routes: Routes = [{path:'', component:CommonOtpsessionComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonOtpsessionRoutingModule { }
