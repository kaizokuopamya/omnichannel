import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StopChequeComponent } from './stop-cheque.component';

const routes: Routes = [{path:'', component:StopChequeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopChequeRoutingModule { }
