import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavouritePayeeComponent } from './favourite-payee.component';

const routes: Routes = [{path:'',component:FavouritePayeeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavouritePayeeRoutingModule { }
