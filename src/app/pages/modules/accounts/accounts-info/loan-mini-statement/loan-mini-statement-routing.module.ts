import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanMiniStatementComponent } from './loan-mini-statement.component';

const routes: Routes = [
  { path : '', component : LoanMiniStatementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanMiniStatementRoutingModule { }
