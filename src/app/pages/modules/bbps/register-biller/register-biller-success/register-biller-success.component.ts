import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConstants } from '../../../../../app.constant';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { DataService } from 'src/app/services/data.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import {RegisterBillerSuccessService} from './register-biller-success.service'
import { CommonMethods } from '../../../../../services/common-methods';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-register-biller-success',
  templateUrl: './register-biller-success.component.html',
  styleUrls: ['./register-biller-success.component.scss']
})
export class RegisterBillerSuccessComponent implements OnInit , OnDestroy{
  responseMsg:any
  respStatus :any 
  newBillerRegistraionResponse:any;
  constructor( 
    private router:Router,
   
     public registerBillerSuccessService: RegisterBillerSuccessService,
    
     public DataService: DataService , 
     private constant: AppConstants,
     private location: Location,
     private storage: LocalStorageService,
     private http: HttpRestApiService,
     public commonMethods: CommonMethods,
     ) { }
     billerCategory:any
      confirmArray = this.DataService.newBillerArray;
      
  ngOnInit(): void {

    this.DataService.allregisteredBillerList = []
    console.log("confirmArrayconfirmArray" + JSON.stringify(this.confirmArray))
   

    history.pushState({}, 'retailRechargeBillPay', this.location.prepareExternalUrl('retailRechargeBillPay'));
    history.pushState({},'self',this.location.prepareExternalUrl(this.router.url));


    this.DataService.isbbpsPage = true
    var data = this.DataService.newBillerRegistraionResponse

    console.log('newBillerRegistraionResponse ' + JSON.stringify(this.newBillerRegistraionResponse))
    var resp = data.responseParameter;
      this.respStatus = resp.Result
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        
          this.newBillerRegistraionResponse =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
         // this.existingBillerDetails = JSON.parse(this.existingBillerDetails)
         console.log('  this.existingBillerDetails ===> ' +   JSON.stringify(this.newBillerRegistraionResponse))
        //  this.commonMethods.openPopup('.successpopup')
        this.responseMsg = "Biller added successfully "
        this.goToPage('retailRegisterBillerSuccess')
      }
      else if (resp.opstatus == "01") {
        this.responseMsg = JSON.parse(data.responseParameter.bbpsResponse).msg
        console.log("errorMsg" +  JSON.stringify(this.responseMsg))
      }
      else {
      ///  this.errorCallBack(data.subActionId, resp);
      }
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  } 


}
