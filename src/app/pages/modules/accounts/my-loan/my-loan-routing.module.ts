import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyLoanComponent } from './my-loan.component';

const routes: Routes = [
  { path : '', component : MyLoanComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyLoanRoutingModule { }
