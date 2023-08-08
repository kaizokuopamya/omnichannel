import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InstantPayService {

  constructor(
    private constant:AppConstants,
    private storage:LocalStorageService,
    private dataService:DataService,
    private encryptDecryptService:EncryptDecryptService,
    private common: CommonMethods,
    private datepipe: DatePipe
  ) { }

  getAccountBalanceParam(selectAccount) {
    console.log(selectAccount)
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.constant.deviceID,
      [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_branchCode]: "0181",
      [this.constant.key_accountNo]:selectAccount,
    }
  }
    console.log("Get Balance params =====>" + JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getBranchFromIFSC(value) {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: value
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
        [this.constant.key_accountNo]: formDtl.confirmAccountNumber
      }
    }

    console.log("validatepayee", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getNameInquiryAccountIFSC(formData , accountNo){

    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_ifsc_code]: formData.ifsc,
        [this.constant.key_accountNo]: accountNo,
        [this.constant.key_payerName]: "ABCD",
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerAccount]: accountNo,
        [this.constant.key_payeeIfsc]: formData.ifsc,
        [this.constant.key_payeeAccount]: formData.accountNumber,
      }
    }
    console.log('AccountIFSC', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;

  }

  getNameInquiryMMID(formData, accountNo){

    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: accountNo,
        [this.constant.key_payerName]: "ABCD",
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerAccount]: accountNo,
        [this.constant.key_payeeMobile]: formData.mobileNumber,
        [this.constant.key_payeeMMID]: formData.mmid,
      }
    }
    console.log('InquiryMMID', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getIFSCFundTransferParam(formData, selectedAccount,payeeName,limitName?) {

    console.log("benifiicary name===>");
    if(formData.remark == null || formData.remark == ''){
      formData.remark = "-"
    }
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: formData.payeeName,
        [this.constant.key_remarks]: formData.remark,
        [this.constant.key_txnAmt]: formData.amount.trim().replace(/[^.0-9]+/g, ''),
        [this.constant.key_payerName]: "A",
        [this.constant.key_payeeName]: formData.payeeName,
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerAccount]: selectedAccount,
        [this.constant.key_payeeIfsc]: formData.ifsc,
        [this.constant.key_accountNo]: selectedAccount,
        [this.constant.key_payeeAccount]: formData.confirmAccountNumber,
        [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_actionType]: 'Quick', //need to ask,
        [this.constant.key_senderName]: this.dataService.userDetails?.customerName,
        [this.constant.key_receiverName]: payeeName,
        [this.constant.key_TransactionType]: "IMPS",
        [this.constant.key_limitName]: limitName
      }
    }
    this.dataService.setOmniChannelReqParam(this.constant.key_omni_mmidTransfer, JSON.stringify(inputData));//set omni channel req
    console.log('getMMIDFundTransferParam', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMMIDFundTransferParam(formData, selectedAccount, payeeName,limitName?) {

    console.log("benifiicary name===>");
    if(formData.mmidRemark == null || formData.mmidRemark == ''){
      formData.mmidRemark = "-"
    }
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: "",
        [this.constant.key_remarks]: formData.mmidRemark,
        [this.constant.key_txnAmt]: formData.amount.trim().replace(/[^.0-9]+/g, ''),
        [this.constant.key_payerName]: "",
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerAccount]: selectedAccount,
        [this.constant.key_payeeIfsc]: "",
        [this.constant.key_accountNo]: selectedAccount,
        [this.constant.key_payeeAccount]: "",
        [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, ''), //need to ask
        [this.constant.key_payeeMMID]: formData.mmid,
        [this.constant.key_payeeName]: formData.payeeName,
        [this.constant.key_payeeMobile]: formData.confirmMobileNumber,
        [this.constant.key_payerMMID]: "",
        [this.constant.key_actionType]: 'Quick',
        [this.constant.key_senderName]: this.dataService.userDetails?.customerName,
        [this.constant.key_receiverName]: payeeName,
        [this.constant.key_transType]: 'IMPS',
        [this.constant.key_limitName]: limitName
      }
    }
    console.log('getMMIDFundTransferParam', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getFundTransferParam(formData, selectedAccount, type, payeeName,limitName?){
    console.log("benifiicary name===>");

    if(formData.remark == null || formData.remark == ''){
      formData.remark = "-"
    }
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_customerID]: '',
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_debitBranchCode]: '0000',
        [this.constant.key_accountNo]: selectedAccount,
        [this.constant.key_creditBranchCode]: '0000',
        [this.constant.key_toAccount]: formData.accountNumber,
        [this.constant.key_donationId]: '12',
        [this.constant.key_TransactionType]: type,
        [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_remarks]: formData.remark,
        [this.constant.key_TransactionDate]: this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy hh:mm:ss'),
        [this.constant.key_actionType]: 'Quick',
        [this.constant.key_senderName]: this.dataService.userDetails?.customerName,
        [this.constant.key_receiverName]: payeeName,
        [this.constant.key_limitName]: limitName
      }
    }
    console.log(inputData);

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  validateOutsidePayee(formDtl, ifsc ,selectedAccount) {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: ifsc,
        [this.constant.key_accountNo]: selectedAccount,
        [this.constant.key_payerAccount]: selectedAccount,
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerName]: this.dataService.userDetails?.customerName,
        [this.constant.key_payeeIfsc]: formDtl.ifsc,
        [this.constant.key_payeeAccount]: formDtl.confirmAccountNumber,
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      }
    }

    console.log("validateOutsidePayee", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  /**
   * Creating request for search ifsc code
   */
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

  getAccountEnquiryParam(customerAccDetails){

    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: customerAccDetails.accountNo,//15081000001825 customerAccDetails.accountNo
        [this.constant.key_branchCode]: customerAccDetails.branchCode,//G1509
      }
    }
    console.log(' getAccountEnquiryParam ', JSON.stringify(inputData));
  
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
   }

}
