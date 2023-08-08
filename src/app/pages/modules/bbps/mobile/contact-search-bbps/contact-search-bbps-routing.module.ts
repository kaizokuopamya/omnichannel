import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContactSearchBbpsComponent} from './contact-search-bbps.component'
const routes: Routes = [{path:'', component:ContactSearchBbpsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactSearchBbpsRoutingModule { }
