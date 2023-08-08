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
export class DashboardService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private common: CommonMethods,
    private datepipe: DatePipe
  ) { }

  /**
  * request parameter for balance enquiry
  */
  getBalEnqParam(customerAccDetails) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountno]: customerAccDetails.accountNumber
      }
    }
    console.log(' getBalEnqParam ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  /**
   * request parameter to get frequent transaction
   */
  getFrequentTransacParam(mpin?: any) {
    var inputData = { ...this.dataService.commonInputData() };
    if (mpin) {
      inputData[this.constant.key_loginType] = this.constant.val_loginTypeMPIN;
      inputData[this.constant.key_MobileNo] = this.storage.getLocalStorage(this.constant.storage_mobileNo);
      inputData[this.constant.key_MPIN] = this.encryptDecryptService.createMD5Value(this.dataService.mpin);
    } else {
      inputData[this.constant.key_loginType] = this.constant.val_loginType;
      inputData[this.constant.key_UserID] = this.storage.getLocalStorage(this.constant.storage_username);
    }
    console.log("FREQUENTTRANS Paramas  ====== > " + JSON.stringify(inputData))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage("sessionKey"), JSON.stringify(inputData));
    return encryptData;
  }

  /**
  * request parameter for getting card list
  */
  getRequestForCardList(mpin?: any, isBiometric?: any) {
    var inputData = { ...this.dataService.commonInputData() };
    if (mpin) {
      inputData[this.constant.key_loginType] = this.constant.val_loginTypeMPIN;
      inputData[this.constant.key_MobileNo] = this.storage.getLocalStorage(this.constant.storage_mobileNo);
      inputData[this.constant.key_MPIN] = this.encryptDecryptService.createMD5Value(this.dataService.mpin);;
    } else if (isBiometric) {
      inputData[this.constant.key_loginType] = this.constant.val_bioMetric;
      inputData[this.constant.key_MobileNo] = this.storage.getLocalStorage(this.constant.storage_mobileNo);
    } else {
      inputData[this.constant.key_loginType] = this.constant.val_loginType;
      inputData[this.constant.key_UserID] = this.storage.getLocalStorage(this.constant.storage_username);
    }
    console.log("getRequestForCardList", JSON.stringify(inputData));
    console.log('session key ', this.storage.getSessionStorage(this.constant.val_sessionKey));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  /**
  * Get Invest with us Request
  */
  getOfferCradsparam(type) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_ServiceTypeOffer]: type
      }
    }

    console.log('get offer card ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  getIFSCFundTransferParam(formData1, formData2, toUserAccount) {

    if (formData2.remark == null || formData2.remark == '') {
      formData2.remark = "-"
    }
    //TODO: need to discuss later about parameter repetaion and
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: formData1.IFSCCode,
        [this.constant.key_remarks]: formData2.remark,
        [this.constant.key_txnAmt]: formData2.amount.trim().replace(/[^.0-9]+/g, ''),
        [this.constant.key_payerName]: "A",
        [this.constant.key_payeeName]: "",
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerAccount]: formData2.chooseAccount,
        [this.constant.key_payeeIfsc]: formData1.IFSCCode,
        [this.constant.key_accountNo]: formData2.chooseAccount,
        [this.constant.key_payeeAccount]: toUserAccount,
        [this.constant.key_amount]: formData2.amount.trim().replace(/[^0-9]+/g, ''), //need to ask
        [this.constant.key_TransactionType]: "IMPS",
        [this.constant.key_limitName]: 'instaoutside'
      }
    }

    this.dataService.setOmniChannelReqParam(this.constant.key_omni_mmidTransfer, JSON.stringify(inputData));//set omni channel req
    console.log('getMMIDFundTransferParam', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getFundTransferParam(formData1, formData2, type) {
    if (formData2.remark == null || formData2.remark == '') {
      formData2.remark = "-"
    }
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_customerID]: '',
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_debitBranchCode]: '0000',
        [this.constant.key_accountNo]: formData2.chooseAccount,
        [this.constant.key_creditBranchCode]: '0000',
        [this.constant.key_toAccount]: formData1.accNumber,
        [this.constant.key_donationId]: '12',
        [this.constant.key_TransactionType]: type,
        [this.constant.key_amount]: formData2.amount.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_remarks]: formData2.remark,
        [this.constant.key_TransactionDate]: this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy hh:mm:ss'),
        [this.constant.key_actionType]: 'Quick',
        [this.constant.key_limitName]: 'instawithin'
      }
    }

    console.log(inputData);

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  getLinkAccparam(accoutNo, mobileNo) {
    var linkData = "~" + accoutNo + "|" + this.storage.getLocalStorage(this.constant.storage_mobileNo) + "|" + "P" + "|~";
    console.log("linkData" + linkData);

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_accountNo]: accoutNo,
        [this.constant.key_requestType]: 'P',
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_linkDelinkData]: linkData,
        [this.constant.key_otpRequired]: 'N',
      }
    }

    console.log("linkAccountParam", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }



  getAccInfoAutoLinkCall(accoutNo, mobileNo) {

    console.log("accoutNo" + accoutNo, " mobileNo" + mobileNo);
    let inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_omni_accountNo]: accoutNo,
        [this.constant.key_MobileNo]: mobileNo,
        [this.constant.key_serviceLocation]: 'DASHBOARD',
      }
    }
    // let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return inputData;

  }

  linkDelinkFetchAccountsList() {
    let inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
        [this.constant.key_customerID]: this.dataService.userDetails.cifNumber,
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_serviceLocation]: 'DASHBOARD'
      }
    }
    console.log("linkAccountParam", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMyAccountList(cifNo) {

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
        [this.constant.key_omniDashData]: cifNo,
      }
    }
    console.log(' getMyAccountParam ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  validatePayee(formDtl) {
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: formDtl.confirmAccountNumber
      }
    }
    console.log("validatepayee", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getBranchFromIFSC(value) {
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: value
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}
