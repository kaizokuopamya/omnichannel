import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplaintListRoutingModule } from './complaint-list-routing.module';
import { ComplaintListComponent } from './complaint-list.component';

import { SharedModule } from './../../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    ComplaintListComponent
  ],
  imports: [
    CommonModule,
    ComplaintListRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ComplaintListModule { }
