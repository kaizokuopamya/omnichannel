import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyChequeBookRoutingModule } from './my-cheque-book-routing.module';
import { MyChequeBookComponent } from './my-cheque-book.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyChequeBookComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MyChequeBookRoutingModule
  ]
})
export class MyChequeBookModule { }
