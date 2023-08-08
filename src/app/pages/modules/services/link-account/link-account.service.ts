import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LinkAccountService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService : DataService,
    private commonMethod : CommonMethods,
    private localStorage: LocalStorageService,
  ) { }

  /**
   * request parameter for Link accounts
   */
   linkAccountParam(linkDelikItem,isOtpReq) {
    var linkData = "~" + linkDelikItem.accountNo + "|" + this.storage.getLocalStorage(this.constant.storage_mobileNo) + "|" + "L" + "|~";
    console.log("linkData" + linkData);

    var inputData = {
      ...this.dataService.commonInputData(),...{ 
      [this.constant.key_accountNo]: linkDelikItem.accountNo,
      [this.constant.key_requestType]:'LINK',
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
      [this.constant.key_MobileNo_Org]:this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_linkDelinkData]:linkData,
      [this.constant.key_otpRequired]: isOtpReq,
      }
    }

    console.log("linkAccountParam", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getResendLeadOtpParam(linkingMobileNumber){
    var inputData = {
      ...this.dataService.commonInputData(),...{ 
      [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_existingMobileNumber] : this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_linkingMobileNumber] : linkingMobileNumber,
      [this.constant.key_service_Type]: this.constant.val_LINK
      }
    }
    console.log("getValidateLeadOtpParam", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }

  getValidateLeadOtpParam(existingMobileOTP,linkingMobileOTP,methodName,customerId,requestRRN){
    var inputData = {
      ...this.dataService.commonInputData(),...{ 
      [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_existingMobileNumber] : existingMobileOTP,
      [this.constant.key_linkingMobileNumber] : linkingMobileOTP,
      [this.constant.key_referenceNumber] : this.commonMethod.genRandomDigit(9),
      [this.constant.key_service_Type]: this.constant.val_LINK,
      [this.constant.key_methodName]: methodName,
      [this.constant.key_customerID] : customerId,
      [this.constant.key_requestRRN] : requestRRN ? requestRRN : '',
      }
    }
    console.log("getValidateLeadOtpParam", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }

  linkDelinkFetchAccountsList() {
    var inputData = {
      ...this.dataService.commonInputData(),...{ 
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
      [this.constant.key_omni_customerID]: this.dataService.userDetails.cifNumber,
      [this.constant.key_MobileNo_Org]:this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_referenceNumber]: this.commonMethod.genRandomDigit(9),
      }
  }
    console.log("linkAccountParam", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
    //return inputData;
  }
  getMyAccountList(cifNo) {

    var inputData = {
      ...this.dataService.commonInputData(),...{  
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_omniDashData]: cifNo,
      }
    }
    console.log(' getMyAccountParam ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
  delinkAccountParam(linkDelikItem) {
    var linkData = "~" +  linkDelikItem.accountNo + "|" + this.storage.getLocalStorage(this.constant.storage_mobileNo) + "|" + "D" + "|~";
    console.log("linkData" + linkData);
 
    var inputData = {
      ...this.dataService.commonInputData(),...{ 
      [this.constant.key_accountNo]: linkDelikItem.accountNo,
      [this.constant.key_requestType]:'DELINK',
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
      [this.constant.key_MobileNo_Org]:this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_linkDelinkData]:linkData
      }
    }
 
    console.log("linkAccountParam", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getAccInfoAutoLinkCall(accoutNo,mobileNo) {

    console.log("accoutNo" + accoutNo , " mobileNo" + mobileNo);
    let inputData = {
      ...this.dataService.commonInputData(),...{ 
      [this.constant.key_deviceId]:this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_omni_accountNo]: accoutNo,
      [this.constant.key_MobileNo]: mobileNo,
      [this.constant.key_cifNumber] : this.dataService.regFeildData.custId,
      }
    }
    return inputData;
  }

}

