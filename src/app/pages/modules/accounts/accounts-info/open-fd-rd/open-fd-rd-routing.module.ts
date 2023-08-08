import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenFdRdComponent } from './open-fd-rd.component';

const routes: Routes = [
  { path : '', component : OpenFdRdComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenFdRdRoutingModule { }
