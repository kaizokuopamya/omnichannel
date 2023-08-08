import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationStepsComponent } from './registration-steps.component';

const routes: Routes = [
  {
    path:'',
    component: RegistrationStepsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationStepsRoutingModule { }
