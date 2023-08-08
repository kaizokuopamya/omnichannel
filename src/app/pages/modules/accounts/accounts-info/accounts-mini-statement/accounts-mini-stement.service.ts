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
export class AccountsMiniStementService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    public datePipe: DatePipe,
  ) { }

  /**
 * request parameter for mini statement
 */
  getMiniStatementParam(customerAccDetails) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: customerAccDetails.accountNo,//"08341000012950" customerAccDetails.accountNo
        [this.constant.key_branchCode]: customerAccDetails.branchCode,//G1509
      }
    }
    console.log(' getMiniStatementParam : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  getCashCreditHistory(accno) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_subCode]: "01",
        [this.constant.key_accountNo]: accno,//08341000012950 customerAccDetails.accountNo
      }
    }
    console.log(' getCashCreditHistory : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
  /**
  * request parameter for balance enquiry
  */
  getBalEnqParam(customerAccDetails) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: customerAccDetails.accountNo,//08341000012950 customerAccDetails.accountNo
        [this.constant.key_branchCode]: customerAccDetails.branchCode,//G1509
      }
    }
    console.log(' getBalEnqParam : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMyAccountList(cifNo) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_omniDashData]: cifNo,
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      }
    }
    console.log(' getMyAccountList : ', JSON.stringify(inputData));

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


  getAccountEnquiryParams(donationReceiptObjssss, branchcode) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: donationReceiptObjssss,//15081000001825 customerAccDetails.accountNo
        [this.constant.key_branchCode]: branchcode,//G1509
      }
    }
    console.log(' getAccountEnquiryParams : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getLienAccountParam(customerAccDetails) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_accountNo]: customerAccDetails.accountNo,//15081000001825 customerAccDetails.accountNo
        [this.constant.key_lienInquiryData]: this.constant.val_upi_ALL
      }
    }
    console.log(' getLienAccountParam : ', JSON.stringify(inputData));
    console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

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


  getBalanceCertificateParam(accDtl) {
    console.log(accDtl);
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: accDtl[0].accountNo,//15081000001825 customerAccDetails.accountNo
        [this.constant.key_branchCode]: accDtl[0].branchCode,
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }
    }
    console.log(' getBalanceCertificateParam : ', JSON.stringify(inputData));
    console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getNomineeData(selectedAccountNo, cifNumber) {
    var inquiryNomineeData = cifNumber + "|" + selectedAccountNo
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_inquiryNomineeData]: inquiryNomineeData,
      }
    }
    console.log(' getNomineeData :  ', JSON.stringify(inputData));
    console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  delinkAccountParam(linkDelikItem) {
    var linkData = "~" + linkDelikItem + "|" + this.storage.getLocalStorage(this.constant.storage_mobileNo) + "|" + "D" + "|~";
    console.log("linkData" + linkData);

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_accountNo]: linkDelikItem,
        [this.constant.key_requestType]: 'DELINK',
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_linkDelinkData]: linkData
      }
    }

    console.log("delinkAccountParam : ", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getGenerateMMID(accno, ifscCode, payerName) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: ifscCode,
        [this.constant.key_accountNo]: accno,
        [this.constant.key_payerName]: payerName,
        [this.constant.key_payerAccount]: accno,
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
      }
    }

    console.log("getGenerateMMID : ", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getCancelMMID(accno, ifscCode, payerName) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: ifscCode,
        [this.constant.key_accountNo]: accno,
        [this.constant.key_txn_amount]: 0,
        [this.constant.key_payerName]: payerName,
        [this.constant.key_payerAccount]: accno,
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.key_deviceId),
      }
    }


    console.log("getCancelMMID", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return inputData;
   
    //return encryptData;
  }

  getAccountSchemeDetails(schemeCode) {
    var inputData = {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      ['SchemeCode']: schemeCode,
    }
    console.log(' getAccountSchemeDetails ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getSendOTPSessionReq(accno, ifscCode, payerName) {
    // var otpCode = otpNo;
    // otpCode = this.dataService.otpName != 'OTP' ? this.encryptDecryptService.createMD5Value(otpNo) : otpNo;
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage('mobileNo'),
        // [this.constant.key_OTP]: otpCode,
        [this.constant.key_ifsc_code]: ifscCode,
        [this.constant.key_accountNo]: accno,
        [this.constant.key_payerName]: payerName,
        [this.constant.key_payerAccount]: accno,
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }
    }

    return inputData;
    // console.log("getSendOTPSessionReq:", inputData);
    // return this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData))
  }

  getResendOTPSessionReq(type) {
    //will remove once it is working dynamicalli -nikita
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo), // "8249443992", // this.localStorage.getLocalStorage('mobileNo'),
        [this.constant.key_service_Type]: type
      }

    }
    console.log('getResendOTPSessionReq : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    // let encryptData = this.encryptDecryptService.encryptText("19816465728282", JSON.stringify(reqObj));
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
        [this.constant.key_latitude]: this.dataService.latitude,
        [this.constant.key_longitude]: this.dataService.longitude,
        [this.constant.key_accountNo]: accNo,
        [this.constant.key_loanMiniStatementData]: loanMiniStatementData,
        //[this.constant.key_loanMiniStatementData] : '13291400000103|24-09-2017|24-09-2018'
      }
    }
    console.log('getMyLoansMiniStatement : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
  depositeAccountEquirey(accNo) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_subCode]: "01",//for enquiry
        [this.constant.key_accountNo]: accNo,
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo)
      }
    }
    console.log(' depositeAccountEquirey : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}
