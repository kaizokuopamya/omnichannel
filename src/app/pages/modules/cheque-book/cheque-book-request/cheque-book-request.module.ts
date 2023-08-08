import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeBookRequestRoutingModule } from './cheque-book-request-routing.module';
import { ChequeBookRequestComponent } from './cheque-book-request.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChequeBookRequestComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ChequeBookRequestRoutingModule
  ]
})
export class ChequeBookRequestModule { }
