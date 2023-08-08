import { Injectable, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonOtpService   {
  devicedata:any
   constructor(
    private constant: AppConstants, 
    private encryptService: EncryptDecryptService,
    private constants: AppConstants, 
    private localStorage: LocalStorageService, 
    private dataService: DataService, 
    private encryptDecryptService: EncryptDecryptService,
    private commonMethod: CommonMethods
  ) { }


  getResendOTPReqParam(serviceType) {
    var reqObj;
     reqObj = {...this.dataService.commonInputData(), ...{
       [this.constant.key_requestType]:this.constant.val_requestType,
        [this.constant.key_deviceId]:this.localStorage.getLocalStorage("deviceId") == undefined ? this.constant.deviceID : this.localStorage.getLocalStorage("deviceId"),
       [this.constant.key_mobileNumber]:this.localStorage.getLocalStorage('mobileNo'),
       [this.constant.key_service_Type]: serviceType
     }}
 
     console.log(reqObj);
     return this.encryptService.encryptText(this.constant.staticKey, JSON.stringify(reqObj))
   }



   
 getOTPVerificationParam(otp,serviceType,requestRRN,mobStaticEncKey?){
  var reqObj;
  reqObj = {...this.dataService.commonInputData(), ...{
    [this.constant.key_deviceId]: this.localStorage.getLocalStorage("deviceId") == undefined ? this.constant.deviceID : this.localStorage.getLocalStorage("deviceId"),
    [this.constant.key_service_Type]: serviceType,
    [this.constant.key_otp]: otp,
    [this.constant.key_requestRRN] : requestRRN ? requestRRN : '',
    [this.constant.key_mobileNumber]:this.localStorage.getLocalStorage('mobileNo')
  }}
    console.log(reqObj);
    let enc = mobStaticEncKey ? mobStaticEncKey : this.constant.staticKey;
    console.log('mobStaticEncKeyhhhhhhhhhhhhhhhhhhhhhh ',this.dataService.mobStaticEncKey);

    return this.encryptService.encryptText(enc, JSON.stringify(reqObj));
 }



 getOTPVerificationCustomParam(param, otp , keyname, mobStaticEncKey?){
  var val_keyName = keyname? keyname: 'value'
  
  var reqObj;
  reqObj = {...param, ...{

    [val_keyName]: otp,

  }}
    console.log("getOTPVerificationCustomParam ====>" , reqObj);
    let enc = mobStaticEncKey ? mobStaticEncKey : this.constant.staticKey;
    console.log('mobStaticEncKeyhhhhhhhhhhhhhhhhhhhhhh ',this.dataService.mobStaticEncKey);

    return this.encryptService.encryptText(enc, JSON.stringify(reqObj));
 }
}
