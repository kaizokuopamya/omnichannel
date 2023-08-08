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
export class LoanMiniStatementService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    public datePipe: DatePipe,
  ) { }

  getRecommendedOffersReq() {
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }
    }
    console.log('getRecommendedOffersReq : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getRepaymentStatusParam(loanAccNo) {
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_loanAccountNumber]: loanAccNo,
      }
    }
    console.log('getRepaymentStatusParam : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getAssessmentYearCall() {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_configType]: this.constant.val_assessmentYear,
      }
    }
    console.log('getAssessmentYearCall : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMyLoansInquiry(accNo, branchCode) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: accNo,
        [this.constant.key_subCode]: "01",
        [this.constant.key_branchCode]: branchCode
      }
    }
    console.log('getMyLoansInquiry :', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMyLoansMiniStatement(accNo) {

    var fromDate = this.datePipe.transform(new Date().toISOString(), "dd-MM-yyyy");
    var d = new Date();
    d.setMonth(d.getMonth() - 12);
    var toDate = this.datePipe.transform(d.toISOString(), "dd-MM-yyyy");
    var loanMiniStatementData = accNo + "|" + toDate + "|" + fromDate;

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: accNo,
        [this.constant.key_loanMiniStatementData]: loanMiniStatementData,
      }
    }
    console.log(' getMyLoansMiniStatement  :', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getInterestCertificateParamlatra(accountNumber) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_localStorage_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: accountNumber,//15081000001825 customerAccDetails.accountNo
      }
    }
    console.log('getInterestCertificateParamlatra : ', JSON.stringify(inputData));
    console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getprovisionalCertificate(Account, cif) {
    var date = this.datePipe.transform(new Date().toISOString(), "dd-MM-yyyy");
    var year = this.datePipe.transform(new Date().toISOString(), "yyyy");
    console.log("year", year)
    var provisionalIntrestcertData = cif + "|" + "01-04-" + year + "|" + date + "|" + Account;

    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_RRN]: this.commonMethod.genRandomDigit(9),
        [this.constant.key_provisionalIntrestcertData]: provisionalIntrestcertData
      }
    }
    console.log("getprovisionalCertificate : " + JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;

  }

  getInterestCertificateParam(formData, accDtl, selType) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_localStorage_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: formData.accNo,//15081000001825 customerAccDetails.accountNo
        ["depositDetailsData"]: this.getInterstData(formData, selType)//"011928043|01-01-2020|01-01-2021|00001200000057"
      }
    }
    console.log(' getInterestCertificateParam : ', JSON.stringify(inputData));
    console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  getInterestCertificateParamSecond(formData, accDtl) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_localStorage_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: formData.accNo,//15081000001825 customerAccDetails.accountNo
      }
    }
    console.log('getInterestCertificateParamSecond : ', JSON.stringify(inputData));
    console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getBalanceCertificateParam(accDtl) {
    console.log(accDtl);
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: accDtl[0].accountNo,//15081000001825 customerAccDetails.accountNo
        [this.constant.key_referenceNumber]: this.commonMethod.genRandomDigit(9),
        [this.constant.key_branchCode]: accDtl[0].branchCode,
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }
    }
    console.log(' getBalanceCertificateParam : ', JSON.stringify(inputData));
    console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getInterstData(formData, selType) {
    var toDate;
    var fromDate;
    if (selType == 'dateRange') {
      toDate = this.datePipe.transform(formData.toDate, 'dd-MM-yyyy');
      fromDate = this.datePipe.transform(formData.fromDate, 'dd-MM-yyyy');
    } else {
      toDate = "31-03-" + (+formData.period.split('-')[0] + 1);
      fromDate = "01-04-" + formData.period.split('-')[0];
    }

    console.log(toDate);
    console.log(fromDate);
    //  var interestData = ""+this.dataService.userDetails.cifNumber+"|"+toDate+"|"+fromDate+"|"+formData.accNo;
    var interestData = this.dataService.userDetails.cifNumber + "|" + fromDate + "|" + toDate + "|" + formData.accNo;

    return interestData
  }

}
