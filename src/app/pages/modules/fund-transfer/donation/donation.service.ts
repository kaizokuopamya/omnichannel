import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(
    private constant:AppConstants,
    private dataService:DataService,
    private encryptDecryptService:EncryptDecryptService,
    private storage:LocalStorageService,
    public common:CommonMethods
  ) { }


  getDonationList() {
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(),...{  
      ["typeOfRequest"] : "RETAIL"}
    }

    console.log('getDonationRequest',JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getDonationFundTransferParam(formData , fromAccount , toAccount , paymentMode , ID,companyName){
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(),...{  
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_accountNo] : fromAccount,
      [this.constant.key_toAccount]: toAccount,
      [this.constant.key_amount]: formData?.amount.trim().replace(/[^0-9]+/g,''),
      [this.constant.key_remarks]: formData.remarks ?  formData.remarks : "-",
      [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_referenceNumber]: this.common.genRandomDigit(9), //need to change later
      [this.constant.key_transType]: paymentMode,
      [this.constant.key_donationId]: ID,
      [this.constant.key_debitBranchCode]: '0000',
      [this.constant.key_creditBranchCode]: '0000',
      [this.constant.key_senderName]: this.dataService.userDetails?.customerName,
      [this.constant.key_receiverName]: companyName,
      [this.constant.key_actionType]:'Donation',
      [this.constant.key_TransactionType]: 'Donation',
      [this.constant.key_limitName]:'donation',
      }
    }

    console.log("donation inputData" + inputData);
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
  }


  getAccountBalanceParam(selectAccount)
  {
    console.log(selectAccount)
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(),...{  
      [this.constant.key_deviceId]: this.constant.deviceID,
      [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_referenceNumber]:this.common.genRandomDigit(9),
      [this.constant.key_branchCode]: "0181",
      [this.constant.key_accountNo]:selectAccount,
      }
    }
    console.log("Get Balance params =====>" + JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}

