import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import  {ProfileRekycRoutingModule} from './profile-rekyc-routing.module';
import { ProfileRekycComponent } from './profile-rekyc.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../../../../shared/shared.module';
// import { CommonModules } from 'src/app/common-ui/common.module';

@NgModule({
  declarations: [ProfileRekycComponent],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    ReactiveFormsModule,
    ProfileRekycRoutingModule,
    SharedModule,
   // CommonModules
  ],
  exports:[
    ProfileRekycComponent
  ]
})
export class ProfileRekycModule { } 
