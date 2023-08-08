import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageChangeComponent } from './language-change.component';

const routes: Routes = [{path:'', component:LanguageChangeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguageChangeRoutingModule { }
