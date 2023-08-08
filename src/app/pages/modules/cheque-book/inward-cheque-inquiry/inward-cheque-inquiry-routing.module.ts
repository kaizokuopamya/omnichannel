import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InwardChequeInquiryComponent } from './inward-cheque-inquiry/inward-cheque-inquiry.component';

const routes: Routes = [{path:'', component:InwardChequeInquiryComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardChequeInquiryRoutingModule { }
