import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsDetailedStatementComponent } from './accounts-detailed-statement.component';

const routes: Routes = [
  { path : '', component : AccountsDetailedStatementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsDetailedStatementRoutingModule { }
