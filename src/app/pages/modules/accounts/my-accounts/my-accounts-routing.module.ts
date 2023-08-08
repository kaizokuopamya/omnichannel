import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountsComponent } from './my-accounts.component';

const routes: Routes = [
  { path : '', component : MyAccountsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountsRoutingModule { }
