import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class CommonOtpEmailPopupService {

  constructor(  
    private constant: AppConstants, 
    private encryptService: EncryptDecryptService,
    private storage: LocalStorageService, 
    private dataService: DataService, 
    private encryptDecryptService: EncryptDecryptService,
    private commonMethod: CommonMethods) { }

    getValidateLeadsOtpSessionCall(mobileOtp, emailOtp, emailId,requestRRN) {
    var   reqObj = {...this.dataService.commonInputData(), ...{
       [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
       [this.constant.key_emailOtp] : emailOtp,
       [this.constant.key_mobileOtp] : mobileOtp,
       [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
       [this.constant.key_omni_emailId] : emailId.toLowerCase(),
       [this.constant.key_referenceNumber]: this.dataService.referenceNo,
       [this.constant.key_service_Type]: this.constant.val_VALIDATEMAILID,
       [this.constant.key_requestRRN] : requestRRN ? requestRRN : '',
     }}
      console.log(JSON.stringify(reqObj));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
    }

    getValidateLeadsOtpSessionCallCUSTOM(mobileOtp, emailOtp, params) {
      var   reqObj = { ...params, ...{
        
          [this.constant.key_emailOtp] : emailOtp,
          [this.constant.key_mobileOtp] : mobileOtp,
      
        }}
         console.log(JSON.stringify(reqObj));
         let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
         return encryptData;
       }

  getResendLeadsOtpSessionCall(emailId, otpType) {
    var   reqObj = {...this.dataService.commonInputData(), ...{
      
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_omni_emailId] : emailId.toLowerCase(),
      [this.constant.key_referenceNumber] : this.commonMethod.genRandomDigit(7).toString(),
      [this.constant.key_service_Type]: this.constant.val_CHANGEMAILID,
      [this.constant.key_otpType]: otpType


    }}
    console.log("getValidateLeadOtpParam", reqObj);
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
  }
}
