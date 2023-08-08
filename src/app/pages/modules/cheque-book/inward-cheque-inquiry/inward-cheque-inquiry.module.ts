import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InwardChequeInquiryRoutingModule } from './inward-cheque-inquiry-routing.module';
import { InwardChequeInquiryComponent } from './inward-cheque-inquiry/inward-cheque-inquiry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { InwardChequeInquiryDetailsComponent } from './inward-cheque-inquiry-details/inward-cheque-inquiry-details.component';
import { InwardChequeInquiryListComponent } from './inward-cheque-inquiry-list/inward-cheque-inquiry-list.component';


@NgModule({
  declarations: [
    InwardChequeInquiryComponent,
    InwardChequeInquiryDetailsComponent,
    InwardChequeInquiryListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InwardChequeInquiryRoutingModule
  ]
})
export class InwardChequeInquiryModule { }
