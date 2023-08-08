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
export class AccountsDetailedStatementService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    public datePipe: DatePipe,
  ) { }

  /**
  * request parameter for transaction
  */
  getTransactionParam(formData) {
    var datePipe = new DatePipe("en-US");

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountno]: formData.transferFrom,
        [this.constant.key_remarks]: formData?.remarks,
        [this.constant.key_transType]: formData?.transType,
        [this.constant.key_fromAmount]: formData.hasOwnProperty('fromAmount') ? formData?.fromAmount.replace(/[^0-9]+/g, '') : null,
        [this.constant.key_toAmount]: formData.hasOwnProperty('toAmount') ? formData?.toAmount.replace(/[^0-9]+/g, '') : null,
        [this.constant.key_fromdate]: formData?.fromDate != undefined ? datePipe.transform(formData?.fromDate, 'dd-MMM-yy') : undefined,//dd-MMM-yy
        [this.constant.key_todate]: formData?.toDate != undefined ? datePipe.transform(formData?.toDate, 'dd-MMM-yy') : undefined,//dd-MMM-yy
        [this.constant.key_period]: formData?.selType,
      }
    }
    console.log("detail statement params", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getSelectPeriodParam() {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId)
      }
    }
    console.log("getSelectPeriodParams ", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


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

  getMyAccountList(cifNo) {

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_omniDashData]: cifNo,
      }
    }
    console.log(' getMyAccountParam ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getDetailedStatementParam(customerAccDetails, dtlStatement) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: customerAccDetails.accountNo,
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_detailedStatementData]: dtlStatement
      }
    }
    console.log("getSelectPeriodParams ", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;

  }


  getDashboardHeader(customerAccDetails, formData, selectPeriodDtl, type) {
    var fromDate = "", toDate = "";

    if (type == 'period') {
      fromDate = selectPeriodDtl.fromDate;
      toDate = selectPeriodDtl.toDate;
    }
    else if (type == 'dateRange') {
      fromDate = formData.fromDate;
      toDate = formData.toDate;
    }
    else if (type == 'transactionCount') {
      fromDate = selectPeriodDtl.fromDate;
      toDate = "" + new Date()
    }

    var dashboardData = "" + customerAccDetails.accountNo + "|" + this.datePipe.transform(fromDate, 'ddMMyyyy') + "|" + this.datePipe.transform(toDate, 'ddMMyyyy') + "|";
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_dashboardHeaderData]: dashboardData
      }
    }
    console.log("getSelectPeriodParams ", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getAssessmentYearCall(type) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_cbsType]: this.constant.val_cbsTypeTcs,
        [this.constant.key_configType]: type,
      }
    }
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getAccountEnquiryParam(customerAccDetails) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: customerAccDetails.accountNo,//15081000001825 customerAccDetails.accountNo
        [this.constant.key_branchCode]: customerAccDetails.branchCode,//G1509
      }
    }
    console.log(' getAccountEnquiryParam :  ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  //LOAN BORRWOING
  depositeAccountEquirey(accNo) {
    var inputData = {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_cbsType]: this.constant.val_cbsTypeTcs,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_RRN]: this.commonMethod.genRandomDigit(9).toString(),
      [this.constant.key_referenceNumber]: this.commonMethod.genRandomDigit(9).toString(),
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
      [this.constant.key_subCode]: "01",//for enquiry
      [this.constant.key_accountNo]: accNo,
      [this.constant.key_MobileNo_Org] : this.storage.getLocalStorage(this.constant.storage_mobileNo),



    }
    console.log(' getMyAccountParam ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMyLoansInquiry(accNo,branchCode) {
    var inputData = {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_cbsType]: this.constant.val_cbsTypeTcs,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_RRN]: this.commonMethod.genRandomDigit(9),
      [this.constant.key_referenceNumber]: this.commonMethod.genRandomDigit(9),
      [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
      [this.constant.key_accountNo]: accNo,
      [this.constant.key_subCode] : "01",
      [this.constant.key_branchCode]: branchCode
    }
    console.log('getLoanParam', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


}




