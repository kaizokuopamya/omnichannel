import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewNomineeDetailsComponent } from './view-nominee-details.component';

const routes: Routes = [
  { path : '', component : ViewNomineeDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNomineeDetailsRoutingModule { }
