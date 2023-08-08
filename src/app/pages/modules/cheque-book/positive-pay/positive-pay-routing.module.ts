import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositivePayComponent } from './positive-pay.component';

const routes: Routes = [{path:'', component:PositivePayComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositivePayRoutingModule { }
