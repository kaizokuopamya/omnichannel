import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyChequeBookComponent } from './my-cheque-book.component';

const routes: Routes = [{path:'', component:MyChequeBookComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyChequeBookRoutingModule { }
