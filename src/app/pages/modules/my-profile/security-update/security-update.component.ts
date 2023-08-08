import { Component, NgZone, OnInit, ViewChildren} from '@angular/core';
import { HttpRestApiService } from '../../../../services/http-rest-api.service';
import { AppConstants } from '../../../../app.constant';
import { DataService } from '../../../../services/data.service';
import { LocalStorageService } from "src/app/services/local-storage.service"
import { CommonMethods } from 'src/app/services/common-methods';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from '../../../../services/form-validation.service';
import { SecurityUpdateService } from './security-update.service';
//import { PluginService } from 'src/app/services/plugin-service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { timer, Subscription } from "rxjs";
import { ProfileDetailsService } from '../profile-details/profile-details.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { DashboardService } from '../../dashboard/dashboard.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import {FORMTYPES}  from './security-update.model'
import{OTPINPUTMESSAGE} from './security-update.model'
import { commonOtpModel } from 'src/app/model/common.model';

declare var showToastMessage: any;
declare var $: any;
declare var cordova:any;
@Component({
  selector: 'app-security-update',
  templateUrl: './security-update.component.html',
  styleUrls: ['./security-update.component.scss']
})
export class SecurityUpdateComponent {

  @ViewChildren('tpinRow') tPinRows: any;
  @ViewChildren('tpinNewRow') newTPinRows: any;
  @ViewChildren('tpinConfirmRow') confirmTPinRows: any;

  @ViewChildren('mpinRow') mPinRows: any;
  @ViewChildren('mpinNewRow') newMPinRows: any;
  @ViewChildren('mpinConfirmRow') confirmMPinRows: any;
  
  @ViewChildren('otpRow') otpRows: any;
  mpinSimpleError:any
  confirmMpinError:any
  newMpinError:any
  mpinError:any;
  maskedMobileNo:any;
  selectionValue:any;
  platform:any;
  errorMsg:any;
  icontype:any
  poppupHeader:any;
  poppupSubHeader:any;

  otpstart:boolean = false
  oldNewpassMatch:boolean =false
  newConfirmPassMatch:boolean = false
  formtypes:any= FORMTYPES  
  rrnRequest:any
  inputType:any = "password"
  loopLength:any;
  tpinError:any
  mpinformdata:any = []
  tpinformdata:any = []
  tpinSimpleError:any
  profileForm : FormGroup;
  mPinForm : FormGroup ;
  tpinForm : FormGroup ;
  otpForm: FormGroup;
  changePasswordForm:FormGroup;
  newTpinError:any
  confirmTpinError:any
  oldTpin:any
  newTpin:any
  oldMpin:any
  newMpin:any


  failedAttempts :number=0;

  mpinInput = []
  mpinNewInput = []
  mpinConfirmInput = []

  tpinInput = []
  tpinNewInput = []
  tpinConfirmInput = []

  otpInput = []


  OTPInputMessage:commonOtpModel = OTPINPUTMESSAGE;

  constructor(
    private form: FormBuilder,
    public constant: AppConstants,
    private router: Router,
    public dataService: DataService,
    private storage: LocalStorageService ,
    private formValidation: FormValidationService,
    private http: HttpRestApiService,
  //  private pluginService : PluginService,
    public commonMethod:CommonMethods,
    private encryptDecryptService: EncryptDecryptService,
    private securityUpdateService:SecurityUpdateService,
    private ngZone:NgZone,
    private profileDtlsService:ProfileDetailsService,
    private domSanitizer : DomSanitizer,
    private dashboardService: DashboardService,
    private idle: Idle,
    public translatePipe : TranslatePipe
    ) { }
    ngOnInit() {
    

      let profileTitle = this.dataService.profileTabSelection == 'password' ? 'Change Password' : this.dataService.profileTabSelection == 'mpin' ? 'Change MPIN' : this.dataService.profileTabSelection == 'tpin' ? 'Change TPIN' : 'Profile Update'

    
      this.maskedMobileNo = this.maskCharacter(this.storage.getLocalStorage(this.constant.storage_mobileNo), 4);
      this.selectionValue = this.dataService.profileTabSelection;
     
    
      this.platform= this.constant.getPlatform();
      console.log("username=======", this.dataService.profileDetails[0].webLastLogin);
      if(this.constant.getPlatform() == 'web'){
        this.inputType = "password"
      }else{
        this.inputType = "tel"
      }
      this.loopLength = Number(this.dataService.tpinlength)
      this.setNavigation(this.dataService.profileTabSelection)
      
      //this.selectImageFromGallery();
    }

    ngOnDestroy(){
      this.dataService.profileTabSelection = ''
    }
    setNavigation(data){
      this.mpinformdata= []
      this.tpinformdata = []
      
      this.selectionValue = data
      if(this.selectionValue == 'mpin'){
        this.mpinInput = []
        this.mpinNewInput = []
        this.mpinConfirmInput = []
        for(var i=0; i< this.loopLength; i++){
            this.mpinInput.push("oldMpin" + (i+1))
            this.mpinNewInput.push("newpMpin" + (i+1))
            this.mpinConfirmInput.push("confirmMpin" + (i+1))
            this.mpinformdata.push(
              { "fieldName" : "oldMpin" + (i+1),"minLength": 1, "maxLength":1 , "required" :"Y" },
              { "fieldName" : "newpMpin" + (i+1),"minLength": 1, "maxLength":1 ,  "required" :"Y" },
              { "fieldName" : "confirmMpin" + (i+1),"minLength": 1, "maxLength":1 ,  "required" :"Y" },
              )

        }
      }else if(this.selectionValue == 'tpin'){
        this.tpinInput = []
        this.tpinConfirmInput = []
        this.tpinNewInput = []
        for(var i=0; i< this.loopLength; i++){
        this.tpinInput.push("oldTpin" + (i+1))
        this.tpinNewInput.push("newTpin" + (i+1))
        this.tpinConfirmInput.push("confirmTpin" + (i+1))
        this.tpinformdata.push(
          { "fieldName" : "oldTpin" + (i+1),"minLength": 1, "maxLength":1 , "required" :"Y"},
          { "fieldName" : "newTpin" + (i+1),"minLength": 1, "maxLength":1 , "required" :"Y"},
          { "fieldName" : "confirmTpin" + (i+1),"minLength": 1, "maxLength":1, "required" :"Y"  },
          )
        }
      }
      this.buildForm();
    }



    buildForm(){
      var selectedForm = []
   
      if(this.selectionValue == 'password'){
        const index = this.formtypes.map((object:any) => object.formType).indexOf(this.selectionValue);
        selectedForm = this.formtypes[index].formDetails
        this.changePasswordForm = this.dataService.buildForm(selectedForm)
      }else if(this.selectionValue == 'mpin'){
        console.log( "this.mpinformdata ",  this.mpinformdata)
        this.mPinForm = this.dataService.buildForm(this.mpinformdata)
      }else{
        this.tpinForm = this.dataService.buildForm(this.tpinformdata)
      }

    }
    Cancel() {
      this.router.navigateByUrl('/profile');
    }

    passwordFormValidation(){
      console.log(this.changePasswordForm.value.newPassword.length)
      if(this.changePasswordForm.value.oldPassword.length == this.changePasswordForm.value.newPassword.length){
        if(this.changePasswordForm.value.oldPassword == this.changePasswordForm.value.newPassword){
          this.oldNewpassMatch = true
        }else{
          this.oldNewpassMatch = false
        }
      }else{
        this.oldNewpassMatch = false
      }
      if( this.changePasswordForm.value.confirmNewPassword.length > 0){
        if(this.changePasswordForm.value.newPassword == this.changePasswordForm.value.confirmNewPassword){
          this.newConfirmPassMatch = false
        }else{
          this.newConfirmPassMatch = true
        }
      }else{
        this.newConfirmPassMatch = false
      }
      
    }
    validateForm() {
    
      if (this.selectionValue == 'password' && this.changePasswordForm.invalid) {
        this.changePasswordForm.get('oldPassword').markAsTouched();
        this.changePasswordForm.get('newPassword').markAsTouched();
        this.changePasswordForm.get('confirmNewPassword').markAsTouched();
      }
      else if(this.selectionValue == 'mpin' && this.mPinForm.invalid)
      {
        for(var i = 0; i < this.loopLength ; i++){
          this.mPinForm.get('oldMpin' + (i +1)).markAsTouched();
          this.mPinForm.get('newpMpin'  + (i +1)).markAsTouched();
          this.mPinForm.get('confirmMpin'  + (i +1)).markAsTouched();
        }
      }
      else{

        for(var i = 0; i < this.loopLength ; i++){
          this.tpinForm.get('oldTpin' + (i +1)).markAsTouched();
          this.tpinForm.get('newTpin'  + (i +1)).markAsTouched();
          this.tpinForm.get('confirmTpin'  + (i +1)).markAsTouched();
        }
       
      }
    }


    onUpdate() {
      console.log("onUpdate");

      this.rrnRequest = this.commonMethod.genRandomDigit(9)
      this.OTPInputMessage.subHeaderMsg = "Please enter 6 digit mobile number"
      this.OTPInputMessage.otpSendEndpint = this.constant.serviceName_RESENDOTPSESSION
      this.OTPInputMessage.showCloseButton = true
      this.OTPInputMessage.authType =  this.dataService.otpName
      this.OTPInputMessage.otpValidateEndpoint = this.constant.serviceName_VALIDATEOTPSESSION
      this.OTPInputMessage.mobStaticEncKey =  this.storage.getSessionStorage(this.constant.val_sessionKey)
      this.OTPInputMessage.params =  this.securityUpdateService.getChannelLeadOtpParam(this.rrnRequest)
      this.OTPInputMessage.otpkeyName =  this.constant.key_OTP
      
      if(this.selectionValue == 'password' && this.changePasswordForm.invalid) {
  
        if(this.changePasswordForm.value.oldPassword != this.changePasswordForm.value.newPassword){
          if(this.changePasswordForm.value.newPassword == this.changePasswordForm.value.confirmNewPassword) {
           
            this.OTPInputMessage.serviceType =this.constant.val_CHANGEPASSWORD
          
            this.otpstart = true;
            
            // this.openPopup('otp');
            // this.getResendOTPSession(this.constant.val_CHANGEPASSWORD);
          }
        }
      } else if(this.selectionValue == 'mpin'){

        var oldMpin= ''
        var newMpin =''
        var confirmMpin =''
          for(let i = 0 ; i< this.loopLength; i++){
           oldMpin =  oldMpin +   this.mPinForm.get("oldMpin" + (i + 1)).value
           newMpin =  newMpin +   this.mPinForm.get("newMpin" + (i + 1)).value
           confirmMpin =  confirmMpin +   this.mPinForm.get("confirmMpin" + (i + 1)).value

          }
          oldMpin.trim()
          newMpin.trim()
          confirmMpin.trim()
          this.oldMpin =  oldMpin.trim()
          this.newMpin =  newMpin.trim()
        oldMpin.length == 6 ? this.mpinError = '' : this.mpinError = 'Please Enter Old Mpin';
        newMpin.length == 6 ? this.newMpinError = '' : this.newMpinError = 'Please Enter New Mpin';
        confirmMpin.length == 6 ? this.confirmMpinError = '' : this.confirmMpinError = 'Please Enter Confirm Mpin';
        confirmMpin == newMpin ? this.confirmMpinError = '' : this.confirmMpinError = 'New MPIN and confirm MPIN do not match';
        this.mpinSimpleError = this.checkRepeatedDigits(newMpin) ? this.translatePipe.transform('MPIN_SIMPLE_ERROR') : '';
        if(this.mpinSimpleError == ""){
          this.mpinSimpleError = this.checkConsecutiveDigits(newMpin) ? this.translatePipe.transform('MPIN_SIMPLE_ERROR') : '';
        }
  
        if(this.mPinForm.valid && this.mpinSimpleError == ''&& this.confirmMpinError == ''){
          this.OTPInputMessage.serviceType =this.constant.val_CHANGEMPIN
          this.otpstart = true;
        }
  
     }
     else if(this.selectionValue == 'tpin') {
      var oldTpin=''
      var newTpin=''
      var confirmTpin=''
      console.log(this.tpinForm.get("oldTpin" + (0 + 1)).value)
      for(let i = 0 ; i < this.loopLength; i++){
      //  console.log("i ======>" +this.tpinForm.get("oldTpin" + (i + 1)).value)
        oldTpin =  oldTpin +   this.tpinForm.get("oldTpin" + (i + 1)).value
        newTpin =  newTpin +   this.tpinForm.get("newTpin" + (i + 1)).value
        confirmTpin =  confirmTpin +   this.tpinForm.get("confirmTpin" + (i + 1)).value

       }
     
       oldTpin.trim()
       newTpin.trim()
       confirmTpin.trim()
       this.newTpin = newTpin
       this.oldTpin = newTpin
       console.log("newTpin" + newTpin)
       console.log("confirmTpin" + confirmTpin)
      oldTpin.length == 6 ? this.tpinError = '' : this.tpinError = 'Please Enter Old Tpin';
      newTpin.length == 6 ? this.newTpinError = '' : this.newTpinError = 'Please Enter New Tpin';
      // recentMpin == newTpin ? this.newTpinError1 = '':this.newTpinError1 = 'Please Mpin and Tpin should not be same';
      confirmTpin.length == 6 ? this.confirmTpinError = '' : this.confirmTpinError = 'Please Enter Confirm Mpin';
      newTpin == confirmTpin ? this.confirmTpinError = '' : this.confirmTpinError = 'New TPIN and confirm TPIN do not match';
      this.tpinSimpleError = this.checkRepeatedDigits(newTpin) ? this.translatePipe.transform('TPIN_SIMPLE_ERROR') : '';
      if(this.tpinSimpleError == ""){
        this.tpinSimpleError = this.checkConsecutiveDigits(newTpin) ? this.translatePipe.transform('TPIN_SIMPLE_ERROR') : '';
      }
      console.log("this.tpinForm.valid " + this.tpinForm.valid )
      if(this.tpinForm.valid && this.tpinSimpleError == '' && this.confirmTpinError == ''){
        console.log("INTPIN continue")
        this.OTPInputMessage.serviceType =this.constant.val_CHANGETPIN
        this.otpstart = true;
      }
    }
    else
    {
      this.validateForm();
    }
    }
    GetOtpPopData(data){
    console.log(data)

    var resp = data.responseParameter;
    if (resp.opstatus == '00') {
      console.log(data.responseParameter);
     

      if(this.rrnRequest == resp.requestRRN){
        this.updateSecurity();
      }
      else{
        this.commonMethod.openPopup('div.popup-bottom.forgertUser');
      }

    } else {
      this.icontype =  "info"
        this.commonMethod.openPopup('div.popup-bottom.profile-limit-info');
      } 
        this.otpstart = false;
      
     
   } 

   updateSecurity() {
    switch(this.selectionValue) {
    case "password":
      
      this.getProfileUpdatePasswordChange();
        break
    case "mpin":
            this.getProfileUpdateChangeMPIN();
        break
    case "tpin":
            this.getProfileUpdateChangeTPIN();
      break
    }
  }



      //api call for change password
  getProfileUpdatePasswordChange() {
    var param=this.securityUpdateService.getProfileUpdatePasswordChangeParam(this.changePasswordForm.value)
    console.log("value==",this.changePasswordForm.value)
    this.getProfileUpdatePasswordChangeApiCall(param)
  }

  getProfileUpdatePasswordChangeApiCall(param) {
    this.errorMsg = "";
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_INTERNETBANKPASSCHANGE).subscribe(data=>{
      console.log(data);
      var resp = data.responseParameter
        if (resp.opstatus == "00") {
          console.log(data.responseParameter);
          this.poppupHeader = "Success"
          this.poppupSubHeader = data.responseParameter.Result
           this.openPopup('success1');
          //  this.changePasswordForm.reset()
          }
          else{
            this.poppupHeader = "Failed"
          this.poppupSubHeader = data.responseParameter.Result
            this.openPopup('success1');
            this.changePasswordForm.reset()
          }
      });
  }
  getProfileUpdateChangeMPIN() {
    var param=this.securityUpdateService.getProfileUpdateChangeMPINParam(this.newMpin , this.oldMpin )
    let deviceID = this.storage.getLocalStorage(this.constant.storage_deviceId);
    this.getProfileUpdateChangeMPINApiCall(param,deviceID)
  }

  getProfileUpdateChangeMPINApiCall(param,deviceID) {
    this.errorMsg = "";
    this.http.callBankingAPIService(param,deviceID,this.constant.serviceName_CHANGEPINS).subscribe(data=>{
      console.log(data);
      var resp = data.responseParameter
        if (resp.opstatus == "00") {
          console.log(data.responseParameter);
          this.mPinForm.reset();
          this.poppupHeader = "Success"
          this.poppupSubHeader = data.responseParameter.Result
          this.openPopup('success1');
           this.mPinForm.reset()
        }
        else{
          this.poppupHeader = "Failed"
          this.poppupSubHeader = data.responseParameter.Result
          this.openPopup('success1');
          this.mPinForm.reset();
        }
      });
  }


 ////////API for change TPIN
  getProfileUpdateChangeTPIN() {
    var param=this.securityUpdateService.getProfileUpdateChangeTPINParam( this.newTpin ,  this.oldTpin )
    let deviceID = this.storage.getLocalStorage(this.constant.storage_deviceId);
    this.getProfileUpdateChangeTPINApiCall(param,deviceID)
  }

  getProfileUpdateChangeTPINApiCall(param,deviceID) {
    this.errorMsg = "";
    this.http.callBankingAPIService(param,deviceID,this.constant.serviceName_CHANGEPINS).subscribe(data=>{
      console.log(data);
      var resp = data.responseParameter
        if (resp.opstatus == "00") {
          console.log(data.responseParameter);
     
            this.poppupHeader = "Success"
            this.poppupSubHeader = data.responseParameter.Result
          this.openPopup('success1');
          // this.tpinForm.reset()
        }
        else if(resp.opstatus != "00")
        {
          this.poppupHeader = "Failed"
          this.poppupSubHeader = data.responseParameter.Result
          this.openPopup('success1');

          if(this.failedAttempts < 2 )
          {
          console.log(data.responseParameter);
          //showToastMessage(resp.Result, 'error');
          this.failedAttempts++;
          this.tpinForm.reset();
          }
          else{
            this.router.navigateByUrl('/resetTpin');
            this.failedAttempts == 0;
          }
        }
        else{
          this.errorMsg = data.responseParameter.Result;
          this.openPopup('error1');
          this.tpinForm.reset()
        }
    });
  }

  
  openPopup(popupName) {
    this.commonMethod.openPopup('div.popup-bottom.' + popupName);
    }
    maskCharacter(str, n) {
      return ('' + str).slice(0, -n).replace(/./g, 'X') + ('' + str).slice(-n);
    }




    // *******************Common functionalities********************************


    onKeyUpEvent(index: any, event: any, type: any) {
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
          if (type == 'mpin') {
            this.mPinForm.get(this.mpinInput[index])?.setValue("");
          } else if (type == 'newMpin') {
            this.mPinForm.get(this.mpinNewInput[index])?.setValue("");
          }else if (type == 'cMpin') {
            this.mPinForm.get(this.mpinConfirmInput[index])?.setValue("");
          }
  
          else if (type == 'tpin') {
            this.tpinForm.get(this.tpinInput[index])?.setValue("");
          } else if (type == 'newTpin') {
            this.tpinForm.get(this.tpinNewInput[index])?.setValue("");
          }else if (type == 'cTpin') {
            this.tpinForm.get(this.tpinConfirmInput[index])?.setValue("");
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
      if (type == 'mpin') {
        return this.mPinRows._results[index].nativeElement;
      }else if (type == 'newMpin') {
        return this.newMPinRows._results[index].nativeElement;
      } else   if (type == 'cMpin') {
        return this.confirmMPinRows._results[index].nativeElement;
      } else if (type == 'tpin') {
        return this.tPinRows._results[index].nativeElement;
      }else   if (type == 'newTpin') {
        return this.newTPinRows._results[index].nativeElement;
      } else   if (type == 'cTpin') {
        return this.confirmTPinRows._results[index].nativeElement;
      } 
    }
    checkRepeatedDigits(val) {
      console.log('checkRepeatedDigits val', val);
      let regex1 = /^([0-9])\1{5}$/;
      if (regex1.test(val)) {
        console.log("repeated true");
        // this.repeatedDigits = true;
        return true;
      } else {
        console.log("repeated false");
        // this.repeatedDigits = false;
        return false;
      }
    }
  
    checkConsecutiveDigits(val) {
      console.log('checkConsecutiveDigits val === ', val);
  
      if (val == "012345" || val == "123456" || val == "234567" || val == "345678" || val == "456789" || val == "567890") {
        console.log("consecutive true");
        // this.consecutiveDigits = true;
        return true;
      } else if (val == "987654" || val == "876543" || val == "765432" || val == "654321" || val == "543210" || val == "098765") {
        console.log("consecutive true");
        // this.consecutiveDigits = true;
        return true;
      } else {
        console.log("consecutive false");
        // this.consecutiveDigits = false;
        return false;
      }
    }
   
}
