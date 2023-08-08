import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Location } from '@angular/common';
import { RegistrationCustDetailsComponent } from '../registration-cust-details/registration-cust-details.component';
import { REGISTRATIONOTPINPUTMESSAGE, REGISTRATIONSTEP } from './registration-steps.model';
import { RegistrationStepper } from 'src/app/model/registrationsteps.model';
import { commonOtpModel } from 'src/app/model/common.model';
import {DataService} from 'src/app/services/data.service'
import { TermsConditonsComponent } from '../../more-services/terms-conditions/terms-conditions.component';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-registration-steps',
  templateUrl: './registration-steps.component.html',
  styleUrls: ['./registration-steps.component.scss']
})
export class RegistrationStepsComponent implements OnInit  {
  @ViewChild(RegistrationCustDetailsComponent ) child: RegistrationCustDetailsComponent ;
  @ViewChild(TermsConditonsComponent) childTermsReg: TermsConditonsComponent;

  activeTab = "step1"
  curentTabIndex = 1;
  termsCondition : any = '';
  otpstart:boolean = false;
  termsConditionPopUp = false;
  registrationsteps:RegistrationStepper[] = REGISTRATIONSTEP;
  OTPInputMessage:commonOtpModel = REGISTRATIONOTPINPUTMESSAGE;

  
  ngOnInit(): void {


    console.log("inner")
  }

 constructor(
    private router: Router,
    private DataService: DataService,
    // private otpService : OtpAPIService,
    private http: HttpRestApiService,
    private constant: AppConstants,
    public localStorage: LocalStorageService,
    // private regServices: RegistrationCustDetailsService,
    public commonMethod: CommonMethods,
    private location: Location,
    public translate : TranslatePipe,
    ) { }

  
    mobPrevclick(type?) {
      if(type != undefined && type == 'cross'){
        this.router.navigateByUrl('/registrationMobCheck');
      }
      else{
        if(this.constant.getPlatform() == "web"){
          this.router.navigateByUrl('/nliLanding');
        }
        else{
          this.router.navigateByUrl('/LandingPage');
        }
      }
  
    }


    prevstep(step) {

      let stepindex = step - 2
      console.log(stepindex)
      this.registrationsteps[stepindex].stepActive = true
      this.registrationsteps[stepindex + 1].stepActive = false
      this.activeTab = "step" + (step - 1)
      console.log(step)
      this.curentTabIndex = step - 1
  
    }



     

   openOtp(data){
    console.log(data,"open in cononsle")
    if(data=="open"){
      this.OTPInputMessage.subHeaderMsg = this.translate.transform('PLEASE_ENTER_SIX_DIGIT_MOBILE_OTP') +' '+ this.DataService.maskRegisternumber;
      this.OTPInputMessage.mobStaticEncKey = this.DataService.mobStaticEncKey;
      this.otpstart=true;
    }
   }
  
    nextstep(step) {
      console.log(step);
      let stepindex = step - 1
      console.log(stepindex)
  
      if( (this.DataService.regType == 'loan' || this.DataService.regType == 'nri' )){
        if((step + 1) > 4){
          stepindex = step - 2
        }
        this.registrationsteps[stepindex].stepStatus = "completed"
        this.registrationsteps[stepindex].stepActive = false
        this.registrationsteps[stepindex + 1].stepActive = true
        if (this.registrationsteps[stepindex + 1].stepStatus != "completed") {
          this.registrationsteps[stepindex + 1].stepStatus = "inprogress"
        }
        if((step + 1) == 4){
          this.activeTab = "step" + (step + 2)
        }
        else{
          this.activeTab = "step" + (step + 1)
        }
  
      }
      else{
        this.registrationsteps[stepindex].stepStatus = "completed"
        this.registrationsteps[stepindex].stepActive = false
        this.registrationsteps[stepindex + 1].stepActive = true
        if (this.registrationsteps[stepindex + 1].stepStatus != "completed") {
          this.registrationsteps[stepindex + 1].stepStatus = "inprogress"
        }
        this.activeTab = "step" + (step + 1)
      }
  
      this.curentTabIndex = step + 1
      console.log(this.curentTabIndex)
    }



    GetOtpPopData(data){
      var resp = data.responseParameter;
      if (resp.opstatus == '00') {

        console.log("data passing properly")
        this.otpstart = false;
        this.DataService.headerType = 'innerHeader'
        // this.getProfileDtl();
        if( this.DataService.gotpage){
          this.DataService.routeWithNgZone(this.DataService.gotpage);
        }else{
          //this.dataService.routeWithNgZone('dashboardMobile');
          this.nextstep(1);
          // this.DataService.routeWithNgZone('dashboard');
        }
      }else {
        this.otpstart = false;
      }
   }
  backToPrevPage(){
    this.location.back() ;
}

termsConditionPopup(event){
  this.termsConditionPopUp = true;
  this.termsCondition =''
  this.termsCondition = event ;
  console.log("registration steps :: ", event)
  this.childTermsReg.openPopupTerms() ;
}
}
