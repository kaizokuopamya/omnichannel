import {FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Injector, Input, NgZone, OnDestroy, OnInit, Output, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonMethods } from 'src/app/services/common-methods';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataService } from 'src/app/services/data.service';
import { AppConstants } from 'src/app/app.constant';
import {ProfileEditService} from '../profile-edit/profile-edit.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { timer, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import {FORMTYPES} from './profile-edit.model'
import { commonOtpModel , commonOtEmailpModel } from 'src/app/model/common.model';
import {  OTPINPUTMESSAGE , OTPEMAILINPUTMESSAGE } from './profile-edit.model';
declare var showToastMessage: any;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  sessionDecryptKey: any;
  limitsUpdateInfo:any
  OTPInputMessage:commonOtpModel = OTPINPUTMESSAGE;
  OTPEmailInputMessage:commonOtEmailpModel = OTPEMAILINPUTMESSAGE;

  usernameForm: FormGroup;
  emailForm: FormGroup;
  addressForm: FormGroup;
  aadharForm: FormGroup;
  panForm: FormGroup;


  isuserNameVerfied: any = false;
  userAvailabilityChecked: any = false;
  isuseravailable: any = false;
  otpstart:boolean =false;
  otpstartEmail:boolean =false;
  showDetails:boolean = false;


  profileModuleType:any = '';
  icontype:any;
  custAccountList: any = [];
  lastLogin: any;
  emailId = '';
  profileImage: any = '';
  userName: any;
  mobileNo = '';
  accNo = '';
  communicationAdd = '';
  addharCard: any = '';
  panCard: any = '';
  profileTypeModule = '';
  todayDate: any;
  rrnNo:any
  formtypes:any= FORMTYPES  

  
  constructor(
    private constant: AppConstants,
    private router: Router,
    public dataService: DataService,
    private storage: LocalStorageService,
    private http: HttpRestApiService,
    private profileEditService: ProfileEditService,
    private domSanitizer: DomSanitizer,
    public commonMethod: CommonMethods,
    private encryptDecryptService: EncryptDecryptService,
    private datePipe: DatePipe,
    private ngZone: NgZone,
    private injector: Injector,
    private loader: pageLoaderService,
  ) {}

  ngOnInit(): void {
    console.log('tessssssssttttttt :: ', this.profileModuleType);
    this.custAccountList = this.dataService.customerAccountList;
    console.log('list======', this.custAccountList);
    this.profileModuleType = this.dataService.profileTypeModule
    this.userName = this.storage.getLocalStorage(
      this.constant.storage_username
    );
    this.formBuilder()
    if(this.dataService.profileDetailsValue){
      this.renderData(this.dataService.profileDetailsValue)
    }else{
    this.getProfileDetails();
    }
    console.log(this.dataService.profileDetails);

  }

  // ************************** Output of Email Mobile OTP popup ********************
  GetOtpEmailPopData(data){
    this.otpstartEmail =false
    var resp = data.responseParameter;
    if (resp.opstatus == '00' && this.rrnNo == resp.requestRRN) {
      this.changeEmail();
      this.icontype = 'success'
      this.limitsUpdateInfo = "EmailID changed Successfully"
        this.commonMethod.openPopup("div.profile-limit-info")

    }else{
      this.icontype = 'failed'
      this.limitsUpdateInfo = resp.Result
        this.commonMethod.openPopup("div.profile-limit-info")
    }
  }


// ************************** Build form as per the pofile edit module ********************
  formBuilder(){
    const index = this.formtypes.map((object:any) => object.formType).indexOf(this.profileModuleType);
    var selectedForm = this.formtypes[index].formDetails
    if(this.profileModuleType == "username"){
      this.usernameForm = this.dataService.buildForm(selectedForm);
    }else if(this.profileModuleType == "email"){
      this.emailForm = this.dataService.buildForm(selectedForm)
    }else if(this.profileModuleType == "aadhar"){
      this.aadharForm = this.dataService.buildForm(selectedForm)
    }else if(this.profileModuleType == "pan"){
      this.panForm = this.dataService.buildForm(selectedForm)
    }else if(this.profileModuleType == "address"){
      this.addressForm = this.dataService.buildForm(selectedForm)
    }

  }


  // ************************** call Profile data if its not exist is dataservice ********************
  getProfileDetails() {
   
    let param = this.profileEditService.getProfileDetailsEditParam();
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_CUSTPROFILEDETAILS).subscribe((data) => {
        console.log('profile data   ' + JSON.stringify(data));
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.renderData(data)
        } else {
          this.errorCallBack(data.subActionId, resp);
        }
      });
  }


// ************************** Render Profile data if already exist is dataservice ********************
  renderData(data){
    var resp = data.responseParameter;
    var responseData = data.listofDataset[0].records;
    var limitsData = data.listofDataset[1].records;
    this.mobileNo = responseData[0].mobileNo;
    this.emailId = !this.commonMethod.validateEmpty(
      responseData[0].emailId
    )
      ? responseData[0].emailId
      : '-';
    // this.userName = responseData[0].custName
    this.accNo = responseData[0].accountNo;
    this.communicationAdd = (
      responseData[0].add1 +
      ', ' +
      responseData[0].add2 +
      ', ' +
      responseData[0].cityCode
    ).replace(', ,', ',');
    this.addharCard = !this.commonMethod.validateEmpty(
      responseData[0].aadharNumber
    )
      ? responseData[0].aadharNumber
      : '-';
    this.panCard = !this.commonMethod.validateEmpty(
      responseData[0].panNumber
    )
      ? responseData[0].panNumber
      : '-';
    if (resp?.base64Image != '')
      this.profileImage = this.domSanitizer.bypassSecurityTrustUrl(
        'data:image/png;base64,' + resp?.base64Image
      );
    else this.profileImage = '';

    this.dataService.setDetails({
      profileImg: 'data:image/png;base64,' + resp?.base64Image,
      username: this.userName,
      emailId: this.emailId,
    });
    this.showDetails = true;
    this.dataService.profileDetails = responseData;
  }



// ***************************CHange Email Addesss ***********************************
  changeEmail() {
    var param = this.profileEditService.getEmailIdUpdateParam( this.emailForm.value.emailId);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_EMAILREGISTRATIONCUSTOMER).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.getProfileDetails();
        this.dataService.profileDetailsValue = ''
        this.icontype = 'success'
        this.limitsUpdateInfo = "EmailID updated Successfully"
        this.commonMethod.openPopup("div.profile-limit-info")
      }else{
        this.icontype = 'failed'
        this.limitsUpdateInfo = resp.Result
        this.commonMethod.openPopup("div.profile-limit-info")
      }
    })
  }


// ************************** Go To page route ********************
  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  // ***************************Back Button ***********************************
  prevEventSection() {
    this.profileModuleType = '';
   this.goToPage('profile')
  }

  // *************************** Form Validation ***********************************
  validateForm(type) {
    switch (type) {
      case 'username':
        if (this.usernameForm.invalid) {
          this.usernameForm.get('username').markAsTouched();
         
        }
        break;
      case 'email':
        if (this.emailForm.invalid) {
          this.emailForm.get('emailId').markAsTouched();
        }
        break;
      case 'aadhar':
        if (this.aadharForm.invalid) {
          this.aadharForm.get('aadhar').markAsTouched();
        }
        break;
      case 'pan':
        if (this.panForm.invalid) {
          this.panForm.get('pan').markAsTouched();
        }
        break;
      case 'address':
        if (this.addressForm.invalid) {
          this.addressForm.get('address1').markAsTouched();
          this.addressForm.get('address2').markAsTouched();
          this.addressForm.get('address3').markAsTouched();
          this.addressForm.get('city').markAsTouched();
          this.addressForm.get('state').markAsTouched();
          this.addressForm.get('pinCode').markAsTouched();
          this.addressForm.get('documentNumber').markAsTouched();
         
        }
        break;
    }
  }

  // *************************** Edit Submit click ***********************************
  onEditFormSubmit(formValue, type) {
    this.dataService.profileEmailEdit = '';
    switch (type) {
      case 'username':
        if (formValue.valid && this.isuserNameVerfied) {
         
          this.dataService.screenType ='editusername'
          console.log('Username Data : ', formValue);
        
        
          let param = this.profileEditService.getProfileUpdateParamforUsername(
            this.dataService.profileDetails,
            this.usernameForm.value
          );
  
          this.dataService.profileEditObj.newUserName = this.usernameForm.value.username;
          this.dataService.screenType = 'profileDetails';
          this.dataService.editusername=formValue.value.username;
          this.dataService.isUsernameChanged = true;

      
          this.OTPInputMessage.subHeaderMsg = "Please enter 6 digit mobile number"
          this.OTPInputMessage.otpSendEndpint = this.constant.serviceName_RESENDOTPSESSION
          this.OTPInputMessage.serviceType =this.constant.val_PROFILEDETAILS
          this.OTPInputMessage.mobStaticEncKey =  this.storage.getSessionStorage(this.constant.val_sessionKey)
          this.OTPInputMessage.otpValidateEndpoint = this.constant.serviceName_CUSTPROFILEUPDATE
          this.OTPInputMessage.showCloseButton = true
          this.OTPInputMessage.params = param
          this.otpstart = true;
        } else {
          this.validateForm(type);
        }
        break;
      case 'email':
        if (this.emailForm.valid) {
          this.rrnNo = this.commonMethod.genRandomDigit(9);
          this.OTPEmailInputMessage.emailAddress = this.emailForm.value.emailId
          this.OTPEmailInputMessage.params = this.profileEditService.getValidateLeadsOtpSessionCall( this.emailForm.value.emailId , this.rrnNo)
          this.OTPEmailInputMessage.otpValidateEndpoint =  this.constant.serviceName_VALIDATELEADSOTPSESSION
          this.otpstartEmail =true
         

        } else {
          this.validateForm(type);
        }
        break;

      case 'address':
        if (this.addressForm.valid) {
          console.log('Address Data : ', formValue);
          let param = this.profileEditService.getProfileUpdateParamforAddress(
            this.dataService.profileDetails,
            this.addressForm.value
          );
          this.dataService.request = param;
          this.dataService.endPoint =
            this.constant.serviceName_CUSTPROFILEUPDATE;
          this.dataService.authorizeHeader = 'PROFILE EDIT';
          this.dataService.profileEditObj.address1 =
            this.addressForm.value.address1;
          this.dataService.profileEditObj.address2 =
            this.addressForm.value.address2;
          this.dataService.profileEditObj.address3 =
            this.addressForm.value.address3;
          this.dataService.profileEditObj.city = this.addressForm.value.city;
          this.dataService.profileEditObj.state = this.addressForm.value.state;
          this.dataService.profileEditObj.pinCode =
            this.addressForm.value.pinCode;
            this.dataService.screenDetails = {
              OLD_USERNAME:this.storage.getLocalStorage(this.constant.storage_username),
              NEW_USERNAME:formValue.value.username
            }
            this.router.navigate(['/otpsession']);
            this.dataService.screenType = 'profileDetails';
         
        } else {
          this.validateForm(type);
        }
        break;
      case 'aadhar':
        if (this.aadharForm.valid) {
          if (this.aadharForm.value.aadhar < 1) {
            showToastMessage('Invalid Aadhaar Number');
            return;
          }
          let param = this.profileEditService.getProfileUpdateParamForAadhar(this.aadharForm.value);
          this.dataService.request = param;
          this.dataService.endPoint = this.constant.serviceName_AADHARUPDATE;

          this.dataService.authorizeHeader = 'PROFILE EDIT';
          this.dataService.screenType = 'profileDetails';
          this.router.navigate(['/otpsession']);
        } else {
          this.validateForm(type);
        }
        break;
      case 'pan':
        if (this.panForm.valid) {
          let param = this.profileEditService.getProfileUpdateParamForPAN(
            this.panForm.value
          );
          this.dataService.request = param;
          this.dataService.endPoint = this.constant.serviceName_PANUPDATE;
          this.dataService.authorizeHeader = 'PROFILE EDIT';
          this.dataService.screenType = 'profileDetails';
          this.router.navigate(['/otpsession']);
          
        } else {
          this.validateForm(type);
        }
        break;
      default:
    }
  }

  // *************************** ERROR HANDLING ***********************************
  errorCallBack(subActionId, resp) {
    if (resp.opstatus == '02') {
      showToastMessage(resp.Result, 'error');
    }
  }


  validateAadhar(){
    this.dataService.profile.transactionId = "PSB:OMNI:"+this.commonMethod.genRandomDigit(4)
    var param = this.profileEditService.getAadharValidation(this.aadharForm.value.aadhar,this.dataService.profile.transactionId);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_UIDAIOTPGENERATE).subscribe(data => {
      console.log("=====validateAadharNo=====", data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.dataService.request = this.profileEditService.getValidateAadharValidation(this.aadharForm.value.aadhar,this.dataService.profile.transactionId);
        this.dataService.endPoint = this.constant.serviceName_UIDAIKYCDETAILS
        this.router.navigate(['/otpsession']);
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }

  updateProfileDetailsForUsername() {
    console.log(this.usernameForm.value);
    let param = this.profileEditService.getProfileUpdateParamforUsername(
      this.dataService.profileDetails,
      this.usernameForm.value.username
    );
    this.updateProfileDetailsApiCall(param);
  }
  updateProfileDetailsApiCall(param) {
    this.dataService.request = param;
    this.dataService.endPoint = this.constant.serviceName_CUSTPROFILEUPDATE;
    //this.router.navigateByUrl('/otpsession');

    // this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_CUSTPROFILEUPDATE).subscribe(data=>{
    //   console.log(data);
    //   var resp = data.responseParameter
    //     if (resp.opstatus == "00") {
    //       console.log(data.responseParameter);
    //
    //   });
  }

  updateProfileDetailsForEmail() {
    console.log(this.emailForm.value);
    let param = this.profileEditService.getProfileUpdateParamforEmail(
      this.dataService.profileDetails,
      this.emailForm.value.emailId
    );
    this.updateProfileDetailsApiCall(param);
  }

  updateProfileDetailsForEmailApiCall(param) {
    //this.router.navigate(['/otpsession']);
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_CUSTPROFILEUPDATE
      )
      .subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          console.log(data.responseParameter);
        }
      });
  }

  updateProfileDetailsForAddress() {
    console.log(this.addressForm.value);
    let param = this.profileEditService.getProfileUpdateParamforAddress(
      this.dataService.profileDetails,
      this.addressForm.value
    );
    this.updateProfileDetailsApiCall(param);
  }
    // ************************** Address Update API call ********************
  updateProfileDetailsForAddressApiCall(param) {
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_CUSTPROFILEUPDATE
      )
      .subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          console.log(data.responseParameter);
          // this.router.navigate(['/otpsession']);
        }
      });
  }


  // ************************** check username Availability ********************
  checkAvailability() {
    if (this.usernameForm.get('username').valid) {
      let paramReq = this.profileEditService.getCheckAvaiablityParam(
        this.usernameForm.value.username.toLowerCase()
      );

      this.userAvailabilityChecked = true;
      // this.notclickedflag = false;
      this.http
        .callBankingAPIService(
          paramReq,
          this.storage.getLocalStorage(this.constant.storage_deviceId),
          this.constant.serviceName_CHECKOMNIUSERNAME_reg
        )
        .subscribe((data) => {
          console.log(data);
          var resp = data.responseParameter;
          if (resp.opstatus == '00') {
            console.log(data.responseParameter);
            this.isuserNameVerfied = true;
          } else {

               this.ngZone.run(() => {
                  this.dataService.information = resp.Result;
                  this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                  this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                  this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                })

           //showToastMessage(resp.Result,'error')
            this.isuserNameVerfied = false;
          }
        });
    } else {
      this.usernameForm.get('username').markAsTouched();
    }
  }

    // ************************** Output of Mobile OTP popup ********************
  GetOtpPopData(data){
    
    var resp = data.responseParameter;
    if (resp.opstatus == '00') {
      this.icontype =  "success"
      this.otpstart = false;
      
      this.limitsUpdateInfo =  "LIMITS_UPDATED_SUCCESS"
      this.commonMethod.openPopup('div.popup-bottom.profile-limit-info');
    
    }else {
     
        this.icontype =  "info"
          this.limitsUpdateInfo =  "ERROR_UPDATE_LIMIT"
          this.commonMethod.openPopup('div.popup-bottom.profile-limit-info');
        } 
      this.otpstart = false;
    
   
 } 
}
