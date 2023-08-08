import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, Route} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<any>();
  userProfile:boolean = false;
  routeArray:any = []
  flag:boolean = false;
  data: boolean = false;
  headerType:any="prelogin"
  constructor(private _router: Router,public dataService:DataService,private commonMethod: CommonMethods,) {
   
   }

  ngOnInit(): void {


    
  }



  toggleFullscreen(){
    var elem = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      elem.requestFullscreen();
    }
  }
  notify(){
    this.data=true;
  }

  addNewItem(value: any) {
    this.newItemEvent.emit(value);
  }

  goToPage(routeName){
    this._router.navigateByUrl(routeName);
  }

  logoutapp() {
    //pop up present in layout.component.ts
    this.commonMethod.openPopup('div.popup-bottom.logout-popup');
  }

  getNotification(){
  }
 
  openProfile(){

      this.goToPage("profile")

  }

  menuClick(){}
}
