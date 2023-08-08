import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import {DataService} from 'src/app/services/data.service'
import { RegistrationCustDetailsService } from './registration-cust-details.service';
import { RegistrationStepsComponent } from '../registration-steps/registration-steps.component';
import { OTPINPUTMESSAGE } from '../../login/login.model';
import { commonOtpModel } from 'src/app/model/common.model';
import { REGFEILDDATA } from 'src/app/model/common.model';

@Component({
  selector: 'app-registration-cust-details',
  templateUrl: './registration-cust-details.component.html',
  styleUrls: ['./registration-cust-details.component.scss']
})
export class RegistrationCustDetailsComponent implements OnInit {
  registrationFormCustDtl: FormGroup;
  termsCondition : any = '' ;
  otpstart:boolean = false;

  @Output() termsConditionEvent = new EventEmitter<number>();
  @Output() nextEvent = new EventEmitter<number>();
  @Output() otpgenerate: EventEmitter<string>= new EventEmitter();



  public formErrorsstep1 = {
    mobNumber: '',
    custId: '',
    accNo: ''
  };
  isReadOnly: any;

  accountNumberLen:any;

  OTPInputMessage:commonOtpModel = OTPINPUTMESSAGE;
  optgenerateData: string="open";



  constructor(private form: FormBuilder,
    private router: Router,
    public DataService: DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    private formValidation: FormValidationService,
    private constant: AppConstants,
     private regServices: RegistrationCustDetailsService,
    private localStorage: LocalStorageService,
    // private registrationService : RegistrationMobCheckService,
    // private otpAPIService : OtpAPIService,
    private commonMethods : CommonMethods,
     public regSteps: RegistrationStepsComponent,
    // private otpService : OtpAPIService
    ) { }

  ngOnInit(): void {
    //Set page common Components
    this.isReadOnly = this.constant.getPlatform();
    // this.DataService.changeMessage(this.commonPageComponent);
    this.setDefaultValue()
    this.buildForm();
    this.bindForm();
    console.log("inisede");
}



setDefaultValue(){
  this.DataService.regFeildData = REGFEILDDATA;
}
  buildForm() {
    this.accountNumberLen = this.constant.val_accountNumberLength;
    this.registrationFormCustDtl = new FormGroup({
      mobNumber: new FormControl('',[Validators.required, Validators.pattern(/^[6-9]\d{9}$/), Validators.minLength(10)]),
      custId: new FormControl('', [Validators.required,  Validators.maxLength(9)]),
      accNo: new FormControl('', [Validators.required, Validators.maxLength(14)]),
      email: new FormControl('', [Validators.pattern(this.constant.email_regex),Validators.required]),
      migrated: new FormControl(''),
      termCondition: new FormControl('', [Validators.required])
    })
    this.registrationFormCustDtl.valueChanges.subscribe((data) => {
      this.formErrorsstep1 = this.formValidation.validateForm(this.registrationFormCustDtl, this.formErrorsstep1, true);
    });
  }


  bindForm(){
    if(this.isReadOnly != 'web'){
      this.registrationFormCustDtl.patchValue({ mobNumber: this.localStorage.getLocalStorage(this.constant.storage_mobileNo)})
      if(this.DataService.selectedCif != undefined && this.DataService.selectedCif != null && this.DataService.selectedCif != '') this.registrationFormCustDtl.patchValue({ custId: this.DataService.selectedCif})
    }
  }

  testFunction(){
    this.nextEvent.next(this.DataService.regIsAtStep);
  }

  cancel(){
    if(this.constant.getPlatform() == "web"){
      this.router.navigateByUrl('/nliLanding');
    }else{
      this.router.navigateByUrl('/LandingPage');
    }
  }

  validatesForm() {
    if (this.registrationFormCustDtl.invalid) {
      this.formValidation.markFormGroupTouched(this.registrationFormCustDtl);
      return;
    }
  }


  submit(){
    this.validatesForm();
    if (this.registrationFormCustDtl.valid) {
      this.DataService.regFeildData.custId = this.registrationFormCustDtl.value.custId;
      this.DataService.regFeildData.accNo = this.registrationFormCustDtl.value.accNo;
      this.DataService.selectedCIFNo = this.registrationFormCustDtl.value.custId;
      this.DataService.email = this.registrationFormCustDtl.value.email.toLowerCase();
      this.DataService.isMigratedUser = this.registrationFormCustDtl.value.migrated;
      this.localStorage.setLocalStorage(this.constant.storage_mobileNo, this.registrationFormCustDtl.value.mobNumber);
      console.log(this.DataService.isMigratedUser)

      //TODO: code change for new registraion flow 28-1-23 by sarfaraj
      let _param = this.regServices.getValidateCustDtlParam(this.DataService.regFeildData.custId, this.DataService.regFeildData.accNo, this.DataService.email.toLowerCase(), this.constant.deviceID);
      this.updateCustDtlApiCall(_param);
    } else {
      this.formErrorsstep1 = this.formValidation.validateForm(this.registrationFormCustDtl, this.formErrorsstep1, true);
    }
  }




  
  isValidAccStatusFrmNo(accNo){
    var validAccStatus = false;
    switch(this.DataService.regType){
      case 'retail':
        validAccStatus = (accNo.slice(4,6) == "10" || accNo.slice(4,6) == "11" || accNo.slice(4,6) == "13" || accNo.slice(4,6) == "16" )
        break;
      case 'loan':
        validAccStatus = accNo.slice(4,6) == "12"
        break;
      case 'nri':
        validAccStatus = (accNo.slice(4,6) == "10" || accNo.slice(4,6) == "11" || accNo.slice(4,6) == "20" || accNo.slice(4,6) == "21" || accNo.slice(4,6) == "30" || accNo.slice(4,6) == "31" )
        break;
    }
    return validAccStatus;
  }

  errorCallBack(subActionId, resp) {
    //showToastMessage(resp.Result,"error");
    if(resp.opstatus == "04"){
      console.log("redirect to bank account page");
    }
  }



  updateCustDtlApiCall(param){

    var url = '';
    var deviceID = '';
    url = this.constant.serviceName_CIFACCOUNTMOBILECHECKRETAIL_reg;
    deviceID = this.constant.deviceID;

    this.http.callBankingAPIService(param, deviceID , url,false).subscribe(data => {
      console.log(JSON.stringify(data));
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        if (true) {
          this.DataService.regBranchCode = data.set?.records[0].branchCode
          if (this.constant.getPlatform() == "web") {
            this.proceedWithRegistration(data)
          }
          else {
        
            this.localStorage.setLocalStorage("deviceId", data.responseParameter.deviceId);
            this.DataService.registrationData = data.responseParameter;
            this.DataService.registrationSecQue = data.set != undefined ? data.set?.records[0] : '';

            this.DataService.mobStaticEncKey = this.localStorage.getLocalStorage("mobileNo") + this.constant.mapEncryptKey
            this.DataService.userRegStaus = this.DataService.registrationData.RegistrationSuccess;
            this.DataService.pendingAtToken = false;
            this.DataService.regIsAtStep = 1;
            console.log("userinsde3")
            this.testFunction();

          }
        }
      } else if (resp.opstatus == "02") {
        if (this.constant.getPlatform() == "web") {
          // if(resp.omniRegistrationStatus.toUpperCase() == 'N'){
          //   this.proceedWithRegistration(data,true)
          // }
          // else{
          this.DataService.errorMsg = resp.Result;
          this.commonMethods.openPopup('div.popup-bottom.show-valid-user')
          //}
        }
      } else if (resp.opstatus == "01") {

        this.DataService.errorMsg = resp.Result;
        this.commonMethods.openPopup('div.popup-bottom.show-valid-user')
        // }
      } else {
        this.errorCallBack(data.subActionId, resp);
      }
    },(error)=>{
      console.log(error);
    });
  }


  GetOtpPopData(data){
    if(data == 'success'){
      this.otpstart = false;
      this.DataService.headerType = 'innerHeader'
      // this.getProfileDtl();
      if( this.DataService.gotpage){
        this.DataService.routeWithNgZone(this.DataService.gotpage);
      }else{
        //this.dataService.routeWithNgZone('dashboardMobile');
        this.DataService.routeWithNgZone('dashboard');
      }
    }else {
      this.otpstart = false;
    }
 } 


  proceedWithRegistration(data,isOTPRequired?){
    
    this.localStorage.setLocalStorage("deviceId", data.responseParameter.deviceId);

    this.DataService.registrationData = data.responseParameter;
    this.DataService.registrationSecQue = data.set != undefined ? data.set?.records[0]: '';

    this.DataService.mobStaticEncKey = this.localStorage.getLocalStorage("mobileNo") + this.constant.mapEncryptKey
    this.DataService.userRegStaus = this.DataService.registrationData.RegistrationSuccess;
    this.DataService.pendingAtToken  = false;
    this.DataService.regIsAtStep = 1;

    this.DataService.maskRegisternumber = this.commonMethods.maskNumber(this.localStorage.getLocalStorage("mobileNo"));
    this.otpgenerate.emit(this.optgenerateData);
  }
  openPopUp(){
    this.termsCondition = 'termsConditionRegistration'
    this.termsConditionEvent.next( this.termsCondition)
    
  }

}
