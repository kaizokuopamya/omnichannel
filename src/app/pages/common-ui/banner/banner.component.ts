import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  constructor(private router: Router){

  }

  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
}
