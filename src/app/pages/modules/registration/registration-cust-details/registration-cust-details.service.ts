import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationCustDetailsService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods
  ) { }


  
  getValidateCustDtlParam(custId, accNo, emailId, deviceID) {
    let custAccData = this.localStorage.getLocalStorage(this.constant.storage_mobileNo) + "|" + custId + "|" + accNo;
    var inputData = {...this.dataService.commonInputData(), ... {
        [this.constant.key_deviceId]: deviceID,
        [this.constant.key_MobileNo_Org]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_MobileNo]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_omni_customerID]: custId,
        [this.constant.key_omni_accountNo]: accNo,
        [this.constant.key_omni_custAccountData]: custAccData,
        [this.constant.key_omni_emailId]: emailId.toLowerCase(),
        [this.constant.key_cifNumber]: custId,
        [this.constant.key_customerType]: this.dataService.loginFrom == 'retail' ? 'C' : 'N',
        [this.constant.key_appName]: this.dataService.regType.toUpperCase(),
        [this.constant.key_userTypeScreen]: this.dataService.regType.toLowerCase() == 'nri' ? 'NRE' : 'RETAIL'
      }
    }
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }
}
