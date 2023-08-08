import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityUpdateRoutingModule } from './security-update-routing.module';
import { SecurityUpdateComponent } from './security-update.component';
import { CommonOtpPopupModulePopup } from '../../common-otpPopup/common-otp.module';
import {ProfileImgModule} from '../profile-img/profile-img.module'

@NgModule({
  declarations: [
    SecurityUpdateComponent ],
  imports: [
    CommonModule,
    CommonOtpPopupModulePopup,
    ProfileImgModule,
    SecurityUpdateRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
 
  ]
})
export class SecurityUpdateModule { }
