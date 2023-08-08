
import { DomSanitizer } from '@angular/platform-browser';
import { CommonMethods } from 'src/app/services/common-methods';
import { Component, EventEmitter, Injector, Input, NgZone, OnDestroy, OnInit, Output, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataService } from 'src/app/services/data.service';
import { AppConstants } from 'src/app/app.constant';
import {ProfileImgService} from './profile-img.service'
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { Location } from '@angular/common';
@Component({
  selector: 'app-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss']
})
export class ProfileImgComponent  implements OnInit  {
  platform:any = 'web';
  custName: any;
  emailId = "";
  communicationAdd= ''
  userName:any;
  lastLogin: any;
  @Output() navOutput: EventEmitter<string> = new EventEmitter();
  constructor(
     public constant: AppConstants,
     private router: Router,
     private profileImgService: ProfileImgService,
    public dataService: DataService,
     private storage: LocalStorageService,
     private http: HttpRestApiService,
    // private profileDtlsService: ProfileDetailsService,
     private domSanitizer: DomSanitizer,
     private commonMethod: CommonMethods,
    // private pluginService: PluginService,
    // private ngZone: NgZone,
     private location: Location,

     ){}
  selectImage(){
    this.commonMethod.openPopup('div.popup-bottom.profile-dtl');
  }



  ngOnInit() {
    this.lastLogin = this.dataService.isCordovaAvailable ?  this.dataService.userDetails.mobileLastLogin  :  this.dataService.userDetails?.webLastLogin;
   this.custName = this.dataService.userDetails?.customerName;
  }
  goToResetTpin(route) {
    this.router.navigateByUrl('/'+ route);
  }

  goToPage(routeName, routeType) {
    this.dataService.profileTabSelection = routeType;
    if(this.router.url != "/" +routeName){
      this.router.navigateByUrl('/' + routeName);
    }else{
      this.navOutput.emit(routeType);
    }
    
    console.log("Tab Selection in Profile details :: ", routeType)

   
  }

  uploadImage(event) {
    var self = this;
    this.dataService.emailIdProfile = self.emailId
    this.dataService.communicationAddress = self.communicationAdd
    console.log(event);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // console.log(reader.result);
      var profileImage = reader.result;
      // var param = self.profileDtlsService.getProfileImageParam(self.emailId, self.userName, self.communicationAdd, profileImage);
      // self.dataService.request = param;
      // self.dataService.endPoint = self.constant.serviceName_CUSTPROFILEUPDATE;
      // self.dataService.authorizeHeader = "Profile Update";
      // self.dataService.screenType = 'profileUpdate';
      // this.router.navigate(['/otpSession']);
      var param = self.profileImgService.getProfileImageParam(self.emailId, self.userName, self.communicationAdd, profileImage);
      self.http.callBankingAPIService(param, self.storage.getLocalStorage(self.constant.storage_deviceId), self.constant.serviceName_CUSTPROFILEIMGUPDATE).subscribe(data => {
        var resp = data.responseParameter
        if (resp.opstatus == "00") {
          self.dataService.profileImage = reader.result;
        } else {
        }
      });
    };
  }
}
