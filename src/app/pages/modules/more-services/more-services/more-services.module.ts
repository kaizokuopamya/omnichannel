import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoreServicesRoutingModule } from './more-services-routing.module';
import { MoreServicesComponent } from './more-services.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TermsConditionsModule } from '../terms-conditions/terms-conditions.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MoreServicesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
   TermsConditionsModule,
   MoreServicesRoutingModule
  ],
  exports:[
    MoreServicesComponent,
  ]
})
export class MoreServicesModule { }
