import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkAccountComponent } from './link-account.component';

const routes: Routes = [{path: '', component: LinkAccountComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkAccountRoutingModule { }
