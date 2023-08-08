import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanMiniStatementRoutingModule } from './loan-mini-statement-routing.module';
import { LoanMiniStatementComponent } from './loan-mini-statement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoanMiniStatementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    LoanMiniStatementRoutingModule,

  ]
})
export class LoanMiniStatementModule { }
