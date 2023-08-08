import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../../../app.constant';
import { EncryptDecryptService } from '../../../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from '../../../../../../services/local-storage.service';
import { DataService } from '../../../../../../services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ExistingBillPayemtServiceService {

  constructor(private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    private datepipe: DatePipe,
    private storage: LocalStorageService,) { }

    getbbpsPoolAcc(){
      var inputData =  { ...this.dataService.commonInputData(), ...{
       
        "configType": "BBPS_POOL_ACCOUNT"
      }}
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

    
    getBbpsTransferParam(formData , fromAccount , toAccount , paymentMode , ID, companyName , amt, ifsc){
      var billamnt =(parseFloat(amt) - parseFloat(formData.totalHandlingFee) ).toFixed(2)
      // var debitAmt = (parseFloat(amt)  + parseFloat(formData.totalHandlingFee) ).toFixed(2)
      // var paymentAmt 
      var devicedetails
      if (this.constant.getPlatform() == "web") {
        devicedetails= {
          "init_channel": "InternetBanking",
          "ip": this.dataService.ipAddress,
          "mac": "11-AC-58-21-1B-AA"
        }
      }else{
        var imeinum = this.dataService.imei;
        devicedetails= {
         
          "init_channel": "MobileBanking",
          "ip": this.dataService.ipAddress,
          "imei": imeinum ?  imeinum : "452930183567388",
          "os": this.constant.getPlatform(),
          "app": "AGENTAPP"
        }
      }
      console.log("amtamtamt : " + amt.trim().replace(/[^0-9]+/g, ''))
      console.log("amtamtamt2 : " + amt)

      console.log("formData :"  + JSON.stringify(formData))
     var  paymentAcc = {
                          "payment_method":"BankAccount",
                          "account_number": fromAccount,
                          "ifsc": ifsc
                        }
     
     var custdetials  = {
                        "firstname":this.dataService.userDetails?.customerName.split(' ')[0],
                         "lastname": this.dataService.userDetails?.customerName.split(' ')[this.dataService.userDetails?.customerName.split(' ').length - 1], 
                         "mobile": this.storage.getLocalStorage(this.constant.storage_mobileNo),
                         "email":this.dataService.profileDetails[0].emailId.toLowerCase()
                        }
      // var devicedetails = {
      //                   "init_channel": platformtype,
      //                   "ip": this.dataService.ipAddress,
      //                   "mac": "11-AC-58-21-1B-AA"
      //                 }
      var bbpsData = {
        "serviceName":this.constant.serviceName_MakePaymentService,
        "entityId":this.constant.val_entityId_BBPS,
        "customerId": this.dataService.customerID, // this.DataService.customerID
        "validationid": formData.validationid,
        "isBBPSBiller": this.dataService.isbillerbbps ,
        "payment_type": formData.paymentType,
        "billId" : formData.billId,
        "billerid":formData?.billerId,
        "authenticators": JSON.stringify(formData?.authenticator),
        "currency": "356",
        "payment_amount": billamnt,
        "cou_conv_fee": formData.cou_conv_fee,
        "bou_conv_fee": formData.bou_conv_fee,
        "debit_amount": billamnt,
        "payment_remarks": formData.remarks ?  formData.remarks : "-",
        "payment_account": JSON.stringify(paymentAcc),
        "customer": JSON.stringify(custdetials),
        "device": JSON.stringify(devicedetails),
        "category": formData.billCategory
      }
     
        console.log("encryptedBbpsdata :" + JSON.stringify(bbpsData))
      
      var inputData = {};
      inputData = {  ...this.dataService.commonInputData(), ...{                                             
     
        [this.constant.key_deviceId]:'1',
        [this.constant.key_accountNo] : fromAccount,
        [this.constant.key_toAccount]: toAccount,
        [this.constant.key_amount]: amt.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_remarks]: formData.remarks ?  formData.remarks : "-",
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_transType]: paymentMode,
        [this.constant.key_donationId]: ID,
        [this.constant.key_debitBranchCode]: '0000',
        [this.constant.key_creditBranchCode]: '0000',
        [this.constant.key_senderName]: this.dataService.userDetails?.customerName,
        [this.constant.key_receiverName]: companyName,
        [this.constant.key_TransactionDate]: this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy hh:mm:ss'),
        [this.constant.key_MobileNo]:  this.storage.getLocalStorage('mobileNo'), 
        
        "actionType":"Quick",
        
        "merchName":"bbps",
        "BILL_NUMBER": formData.consumerNo.replace(/ /g, ""),
        "billerType":  formData.billCategory.replace(/ /g, ""),
        "billerName": formData.billerName,    
        "bbpsData" : JSON.stringify(bbpsData)
      
      }}
  
      console.log("BBPS inputData" + JSON.stringify(inputData));
    // this.dataService.setOmniChannelReqParam(this.constant.key_omni_ownTransfer,JSON.stringify(inputData));//set omni channel req
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
    }
 
}
