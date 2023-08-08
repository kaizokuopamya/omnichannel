import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddModifyNomineeRoutingModule } from './add-modify-nominee-routing.module';
import { AddModifyNomineeComponent } from './add-modify-nominee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';



@NgModule({
  declarations: [
    AddModifyNomineeComponent
  ],
  imports: [
    CommonModule,
    AddModifyNomineeRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class AddModifyNomineeModule { }
