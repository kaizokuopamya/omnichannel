import { Component, NgZone, OnInit, ViewChildren} from '@angular/core';
import { HttpRestApiService } from '../../../../services/http-rest-api.service';
import { AppConstants } from '../../../../app.constant';
import { DataService } from '../../../../services/data.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from '../../../../services/form-validation.service';
import { ProfileRekycService } from './profile-rekyc.service';
//import { PluginService } from 'src/app/services/plugin-service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { timer, Subscription } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
//import { OtpSessionService } from '../../../../otp-session/otp-session.service';
declare var showToastMessage: any;
declare var $: any;
declare var cordova:any;

@Component({
  selector: 'app-profile-rekyc',
  templateUrl: './profile-rekyc.component.html',
  styleUrls: ['./profile-rekyc.component.scss']
})
export class ProfileRekycComponent implements OnInit {

  selectedKycOption : string = 'yes';
  isTermsEnabled: boolean = false;
  counter = 120;
  tick = 1000;
  countDown: Subscription;
  invalidOtp: boolean =false;
  otpfailMsg:string = "";
  otpSessionForm: FormGroup;
  public formErrors = {
    otp: '',
  };
  otpFormInput = ['otp1', 'otp2', 'otp3', 'otp4','otp5','otp6'] ;
  @ViewChildren('OTPFormRow') otpPinRows: any;

  constructor(
    private form: FormBuilder,
    public constant: AppConstants,
    private router: Router,
    public dataService: DataService,
    private storage: LocalStorageService ,
    private formValidation: FormValidationService,
    private http: HttpRestApiService,
   // private pluginService : PluginService,
    private commonMethod:CommonMethods,
    private encryptDecryptService: EncryptDecryptService,
    private ngZone:NgZone,
    private domSanitizer : DomSanitizer,
    private idle: Idle,
    public translatePipe : TranslatePipe,
    public profileRekycService : ProfileRekycService,
  
    ) { }


  ngOnInit() {
   
     if(this.constant.getPlatform() == "web"){
       this.dataService.getBreadcrumb('REKYC', this.router.url);
     }
    this.buildForm();
  }

  buildForm(){
    this.otpSessionForm = new FormGroup({
      otp1: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otp2: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otp3: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otp4: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otp5: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otp6: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
    });
  }

  validateForm() {
    if (this.otpSessionForm.invalid) {
      this.otpSessionForm.get('otp1').markAsTouched();
      this.otpSessionForm.get('otp2').markAsTouched();
      this.otpSessionForm.get('otp3').markAsTouched();
      this.otpSessionForm.get('otp4').markAsTouched();
      this.otpSessionForm.get('otp5').markAsTouched();
      this.otpSessionForm.get('otp6').markAsTouched();
      this.formErrors = this.formValidation.validateForm(
        this.otpSessionForm,
        this.formErrors,
        true
      );
      return;
    }
  }

  onProceed(){
    console.log(this.selectedKycOption);
    console.log(this.isTermsEnabled);
    this.otpfailMsg = "";
    this.otpSessionForm.reset();
    this.commonMethod.openPopup('div.popup-bottom.otp-popup');
    this.otpApiCall();

    // switch (this.dataService.otpName) {
    //   case 'TPIN':
    //     this.commonMethod.openPopup('div.popup-bottom.tpin-popup');
    //     break;
    //   default:
    //     this.commonMethod.openPopup('div.popup-bottom.otp-popup');
    //     this.otpApiCall();
    //     break;
    // }
  }

  otpApiCall(){
    this.resendOTP();
    this.startCounter();
  }

  startCounter() {
    this.tick = 1000;
    this.counter = 120;
    if (this.countDown && !this.countDown.closed) {
      this.countDown.unsubscribe();
    }
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter == 1) this.countDown.unsubscribe();
      --this.counter;
    });
  }

  kycAddressChange(){
    this.isTermsEnabled = false;
  }


  submitKycStatus(){
    this.validateForm();
    console.log(this.otpSessionForm.value);
    if (this.otpSessionForm.valid) {
      var otpValue = this.otpSessionForm.value.otp1 + this.otpSessionForm.value.otp2 + this.otpSessionForm.value.otp3 + this.otpSessionForm.value.otp4 + this.otpSessionForm.value.otp5 + this.otpSessionForm.value.otp6;

      var param = this.profileRekycService.getUpdateReKycParam(this.storage.getLocalStorage(this.constant.storage_username),this.dataService.userDetails.cifNumber,this.selectedKycOption,otpValue);
      this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_RECORDCUSTREKYCSTATUS).subscribe(data=>{
        console.log(data);
        var resp = data.responseParameter
        if (resp.opstatus == "00") {
          this.commonMethod.closePopup('div.popup-bottom.otp-popup');
          this.otpSessionForm.reset();
          this.otpfailMsg = "";
          if(this.selectedKycOption == 'no'){
            this.commonMethod.openPopup('div.popup-bottom.success-popup');
          }
          else{
            this.commonMethod.openPopup('div.popup-bottom.information-popup');
          }
        }else if(data.responseParameter.opstatus == "11"){
          var invalidAttempt: number = +data.responseParameter.invalidAttempts;
          this.otpfailMsg = (invalidAttempt).toString() + " of 3 unsuccessful attempts, Please try again";
          this.otpSessionForm.reset();
        }
        else {
          // this.errorCallBack(data.subActionId, resp);
            this.otpfailMsg =resp.Result
            this.otpSessionForm.reset();
        }
      });
    }
  }


  cancel(){
    this.router.navigate(['/profileDetails'], { replaceUrl: true });
  }

  closePopup(popup){
    switch(popup){
      case 'otp':
        this.commonMethod.closePopup('div.popup-bottom.otp-popup');
        break;
      case 'tpin':
        this.commonMethod.closePopup('div.popup-bottom.tpin-popup');
        break;
      case 'ReKycSuccess':
        this.commonMethod.closePopup('div.popup-bottom.success-popup');
        this.cancel();
        break;
      case 'ReKycBranch':
        this.commonMethod.closePopup('div.popup-bottom.information-popup');
        this.cancel();
        break;
    }
  }


  // OTP auto focus and auto move
  onKeyUpEvent(index: any, event: any, type: any) {

    console.log(index,event,type);

    const eventCode = event.which || event.keyCode;

    if (this.getSpasswordElement(index, type).value.length === 1) {
      if (index !== 7) {
        this.getSpasswordElement(index + 1, type).focus();
      } else {
        this.getSpasswordElement(index, type).blur();
        // Submit code
        console.log('submit code ');
      }
    }
    if (eventCode === 12 && index !== 1) {
      this.getSpasswordElement(index - 1, type).focus();
    }


    if (eventCode === 8 || eventCode === 229) {
      if (event.key != "Unidentified") {
        if (type == 'otp') {
          this.otpSessionForm.get(this.otpFormInput[index])?.setValue("");
        }
        this.getSpasswordElement(index - 1, type).focus();
      }
    }

  }

  onFocusEvent(index: any, type: any) {

    for (let item = 1; item < index; item++) {
      const currentElement = this.getSpasswordElement(item, type);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getSpasswordElement(index: any, type: any) {
    if (type == 'otp') {
      return this.otpPinRows._results[index].nativeElement;
    }
  }

  /**
   * call function for resend function
   */
   resendOTP(numCount?: any) {
    var otpUrl = this.constant.serviceName_RESENDOTPSESSION;
    this.invalidOtp = false;
    this.otpSessionForm.reset();
    var resendOTPReq =//this.otpSessionService.getResendOTPSessionReq("RECORDCUSTREKYCSTATUS");

    this.http
      .callBankingAPIService(
        resendOTPReq,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        otpUrl
      )
      .subscribe((data) => {
        if (data.responseParameter.opstatus == '00') {
          this.startCounter();
          if (numCount == 2)
            showToastMessage(data.responseParameter.Result, 'success');
        }
      });
   }

}


