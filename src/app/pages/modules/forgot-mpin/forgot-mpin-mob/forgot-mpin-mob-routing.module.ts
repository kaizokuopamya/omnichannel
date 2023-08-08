import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotMpinMobComponent } from './forgot-mpin-mob.component';

const routes: Routes = [{path:'',component:ForgotMpinMobComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotMpinMobRoutingModule { }
