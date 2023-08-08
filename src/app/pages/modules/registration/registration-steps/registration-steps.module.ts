import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationStepsRoutingModule } from './registration-steps-routing.module';
import { RegistrationStepsComponent } from './registration-steps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationCustDetailsComponent } from '../registration-cust-details/registration-cust-details.component';
import { RegistrationValidateRegDetailsComponent } from '../registration-validate-reg-details/registration-validate-reg-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonOtpPopupModulePopup } from 'src/app/pages/modules/common-otpPopup/common-otp.module';
import { RegistrationUsernameComponent } from '../registration-username/registration-username.component';
import { RegistrationMpinComponent } from '../registration-mpin/registration-mpin.component';
import { RegistrationTpinComponent } from '../registration-tpin/registration-tpin.component';
import { TermsConditionsModule } from '../../more-services/terms-conditions/terms-conditions.module';

@NgModule({
  declarations: [
    RegistrationStepsComponent,
    RegistrationCustDetailsComponent,
    RegistrationValidateRegDetailsComponent,
    RegistrationUsernameComponent,
    RegistrationMpinComponent,
    RegistrationTpinComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonOtpPopupModulePopup,
    TermsConditionsModule,
    RegistrationStepsRoutingModule
  ]
})
export class RegistrationStepsModule { }
