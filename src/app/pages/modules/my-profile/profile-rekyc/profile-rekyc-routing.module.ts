import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileRekycComponent } from './profile-rekyc.component';


const routes: Routes = [{path: '', component: ProfileRekycComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRekycRoutingModule { } 
