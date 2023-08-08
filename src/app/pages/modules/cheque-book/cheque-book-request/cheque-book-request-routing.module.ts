import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeBookRequestComponent } from './cheque-book-request.component';

const routes: Routes = [{path:'', component:ChequeBookRequestComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeBookRequestRoutingModule { }
