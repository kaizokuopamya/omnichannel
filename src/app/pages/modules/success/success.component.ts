import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(
    private router: Router,
    public dataService: DataService,
    public location: Location,
    private constant: AppConstants,
  ) { }


  ngOnInit(): void {

    var route = this.constant.getPlatform() == 'web' ? "login" : "loginMobile"
    history.pushState({}, route, this.location.prepareExternalUrl(route));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    //this.DataService.changeMessage(this.commonPageComponent);
  }

  goToPage(routeName) {
    if (routeName == "login") {
      if (this.constant.getPlatform() == 'web') {
        routeName = "login";
      }
      else {
        routeName = "loginMobile";
      }
    }
    this.router.navigateByUrl('/'+routeName);
  }
}