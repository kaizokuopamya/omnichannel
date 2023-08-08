import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddModifyNomineeComponent } from './add-modify-nominee.component';

const routes: Routes = [
  { path : '', component : AddModifyNomineeComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddModifyNomineeRoutingModule { }
