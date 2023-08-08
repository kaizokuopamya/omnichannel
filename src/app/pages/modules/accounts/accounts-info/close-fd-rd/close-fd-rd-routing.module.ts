import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CloseFdRdComponent } from './close-fd-rd.component';

const routes: Routes = [
   { path : '', component : CloseFdRdComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloseFdRdRoutingModule { }
