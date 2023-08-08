import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';

@Injectable({
  providedIn: 'root'
})
export class ProfileEditService {

  constructor(private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService : DataService,
    public common : CommonMethods) { }


    // &&&&&& SEARCH PARAMS BY BELOW KEYWORDS &&&&&&&&
    // profile details
    // username update 
    // Email update
    // Address update 
    // Aadhar update
    // PAN update  
    // get profile update for Email 
    // Username Availablility 
    // Aadhar validation



   /**  ********************** request parameter for get profile details ************************/

    getProfileDetailsEditParam(isUPI?:boolean) {
      var reqObj;
      reqObj = {...this.dataService.commonInputData(), ...{
        
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }}
      console.log("getProfileDetailsEditParam", JSON.stringify(reqObj));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
    }


    /**  ********************** request parameter for username update  ************************/
    
    getProfileUpdateParamforUsername(profileDetails,formData) {
      console.log("detailllllllsssss"+profileDetails)
       var base64Img = '';
     // if(profileImg.split(",")[1] != null) base64Img = profileImg.split(",")[1];
     var reqObj;
     reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.Key_customerName]: formData.username.toLowerCase() ,
      [this.constant.key_emailId]: profileDetails[0].emailId.toLowerCase(),
      [this.constant.key_base64Image]: base64Img,
     }}
      console.log('getProfileUpdateParam',JSON.stringify(reqObj));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
    }

    // *********************** request for Email and mobile OTP *********************************


    getValidateLeadsOtpSessionCall( emailId,requestRRN) {
      var   reqObj = {...this.dataService.commonInputData(), ...{
          [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
          [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
          [this.constant.key_omni_emailId] : emailId.toLowerCase(),
          [this.constant.key_referenceNumber]: this.dataService.referenceNo,
          [this.constant.key_service_Type]: this.constant.val_VALIDATEMAILID,
          [this.constant.key_requestRRN] : requestRRN ? requestRRN : '',
        }}
         console.log( "getValidateLeadsOtpSessionCall ====>" , JSON.stringify(reqObj));
      //   let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
         return reqObj;
       }

/**  ****************** request parameter for get profile update for Email  ********************/

    getProfileUpdateParamforEmail(profileDetails,formData)
    { var base64Img = '';
    // if(profileImg.split(",")[1] != null) base64Img = profileImg.split(",")[1];
  var reqObj;
     reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.Key_customerName]: formData.username.toLowerCase() ,
      [this.constant.key_emailId]: profileDetails[0].emailId.toLowerCase(),
      [this.constant.key_base64Image]: base64Img,
     }}
   
     console.log('getProfileUpdateParam',JSON.stringify(reqObj));
     let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
     return encryptData;

    }


    /**  ********************** request parameter for Address update  ************************/

    getProfileUpdateParamforAddress(profileDetails,formData)
    { var base64Img = '';
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
     [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
     [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
     [this.constant.Key_customerName]: formData.username.toLowerCase() ,
     [this.constant.key_emailId]: profileDetails[0].emailId.toLowerCase(),
     [this.constant.key_base64Image]: base64Img,
     [this.constant.key_address]:formData.address1+','+formData.address2+','+formData.address3+','+formData.city+','+formData.state+','+formData.pinCode+',',
       
    }}
    //if(profileImg.split(",")[1] != null) base64Img = profileImg.split(",")[1];
       //var addressProof='';
  
     console.log('getProfileUpdateParam',JSON.stringify(reqObj));
     let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
     return encryptData;

    }

    

/**  ********************** request parameter for Aadhar update  ************************/

    getProfileUpdateParamForAadhar(formData)
    {
      var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
     [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
     [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
     [this.constant.key_referenceNumber]:this.dataService.profileDetails[0].referenceNumber,
     [this.constant.key_aadharUpdateData]:formData.aadhar
    }}
    
      console.log('getProfileUpdateParam',JSON.stringify(reqObj));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
    }



/**  ********************** request parameter for PAN update  ************************/

    getProfileUpdateParamForPAN(formData)
    {
      console.log()
      var reqObj;
      reqObj = {...this.dataService.commonInputData(), ...{
       [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
       [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
       [this.constant.key_referenceNumber]:this.dataService.profileDetails[0].referenceNumber,
       [this.constant.key_panUpdateData]:formData.pan
      }}
      
      console.log('getProfileUpdatePANParam.....',JSON.stringify(reqObj));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
      return encryptData;
    }

 

/**  ********************** request parameter for Username Availablility  ************************/
  
   getCheckAvaiablityParam(username) {
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
     [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),  
     [this.constant.key_UserID]: username
    }}
    console.log('getCheckAvaiablityParam', JSON.stringify(reqObj));
    // console.log('encrypt key ',this.localStorage.getLocalStorage('mobileNo')+this.constant.mapEncryptKey);
    let key = this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey;
    console.log("key ", key);

    let encryptData = this.encryptDecryptService.encryptText(key, JSON.stringify(reqObj));
    return reqObj;
  }


/**  ********************** requests parameter for Aadhar validation  ************************/

  getAadharValidation(aadharNo,transactionId){
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_aadharNumber]: aadharNo,
      [this.constant.key_npci_txnId] : transactionId,
    }}
  
    console.log("aadhar request", reqObj);
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(reqObj));
    //return inputData;
    return encryptData;
  }
  
  getValidateAadharValidation(aadharNo,transactionId){
    var reqObj = { ...this.dataService.commonInputData(), ...{
   
      [this.constant.key_aadharNumber]: aadharNo,
      [this.constant.key_npci_txnId] : transactionId,
      [this.constant.key_referenceNumber]: this.common.genRandomDigit(9)
    }}

    console.log("aadhar request", reqObj);
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(reqObj));
    //return inputData;
    return encryptData;
  }
   /**  ********************** request parameter for Email update  ************************/


  getEmailIdUpdateParam(emailId) {
    var reqObj = { ...this.dataService.commonInputData(), ...{
    [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
    [this.constant.key_UserID]: this.dataService.userName,
    [this.constant.key_Email]: emailId.toLowerCase(),
    [this.constant.key_referenceNumber]:this.dataService.profileDetails[0].referenceNumber
  }}
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
  return encryptData;
}

}

