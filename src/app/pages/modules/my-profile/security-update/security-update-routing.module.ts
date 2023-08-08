import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecurityUpdateComponent} from './security-update.component'
const routes: Routes = [{
  path:'', component:SecurityUpdateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityUpdateRoutingModule { }
