import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoreServicesComponent } from './more-services.component';

const routes: Routes = [{path:'',component:MoreServicesComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoreServicesRoutingModule { }
