import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsMiniStatementRoutingModule } from './accounts-mini-statement-routing.module';
import { AccountsMiniStatementComponent } from './accounts-mini-statement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonOtpPopupModulePopup } from '../../../common-otpPopup/common-otp.module';


@NgModule({
  declarations: [
    AccountsMiniStatementComponent,
  ],
  imports: [
    CommonModule,
    AccountsMiniStatementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonOtpPopupModulePopup
  ],
 
})
export class AccountsMiniStatementModule { }
