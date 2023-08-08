import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocateUsComponent } from './locate-us.component';

const routes: Routes = [{path:'',component:LocateUsComponent  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocateUsRoutingModule { }
