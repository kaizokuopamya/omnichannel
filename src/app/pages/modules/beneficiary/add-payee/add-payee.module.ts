import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPayeeRoutingModule } from './add-payee-routing.module';
import { AddPayeeComponent } from './add-payee.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddPayeeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AddPayeeRoutingModule
  ]
})
export class AddPayeeModule { }
