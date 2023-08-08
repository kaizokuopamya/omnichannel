import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class OtpSessionService {

  constructor(
    private constant: AppConstants,
    private encryptService: EncryptDecryptService,
    private localStorage: LocalStorageService, 
    private dataService: DataService,
    private encryptDecryptService: EncryptDecryptService
    ) { }
  /**
   * To set resend OTP request request
   */
  getResendOTPSessionReq(type) {
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo]:  this.localStorage.getLocalStorage('mobileNo'), // "8249443992", // this.localStorage.getLocalStorage('mobileNo'),
      [this.constant.key_service_Type]: (type == 'DONATIONTRANSFER' ? this.constant.val_FUNDTRANSFER : type),
      [this.constant.key_amount]: this.dataService.transactionReceiptObj.amount ? this.dataService.transactionReceiptObj.amount.trim().substring(1).trim() : '',
      [this.constant.key_TransactionAmount]: this.dataService.transactionReceiptObj.amount ? this.dataService.transactionReceiptObj.amount.trim().substring(1).trim() : ''
     }
    }
    console.log('resend OTP', JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    // let encryptData = this.encryptDecryptService.encryptText("19816465728282", JSON.stringify(reqObj));
    return encryptData;
  }


  getResendOTPSessionReqForCard(type) {
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo]:  this.localStorage.getLocalStorage('mobileNo'), // "8249443992", // this.localStorage.getLocalStorage('mobileNo'),
      [this.constant.key_service_Type]: type,
      }
    }
    console.log('resend OTP', JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    // let encryptData = this.encryptDecryptService.encryptText("19816465728282", JSON.stringify(reqObj));
    return encryptData;
  }




  /**
   * To get send otp request this function is invoked
   * @param otpFormData
   */
  getSendOTPSessionReq(otpNo) {
    var otpCode = otpNo;
    otpCode = this.dataService.otpName != 'OTP' ? this.encryptDecryptService.createMD5Value(otpNo) : otpNo;
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo]:this.localStorage.getLocalStorage('mobileNo'),
      [this.constant.key_OTP]: otpCode,
     }
    }
    console.log(reqObj);
    return this.encryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj))
  }

  /**
 * param for add omnichannel
 * @endPoint


  /**
   * param to set omni final param
   * @status
   */
  getOmniChannelParam(status) {
    var reqObj;
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_MobileNo]: this.localStorage.getLocalStorage('mobileNo'),
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage("deviceId"),
      [this.constant.key_Status]: status == 'success' ? "9" : "10"
    }
  }
    console.log(reqObj);
    return this.encryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj))
  }

  getDebitCardIssue(){
    var debitCardIssuedData = "Account number|card type|EcommFlag|DisplayName|CardNum|Personilzedcard(P/V)|"
    var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo_Org]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_debitCardIssuedData]: this.dataService.debitCardIssuedData,//// Account number|card type|EcommFlag|DisplayName|CardNum|Personilzedcard(VP/V)|
    }
  }
    console.log("aadhar request", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }



  getDebitCardModifyCbs(){
    var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo_Org]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_debitCardIssuedData]: this.dataService.debitCardIssuedData,////account number|card number|ecom flg|domestic or international flg|personalized flg|
    }
  }
    console.log("aadhar request", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }


  getDebitCardsReIssueCbs(){
    var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo_Org]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_debitCardIssuedData]: this.dataService.debitCardIssuedData,////account number|card number|card type|
    }
  }
    console.log("aadhar request", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMyAccountList(cifNo) {
    var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_omniDashData]: cifNo,
    }
  }
    console.log(' getMyAccountParam ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  //DEPOSIT
  getStandingInstructionService(formData,otpRequired){
    let dateVal = formData.datepicker1.split("-")[0].replace(/^0+/, '')
    let amount = formData.amount.trim().replace(/[^.0-9]+/g,'')
    let finalAmount = amount.replaceAll(',','').replace(/^\₹|,*$/gm, '').trim()

    var standingInstructionData = formData.debitAccount+"|"+formData.creditAccount+"|"+finalAmount+"|"+formData.paymentFrequency+"|"+dateVal+"|"+formData.installmentNumber+"|"+formData.datepicker1+"|"+ formData.remarks;

    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo_Org]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_standingInstructionData] : standingInstructionData,
      [this.constant.key_otpRequired] : otpRequired
      }
    }
    console.log("Standing Instruction Request =====>" + JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;

  }

}
