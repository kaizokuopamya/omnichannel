import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../app.constant';
import { EncryptDecryptService } from '../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataService } from '../../../../../app/services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';


@Injectable({
  providedIn: 'root'
})
export class ProfileDetailsService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService : DataService,
    public common : CommonMethods,
    private localStorage: LocalStorageService,
    private encryptService: EncryptDecryptService,
  ) { }


  /**
   * request parameter for profile details
   */
  getProfileDetailsParam(isUPI?:boolean) {
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_mobileNumber]:this.localStorage.getLocalStorage('mobileNo'),

    }}

    console.log("getProfileDetailsParam", JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
  }

   /**
  * request parameter for update profile
  */
    getProfileImageParam(emailId,userName,permanentAdd,profileImg?) {
      
      var base64Img = '';
      if(profileImg.split(",")[1] != null) base64Img = profileImg.split(",")[1];
      var reqObj
      reqObj = {...this.dataService.commonInputData(), ...{

        [this.constant.key_base64Image]: base64Img,

      }}
      console.log('getProfileUpdateParam',JSON.stringify(reqObj));
      // let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
    }



    limitsView() {
      var reqObj
      reqObj = {...this.dataService.commonInputData(), ...{

        [this.constant.key_typeOfRequest]:"view",

      }}
      console.log("LimitsView", JSON.stringify(reqObj));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
    }


  addLimits1(ibLimits){
  var reqObj
      reqObj = {...this.dataService.commonInputData(), ...{
        [this.constant.key_limitName]:"IBLIMIT",
         [this.constant.key_frequency]:"D",
         [this.constant.key_maxValue]:ibLimits,

      }}
      console.log("LimitsAdd", JSON.stringify(reqObj));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
  }



  addLimits2(mbLimits){
    var reqObj
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_limitName]:"MOBILELIMIT",
      [this.constant.key_frequency]:"D",
      [this.constant.key_maxValue]:mbLimits,

    }}
    console.log("LimitsAdd", JSON.stringify(mbLimits));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(mbLimits));
    return encryptData;
}


addLimits3(upiLimits){
  var reqObj
  reqObj = {...this.dataService.commonInputData(), ...{

    [this.constant.key_limitName]:"UPILIMIT",
    [this.constant.key_frequency]:"D",
     [this.constant.key_maxValue]:upiLimits,

  }}
  console.log("LimitsAdd", JSON.stringify(reqObj));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
  return encryptData;




}
  addLimits4(wbLimits){
    var reqObj
    reqObj = {...this.dataService.commonInputData(), ...{
  
      [this.constant.key_limitName]:"WATCHLIMIT",
      [this.constant.key_frequency]:"D",
      [this.constant.key_maxValue]:wbLimits,
  
    }}
    console.log("LimitsAdd", JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
  }


  getEmailIdUpdateParam(emailId) {

    var reqObj
    reqObj = {...this.dataService.commonInputData(), ...{
  
      [this.constant.key_UserID]: this.dataService.userName,
      [this.constant.key_Email]: emailId.toLowerCase(),
      [this.constant.key_referenceNumber]:this.dataService.profileDetails[0].referenceNumber
  
    }}
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
  }

  getChannelLeadOtpParam(otp)
  {
     var reqObj
    reqObj = {...this.dataService.commonInputData(), ...{
  
      [this.constant.key_deviceId]:this.storage.getLocalStorage(this.constant.storage_deviceId),
     [this.constant.key_mobileNumber]:this.localStorage.getLocalStorage('mobileNo'),
     [this.constant.key_OTP]:otp,
     [this.constant.key_service_Type]: this.constant.val_REGISTRATION
  
    }}
    console.log(JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;

  }
  getChannelLeadOtpParamlimit(otp,requestRRN?:any)
  {
    var reqObj
    reqObj = {...this.dataService.commonInputData(), ...{
  
      [this.constant.key_deviceId]:this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo]:this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_OTP]:otp,
      [this.constant.key_service_Type]: this.constant.val_REGISTRATION,
      [this.constant.key_requestRRN] : requestRRN ? requestRRN : '',
  
    }}
    console.log(JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;

  }

  getResendOTPSessionParam(type)
  
  {

    var reqObj
    reqObj = {...this.dataService.commonInputData(), ...{
  
      [this.constant.key_deviceId]:this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo]:this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_service_Type]: type
  
    }}
    console.log(JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;


  }



  getVerifyTPINReq(tpinVal) {
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_UserID]:this.localStorage.getLocalStorage(this.constant.storage_username) ? this.localStorage.getLocalStorage(this.constant.storage_username) :this.dataService.omniProfileName,
      [this.constant.key_typeOfPin]:'TPIN',
      [this.constant.key_TPIN]: this.encryptDecryptService.createMD5Value(tpinVal),
  
    }}

    console.log(reqObj);
    return this.encryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj))
  }

  addLimitsNew(ibLimits,mbLimits,upiLimits,wbLimits,blLimits,){
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_UPILIMIT]:"UPILIMIT~"+upiLimits,
      [this.constant.key_WATCHLIMIT]:"WATCHLIMIT~"+wbLimits,
      [this.constant.key_MOBILELIMIT]:"MOBILELIMIT~"+mbLimits,
      [this.constant.key_IBLIMIT]:"IBLIMIT~"+ibLimits,
      [this.constant.key_BBPSLIMIT]:"BBPSLIMIT~"+blLimits,
      [this.constant.key_LIMITTYPE_G_C]:"C",
      [this.constant.Key_type]:"C",
      [this.constant.key_frequency]:"D",
      [this.constant.key_omni_methodName]:"ADDLIMITS",
     // [this.constant.key_omni_value]: mobileOtp,
      
    }}
    console.log("LimitsAdd", JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return reqObj;
  }


  getSaveAuthenticationMode(authMode){
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_authFlag]: authMode

    }}
    console.log("getSaveAuthenticationMode", JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return reqObj;
  }


  

  getRekycParam(username,cif) {
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      
      [this.constant.key_UserID]:username,
      [this.constant.key_deviceId]:this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_omni_cif]:cif
    }}
    console.log('getRekycParam',JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
  }


}
