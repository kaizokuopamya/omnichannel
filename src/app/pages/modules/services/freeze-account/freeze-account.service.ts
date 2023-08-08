import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FreezeAccountService {

  constructor(
    private constant:AppConstants,
    private dataService:DataService,
    public storage:LocalStorageService,
    private encryptDecryptService:EncryptDecryptService,
    private commonMethod: CommonMethods
  ) { }

   /**
   * request parameter for Freeze accounts
   */
    freezeAccountParam(formData) {

      var inputData = {
        ...this.dataService.commonInputData(),...{
          [this.constant.key_accountNo]: formData.accountNumber,
          [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.key_deviceId),
          ['freezeAcctData']: 'D' + "|" + formData.remarks,
          [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
        }
      }

      console.log("freezeAccountParam", JSON.stringify(inputData));
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

    freezeAccountParamCIF(formData) {

      var inputData = {
        ...this.dataService.commonInputData(),...{
          [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.key_deviceId),
          ['freezeAcctCIFData']:this.dataService.userDetails.cifNumber + "|" + 'D' + "|" + formData.remarks,
          [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
        }
      }
       console.log("freezeAccountParamCIF", JSON.stringify(inputData));
       let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
       return encryptData;
    }

    getAccountEnquiryParam(customerAccDetails){
      var inputData = {
        ...this.dataService.commonInputData(),...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: customerAccDetails[0].accountNo ,//15081000001825 customerAccDetails.accountNo
        [this.constant.key_branchCode]: customerAccDetails[0].branchCode,//G1509
        }
      }
      console.log(' getAccountEnquiryParam ', JSON.stringify(inputData));

      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
     }


}

