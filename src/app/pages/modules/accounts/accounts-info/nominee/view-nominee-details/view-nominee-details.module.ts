import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewNomineeDetailsRoutingModule } from './view-nominee-details-routing.module';
import { ViewNomineeDetailsComponent } from './view-nominee-details.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';


@NgModule({
  declarations: [
    ViewNomineeDetailsComponent
  ],
  imports: [
    CommonModule,
    ViewNomineeDetailsRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class ViewNomineeDetailsModule { }
