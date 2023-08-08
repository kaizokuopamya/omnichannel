import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePayeeComponent } from './manage-payee.component';

const routes: Routes = [{path:'', component:ManagePayeeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePayeeRoutingModule { }
