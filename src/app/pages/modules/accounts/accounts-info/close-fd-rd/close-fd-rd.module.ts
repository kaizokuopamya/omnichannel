import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloseFdRdRoutingModule } from './close-fd-rd-routing.module';
import { CloseFdRdComponent } from './close-fd-rd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CloseFdRdComponent
  ],
  imports: [
    CommonModule,
    CloseFdRdRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CloseFdRdModule { }
