import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileEditComponent } from './profile-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import {ProfileImgModule} from '../profile-img/profile-img.module'
import {ProfileEditRoutingModule} from './profile-edit-routing.module'
import { CommonOtpPopupModulePopup } from '../../common-otpPopup/common-otp.module';
import  {CommonOtpEmailPopupModule} from '../../common-otp-email-popup/common-otp-email-popup.module'

@NgModule({
  declarations: [ProfileEditComponent],
  imports: [
    CommonModule,
    FormsModule,CommonOtpEmailPopupModule,
    ReactiveFormsModule,CommonOtpPopupModulePopup,
    SharedModule,ProfileImgModule,
    ProfileEditRoutingModule

  ],
  exports:[ProfileEditComponent]
})
export class ProfileEditModule { }
