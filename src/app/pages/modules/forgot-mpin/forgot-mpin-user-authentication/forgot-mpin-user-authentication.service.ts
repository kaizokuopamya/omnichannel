import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotMpinUserAuthenticationService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService
  ) { }


  getMaskDetailsParams()
 {var inputData = {...this.dataService.commonInputData(),...{
     [this.constant.key_deviceId]:this.constant.deviceID,
     [this.constant.Key_username]:this.localStorage.getLocalStorage(this.constant.Key_username),
    }
 }
   console.log(JSON.stringify(inputData));
   let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
   return encryptData;

 }


 getValidateUserPwdParams(formData)
 {
   var inputData = {...this.dataService.commonInputData(),...{
     [this.constant.key_langCode]:"en",
     [this.constant.key_password]:this.encryptDecryptService.createMD5Value(formData.password),
     [this.constant.Key_username]:formData.username,
   }
 }
   console.log(JSON.stringify(inputData));
   let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
   return encryptData;

 }


 getChannelLeadOtpParam(mobileOtp, emailOtp, refNo , requestRRN)
 {var inputData = {
    ...this.dataService.commonInputData(),...{
    [this.constant.key_emailOtp] : emailOtp,
    [this.constant.key_mobileOtp] : mobileOtp,
    [this.constant.key_referenceNumber] : refNo,
    [this.constant.key_requestRRN] : requestRRN ? requestRRN : '',
   }
 }
   console.log(JSON.stringify(inputData));
   let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
   return encryptData;

 }

 getResendOTPParams(type)
 {
  var inputData = {...this.dataService.commonInputData(),...{
    [this.constant.key_MobileNo]:this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
    [this.constant.key_service_Type]: type}
}
 console.log(JSON.stringify(inputData));
 let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
  return encryptData;
 }
}

