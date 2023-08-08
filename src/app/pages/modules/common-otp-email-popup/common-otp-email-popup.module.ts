import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonOtpEmailPopupComponent} from './common-otp-email-popup.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CommonOtpEmailPopupComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule, SharedModule
  ],
  exports: [CommonOtpEmailPopupComponent]
})
export class CommonOtpEmailPopupModule { }
