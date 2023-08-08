import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChequeBookRequestService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService : DataService,
    private commonMethod : CommonMethods
  ) { }

  getIssueChequebookRequest(accNo, custId, address, pageNo) {
    var issunaceOfchqbookData = this.storage.getLocalStorage(this.constant.storage_mobileNo)+"|"+custId+"|"+accNo+"|"+pageNo+"|"+address;
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountno]: accNo,
        [this.constant.Key_customerId]: custId,
        [this.constant.key_customerAddress]: address,
        [this.constant.key_numberOfPages]: pageNo,
        [this.constant.key_issunaceOfchqbookData]: issunaceOfchqbookData,
      }
    }

    console.log("Issue check book",JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getAddressOfCheckBook(accNo){
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: accNo
      }
    }
    console.log('city Params ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getStateListParams() {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_CountryCode]: "1" //Country code 1 is for india
      }
    }
    console.log("getStateListParams ",JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }

  getCityListParams(stateId) {
    var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_StateId]: stateId
    }}

    console.log('city Params ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }
}
