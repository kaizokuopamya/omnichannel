import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonOtpRoutingModule } from './common-otp-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonOtpPopupComponent } from './common-otp.component';


@NgModule({
  declarations: [
    CommonOtpPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CommonOtpRoutingModule
  ],
  exports: [CommonOtpPopupComponent] 
})
export class CommonOtpPopupModulePopup { }
