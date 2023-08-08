import { Component, OnInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { CommonOtpEmailPopupService } from './common-otp-email-popup.service';
import { DatePipe } from '@angular/common';
import { commonOtEmailpModel } from 'src/app/model/common.model';
@Component({
  selector: 'app-common-otp-email-popup',
  templateUrl: './common-otp-email-popup.component.html',
  styleUrls: ['./common-otp-email-popup.component.scss']
})
export class CommonOtpEmailPopupComponent {
  @ViewChildren('mobileOTPRow') mobileOTPRows: any;
  @ViewChildren('emailOTPRow') emailOTPRows: any;
  @Output() otpEmailPopOutput: EventEmitter<string> = new EventEmitter();
  @Input() otpEmailModel: commonOtEmailpModel;

  maskedMobileNo: any;
  otpfailMsg:any;
  loopLength = 6
  mobileInput:any =[]
  emailInput:any = []
  maskedEmailId: any;
  countDown: Subscription;
  mobileCountDown: Subscription;
  counter = 120 ;
  mobileCounter = 120 ;
  tick = 1000;
  receivedEmailId

  otpForm: FormGroup;
  constructor(
    private router: Router,
    private formValidation: FormValidationService,
    private form: FormBuilder,
    public dataService: DataService,
    private http: HttpRestApiService,
    public constant: AppConstants,
    private storage: LocalStorageService,
    public commonMethod: CommonMethods,
    public translate: TranslatePipe,
    public loader: pageLoaderService,
    public commonOtpEmailPopupService: CommonOtpEmailPopupService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit() {


    this.maskedMobileNo = this.maskCharacter(this.storage.getLocalStorage(this.constant.storage_mobileNo), 4);
    this.buildForm()
    this.commonMethod.openPopup('div.otp-email-popup');
    this.receivedEmailId = this.otpEmailModel.emailAddress
    this.maskedEmailId = this.maskCharacter(this.receivedEmailId, 12);
    this.getResendLeadsOtpSession('all')
  }


  getResendLeadsOtpSession(type) {
    var reqParam = this.commonOtpEmailPopupService.getResendLeadsOtpSessionCall(this.receivedEmailId, type);
    this.http.callBankingAPIService(reqParam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_RESENDLEADSOTPSESSION).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {

        this.counter = 120;
        this.mobileCounter = 120;
        this.tick = 1000;
        this.startCounter();
        this.startMobileCounter();
        
      }
    })
  }
buildForm() {
  var formdetails = []
  this.mobileInput = []
  this.emailInput = []
    for(var i = 0;i <this.loopLength;i++){
      this.mobileInput.push('mobile' + (i+1))
      this.emailInput.push("email" +(i+1) )
      formdetails.push(
        { "fieldName" : "mobile" + (i+1),"minLength": 1, "maxLength":1 , "required" :"Y" },
        { "fieldName" : "email"+ (i+1) ,"minLength": 1, "maxLength":1 , "required" :"Y" }
        )
    }
    this.otpForm = this.dataService.buildForm(formdetails)  
  }
 
  resendOTPLink(type) {


    var resendOTPReq = this.commonOtpEmailPopupService.getResendLeadsOtpSessionCall(this.receivedEmailId, type);
    this.http
    .callBankingAPIService(
      resendOTPReq,
      this.storage.getLocalStorage(this.constant.storage_deviceId),
      this.constant.serviceName_RESENDLEADSOTPSESSION
    )
    .subscribe((data) => {
      var resp = data.responseParameter;
      if (data.responseParameter.opstatus == '00') {
       // showToastMessage(resp.Result, 'success');

        if(type == 'email') {
          this.counter = 120;
          this.startCounter();
          for(var i = 0 ; i < this.loopLength; i++){
            this.otpForm.get('email' + (i + 1)).reset();
          }
         
        }
        else if(type == 'mobile') {
          this.mobileCounter = 120;
          this.startMobileCounter();
          for(var i = 0 ; i < this.loopLength; i++){
            this.otpForm.get('mobile' + (i + 1)).reset();
          }
         
        }
      }
      else {
        //showToastMessage(data.responseParameter.Result, 'error');
      }
    });
  }



  validateOtp() {
    if (this.otpForm.valid) {
      var mobileOtp = ''
      var emailOtp = ''
      var endpoint = this.otpEmailModel.otpValidateEndpoint? this.otpEmailModel.otpValidateEndpoint : this.constant.serviceName_VALIDATELEADSOTPSESSION
      for(var i =0 ;i < this.loopLength; i++ ){
        mobileOtp = mobileOtp +  this.otpForm.get("mobile" + (i + 1)).value
        emailOtp = emailOtp +  this.otpForm.get("email" + (i + 1)).value
      }
        var param
        if(this.otpEmailModel.params){
          param  = this.commonOtpEmailPopupService.getValidateLeadsOtpSessionCallCUSTOM(mobileOtp, emailOtp, this.otpEmailModel.params);
       }else{
          var rrnNo = this.commonMethod.genRandomDigit(9);
          param  = this.commonOtpEmailPopupService.getValidateLeadsOtpSessionCall(mobileOtp, emailOtp, this.receivedEmailId , rrnNo);


        }
    
      
      this.http.callBankingAPIService( param, this.storage.getLocalStorage(this.constant.storage_deviceId), endpoint).subscribe((data) => {
        console.log('=====validate otp=====', data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
         
          console.log(data.responseParameter);
          this.otpEmailPopOutput.emit(data);
            this.commonMethod.closePopup('div.otp-popuplimit.commonOTP');
            this.otpfailMsg = "";
        }
        else {
          this.otpfailMsg = resp.Result;
        }
        this.otpForm.reset();
      });
    }
  }


  startCounter(){
    this.counter = 120;
    if (this.countDown  && !this.countDown.closed) { this.countDown.unsubscribe(); }
    this.countDown = timer(0, this.tick).subscribe(() => { if(this.counter == 1) this.countDown.unsubscribe(); --this.counter });
  }

  startMobileCounter() {
    this.mobileCounter = 120;
    if (this.mobileCountDown  && !this.mobileCountDown.closed) { this.mobileCountDown.unsubscribe(); }
    this.mobileCountDown = timer(0, this.tick).subscribe(() => { if(this.mobileCounter == 1) this.mobileCountDown.unsubscribe(); --this.mobileCounter });
  }


  maskCharacter(str, n) {

    return ('' + str).slice(0, -n).replace(/./g, 'X') + ('' + str).slice(-n);
  }

  closeOtpPopup(){
    this.otpEmailPopOutput.emit('closepop');
    this.commonMethod.closePopup('div.otp-email-popup');
    this.counter = 120;
    this.otpfailMsg = "";

  }


  onKeyUpEventOtp(index: any, event: any, type: any) {
    const eventCode = event.which || event.keyCode;

    if (this.getSpasswordElementOtp(index, type).value.length === 1) {
      if (index !== 6) {
        this.getSpasswordElementOtp(index + 1, type).focus();
      } else {
        this.getSpasswordElementOtp(index, type).blur();
        // Submit code
        console.log('submit code ');
      }
    }
    if (eventCode === 12 && index !== 1) {
      this.getSpasswordElementOtp(index - 1, type).focus();
    }
    if (eventCode === 8 || eventCode === 229) {
      if (event.key != "Unidentified") {
        if (type == 'mobile') {
          this.otpForm.get(this.mobileInput[index])?.setValue("");
        }
        else  if (type == 'email')
        {
          this.otpForm.get(this.emailInput[index])?.setValue("");
        }
        this.getSpasswordElementOtp(index - 1, type).focus();
      }
    }
  }

  onFocusEvent(index, type) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getSpasswordElementOtp(item, type);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getSpasswordElementOtp(index: any, type: any) {
    if (type == 'mobile') {
      return this.mobileOTPRows._results[index].nativeElement;
    }
    else{
      return this.emailOTPRows._results[index].nativeElement;
    }
  }

}
