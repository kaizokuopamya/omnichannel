import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenFdRdRoutingModule } from './open-fd-rd-routing.module';
import { OpenFdRdComponent } from './open-fd-rd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE  } from 'ng-pick-datetime-ex';



@NgModule({
  declarations: [
    OpenFdRdComponent
  ],
  imports: [
    CommonModule,
    OpenFdRdRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class OpenFdRdModule { }
