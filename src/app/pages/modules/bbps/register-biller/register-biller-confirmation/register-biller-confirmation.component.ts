import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { AppConstants } from '../../../../../app.constant';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import {  Location } from '@angular/common';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import {RegisterBillerConfirmationService} from './register-biller-confirmation.service'
import { CommonMethods } from '../../../../../services/common-methods';
@Component({
  selector: 'app-register-biller-confirmation',
  templateUrl: './register-biller-confirmation.component.html',
  styleUrls: ['./register-biller-confirmation.component.scss']
})
export class RegisterBillerConfirmationComponent implements OnInit  ,OnDestroy{
  
  constructor( private router:Router,
   
    public registerBillerConfirmationService: RegisterBillerConfirmationService,
   
    public DataService: DataService , 
    private constant: AppConstants,
   public location: Location,
    private storage: LocalStorageService,
    private http: HttpRestApiService,
    public commonMethods: CommonMethods,) { }
  confirmArray = this.DataService.newBillerArray;
  respStatus
  newBillerRegistraionResponse
  responseMsg
  ngOnInit(): void {
    this.DataService.isbbpsPage = true
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : this.DataService.breadcrumblist[this.DataService.breadcrumblist.length - 2].routeName
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  } 
  registernewBiller(){

    var requiredData = JSON.stringify(this.confirmArray.auth)
    var platform = this.confirmArray.platform
    var formValue = this.confirmArray.formValues
    var billerId = this.confirmArray.billerId
    let newBillerParam = this.registerBillerConfirmationService.registerNewBiller(requiredData , platform , formValue , billerId);
      console.log("newBillerParam" + JSON.stringify(newBillerParam))
      this.http.callBankingAPIService(newBillerParam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
      console.log("sanal ==> " + JSON.parse(data.responseParameter.bbpsResponse));
      this.DataService.newBillerRegistraionResponse = data
      this.goToPage('retailRegisterBillerSuccess')
    });
  }

}
