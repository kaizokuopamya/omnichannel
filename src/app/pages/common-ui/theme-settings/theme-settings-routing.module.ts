import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeSettingsComponent } from './theme-settings.component';

const routes: Routes = [{ path: '', component: ThemeSettingsComponent }]; // add sk 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeSettingsRoutingModule { }
