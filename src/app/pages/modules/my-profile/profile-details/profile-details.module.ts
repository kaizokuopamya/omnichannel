import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDetailsRoutingModule } from './profile-details-routing.module';
import { ProfileDetailsComponent } from './profile-details.component';
import { CommonOtpPopupModulePopup } from '../../common-otpPopup/common-otp.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../../../../shared/shared.module';
import {ProfileEditModule} from '../profile-edit/profile-edit.module';
import {ProfileImgModule} from '../profile-img/profile-img.module'

@NgModule({
  declarations: [
    ProfileDetailsComponent
  ],
  imports: [
    CommonModule,
    CommonOtpPopupModulePopup,
    ProfileDetailsRoutingModule,
    CarouselModule,ProfileImgModule,
    FormsModule,SharedModule,
    ReactiveFormsModule ,
    ProfileEditModule
  ]
})
export class ProfileDetailsModule { }
