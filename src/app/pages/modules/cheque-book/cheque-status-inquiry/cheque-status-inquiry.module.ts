import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeStatusInquiryRoutingModule } from './cheque-status-inquiry-routing.module';
import { ChequeStatusInquiryComponent } from './cheque-status-inquiry.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChequeStatusInquiryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChequeStatusInquiryRoutingModule
  ]
})
export class ChequeStatusInquiryModule { }
