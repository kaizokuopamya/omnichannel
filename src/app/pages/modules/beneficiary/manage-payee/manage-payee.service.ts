import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ManagePayeeService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    public dataService: DataService
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

  deletePayeeParam(item){
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_beneficiary_account_no]: item.beneficiary_account_no,
        [this.constant.Key_ID]: item.ID,
        [this.constant.key_transactionLimit]: item.maxAmount
      }
    }

  console.log("delete manage requrest=====>"+JSON.stringify(inputData));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
  }

  AddfavouritePayee(id, txn_type){
    var txn_type_id = "";
    if(txn_type == 'within') {
      txn_type_id = "1";
    }
    else if(txn_type == 'outside') {
      txn_type_id = "2";
    }
    else if(txn_type == 'mmid') {
      txn_type_id = "3";
    }
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_beneficiary_id]: id,
      [this.constant.key_txn_Type]: txn_type_id,
    }}

  console.log("delete manage requrest=====>"+JSON.stringify(inputData));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
  }

  DeletefavouritePayee(id, txn_type){
    var txn_type_id = "";
    if(txn_type == 'within') {
      txn_type_id = "1";
    }
    else if(txn_type == 'outside') {
      txn_type_id = "2";
    }
    else if(txn_type == 'mmid') {
      txn_type_id = "3";
    }
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_beneficiary_id]: id,
        [this.constant.key_txn_Type]: txn_type_id,
      }
    }

  console.log("delete manage requrest=====>"+JSON.stringify(inputData));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
  }


}
