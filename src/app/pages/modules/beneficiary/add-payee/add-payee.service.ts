import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AddPayeeService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService : DataService,
    private CommonMethod: CommonMethods,
  ) { }

  benificiaryListParam() {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo)
      }
    }
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

   /**
   * Creating request for search swift code
   */
   getInfoBySwiftParams(formData) {
    var inputData = {};
     inputData = {...this.dataService.commonInputData(), ...{
         [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
         [this.constant.key_swiftCode]: formData.swiftCode
       }
     }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getIFSCCodeParams(formData) {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_bankName]: formData.enterBank,
        [this.constant.key_branch_name]: formData.enterBranch
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  validatePayee(formDtl) {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: formDtl.confirmaccountNumber
      }
    }
    console.log("validatepayee", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  _getAddBenficiaryParamss(formData, benificiaryType, bankDtl){
    console.log(benificiaryType);
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_benificiaryType]: benificiaryType,
        [this.constant.key_benficiaryBankName]: benificiaryType == '1' ? this.constant.val_bank_name : bankDtl?.bank, //TODO: need to discuss
        [this.constant.key_bankCode]: '', //TODO: need to discuss
        [this.constant.key_benefName]: benificiaryType == '4' ? formData.payeenickName : formData.payeeName,
        [this.constant.key_beneficiary_account_no]: formData.confirmaccountNumber,
        [this.constant.key_benificiaryNickName]: formData.payeenickName,
        [this.constant.key_beneficiaryMobileNo]: formData.mobileNumber, //TODO: Need to discuss
        [this.constant.key_currency]: "INR", //TODO: Need to discuss
        [this.constant.key_branch_name]: bankDtl?.branch ? bankDtl?.branch : ' ',
        [this.constant.key_MMID]: formData.mmid,
        [this.constant.key_maxAmount]: formData.transactionLimit.trim().replace(/[^.0-9]+/g, ''), //TODO: Need to discuss
        [this.constant.key_ifsc_code]: benificiaryType == '4' ? this.dataService.validateAddressResp.IFSC : formData.ifsc,
        [this.constant.key_VPA]: benificiaryType == '4' ? this.dataService.validateAddressResp.validatedVpa : formData.vpa,
      }
    }

    console.log('add benf ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  editPayeeParam(id,transactionLimit,beneficiaryType){
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.Key_ID]: id,
        [this.constant.key_transactionLimit]: transactionLimit.trim().replace(/[^.0-9]+/g, '')
      }
    }
    
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getBranchFromIFSC(value){
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_ifsc_code]: value
    }}

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
}
}
