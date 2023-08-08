import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsMiniStatementComponent } from './accounts-mini-statement.component';

const routes: Routes = [
  { path : '', component : AccountsMiniStatementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsMiniStatementRoutingModule { }
