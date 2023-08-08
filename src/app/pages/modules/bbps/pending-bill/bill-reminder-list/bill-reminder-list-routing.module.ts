import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{BillReminderListComponent} from './bill-reminder-list.component'
const routes: Routes = [ { path :'', component : BillReminderListComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillReminderListRoutingModule { }
