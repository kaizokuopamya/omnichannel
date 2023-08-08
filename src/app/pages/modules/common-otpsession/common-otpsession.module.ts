import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonOtpsessionRoutingModule } from './common-otpsession-routing.module';
import { CommonOtpsessionComponent } from './common-otpsession.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CommonOtpsessionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonOtpsessionRoutingModule
  ]
})
export class CommonOtpsessionModule { }
