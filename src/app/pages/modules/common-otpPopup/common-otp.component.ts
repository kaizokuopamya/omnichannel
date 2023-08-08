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
import { CommonOtpService } from './common-otp.service';
import { DatePipe } from '@angular/common';
import { commonOtpModel } from 'src/app/model/common.model';
declare var showToastMessage: any;

@Component({
  selector: 'app-common-otpPopup',
  templateUrl: './common-otp.component.html',
  styleUrls: ['./common-otp.component.scss']
})
export class CommonOtpPopupComponent implements OnInit {
  @ViewChildren("otpRow") otpRow: any;
  @ViewChildren('mobileOTPRow') mobileOTPRows: any;
  @Input() otpModel: commonOtpModel;

  @Output() otpPopOutput: EventEmitter<string> = new EventEmitter();
  outputMessage: string = "success";
  otpInput = [];
  mobileInput = [];
  otpFormLimit: FormGroup;
  counter = 120;
  capCounter = 180;
  countDown: Subscription;
  tick = 1000;
  loginAttemptCount: any;
  incorrectLogin: boolean = false;
  attempRemaining: any;
  attemptedTime: any;
  submitDisabled: boolean = false;
  isMaxAttempt: boolean = false;
  authType:any
  public formErrors = {
    otp: '',
  };
  otpfailMsg: any;
  loopLength:any
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
    public commonOtpService: CommonOtpService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.initialization();
    
  }
  initialization() {
    this.otpInput = []
    this.authType = this.otpModel.authType? this.otpModel.authType : "OTP"
    if(this.authType == "OTP"){
      this.loopLength = Number(this.dataService.otplength) 
    }else{
      this.loopLength = Number(this.dataService.tpinlength)
    }
    
    for(var i=0 ; i < this.loopLength ; i++){
      this.otpInput.push(this.authType + (i+1))
      this.mobileInput.push("mobile"  + (i+1))
  }
  
    this.otpFormLimit = this.buildForm(this.authType);
    this.commonMethod.openPopup('div.otp-popuplimit.commonOTP');

    if(this.authType == "OTP"){
      this.resendOtp(1);
    }
   
  }

  buildForm(type) {

    let form:any = {}
    for(let i = 0 ; i < this.dataService.otplength ; i++){
      form[ type + (i +1 )] = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ])
    }
    
    return  new FormGroup(form)
  }
  validateForm() {
    if (this.otpFormLimit.invalid) {
      for(let i = 0 ; i <  this.loopLength ; i++){
        this.otpFormLimit.get(this.authType + (i + 1)).markAsTouched();
      }
      this.formErrors = this.formValidation.validateForm(
        this.otpFormLimit,
        this.formErrors,
        true
      );
      return;
    }
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
          this.otpFormLimit.get(this.mobileInput[index])?.setValue("");
        }
        else if (type == 'otp') {
          this.otpFormLimit.get(this.otpInput[index])?.setValue("");
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
      return this.mobileOTPRows._results[index]?.nativeElement;
    }
    else if (type == 'otp') {
      return this.otpRow._results[index]?.nativeElement;
    }

  }
  startCounter() {
    this.counter = 120;
    if (this.countDown && !this.countDown.closed) {
      this.countDown.unsubscribe();
    }
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter == 1) this.countDown.unsubscribe();
      --this.counter;
    });
  }

  resendOtp(type) {
    //api call to get otp

    this.loader.showLoader();
    var otpParam = this.commonOtpService.getResendOTPReqParam(this.otpModel.serviceType);
    this.http
      .callBankingAPIService(
        otpParam,
        this.constant.deviceID,
        // this.storage.getLocalStorage("deviceId"),
        this.otpModel.otpSendEndpint ? this.otpModel.otpSendEndpint : this.constant.serviceName_RESENDOTP
      )
      .subscribe((data) => {
        var _resp = data.responseParameter;
        this.loader.hideLoader();
        if (_resp.opstatus == "00") {
          if (type == "resend") {
            showToastMessage(_resp.Result, "success");
          }
          this.counter = 120;
          this.tick = 1000;
          this.startCounter();
        }
        else {
          this.otpfailMsg = "";
          this.otpFormLimit.reset();
          if (_resp.Result) {
            this.otpfailMsg = _resp.Result;
          }
        }
      }, (error) => {
        this.otpfailMsg = "Error in send OTP service.";
        this.otpFormLimit.reset();
      });
  }

  validateOtpAddlimit() {
    var authValue = '';
    this.validateForm();
    console.log(this.otpFormLimit.value);
    if (this.otpFormLimit.valid) {
      for(var i = 0;i < this.dataService.otplength; i++ ){
        authValue = authValue +     this.otpFormLimit.get(this.authType + (i + 1)).value

      }
      var param;
      var requestRRN = this.commonMethod.genRandomDigit(9);
      console.log("this.otpModel.params =====>" ,this.otpModel.params)
      if(this.otpModel.params){
        param =  this.commonOtpService.getOTPVerificationCustomParam(this.otpModel.params , authValue.trim() ,this.otpModel.otpkeyName,  this.otpModel.mobStaticEncKey)
       
      }else{
       param = this.commonOtpService.getOTPVerificationParam(authValue.trim(), this.otpModel.serviceType,requestRRN,this.otpModel.mobStaticEncKey);
      }
      this.http.callBankingAPIService(
          param,
          this.storage.getLocalStorage("deviceId"),
          this.otpModel.otpValidateEndpoint ? this.otpModel.otpValidateEndpoint : this.constant.serviceName_VALIDATEOTP
        )
        .subscribe((data) => {
          console.log("=====validate otp=====", data);
          this.loader.hideLoader();

          var resp = data.responseParameter;
          if (resp.opstatus == "00") {
            console.log(data.responseParameter);
            this.storage.setSessionStorage("isLoggedIn", "true");
            this.otpPopOutput.emit(data);
            this.commonMethod.closePopup('div.otp-popuplimit.commonOTP');
            this.otpfailMsg = "";
            // this.closeOtpPopup();


          } else if (resp.opstatus == "03") {
            this.isMaxAttempt = true;
            this.counter = 0;
            this.otpfailMsg = resp.Result;
            this.otpFormLimit.reset();
          } else {
            this.otpfailMsg = resp.Result;
            this.otpFormLimit.reset();
          }
        }, (error) => {
          this.otpfailMsg = "Error in validate OTP service.";
          this.otpFormLimit.reset();
        });
      }
    
  }
  closeOtpPopup() {
    this.otpPopOutput.emit('closepop');
    this.commonMethod.closePopup('div.popup-bottom');
    this.otpFormLimit.reset();
    this.counter = 120;
    this.otpfailMsg = "";
  }


}
