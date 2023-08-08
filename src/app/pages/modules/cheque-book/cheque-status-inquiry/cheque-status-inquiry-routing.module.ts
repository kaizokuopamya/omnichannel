import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeStatusInquiryComponent } from './cheque-status-inquiry.component';

const routes: Routes = [{path:'', component:ChequeStatusInquiryComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeStatusInquiryRoutingModule { }

