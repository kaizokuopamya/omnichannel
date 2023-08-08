import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyDepositComponent } from './my-deposit.component';

const routes: Routes = [
  { path : '', component : MyDepositComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDepositRoutingModule { }
