import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constant';
import { DatePipe, Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {EncryptDecryptService} from '../services/encrypt-decrypt.service'
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from '../services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
@Injectable({
  providedIn: 'root'
})
export class BbpsService {
  constructor(
    private constant: AppConstants,
    private storage: LocalStorageService,
    private datepipe: DatePipe,
    private commonMethods:CommonMethods,
    private dataService: DataService,
    private encryptDecryptService : EncryptDecryptService,private http: HttpClient ) { }

 
  
    getBillerCategories(){
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
      [this.constant.key_service_name] :this.constant.serviceName_GetCategories,
    }}
    console.log("getbillerlist ==>" + JSON.stringify(inputData))
    console.log('this.storage.getSessionStorage(this.constant.val_sessionKey)' , this.storage.getSessionStorage(this.constant.val_sessionKey))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

    getLocationList(type){

      
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
 
        [this.constant.key_service_name]:this.constant.serviceName_GetBillerLocationService,
        [this.constant.key_biller_category]:type,
        
        
      }}
      console.log("getLocationlist ==>" + JSON.stringify(inputData))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }


    getbillerListforCategory(type){
        
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]:this.constant.serviceName_GetBillerListByCategoriesService,
        [this.constant.key_biller_category]:type,
        
      }}
      
      console.log("getLocationlist ==>" + JSON.stringify(inputData))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

    getbillerlist(location , type) {
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]:this.constant.serviceName_GetBillerListService,
        [this.constant.key_biller_category]:type,
        [this.constant.key_biller_location]:location,  
      }}
      console.log("getbillerlist ==>" + JSON.stringify(inputData))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    } 


    ValidatePaymentParam( data){
      var devicedetails
      var platformtype =''
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
    
      // var devicedetails = {
      //   "init_channel": platformtype,
      //   "ip": this.dataService.ipAddress,
      //   "mac": "11-AC-58-21-1B-AA"
      // }
    
      console.log("this.constant.storage_mobileNo :" +this.storage.getLocalStorage(this.constant.storage_mobileNo))
      var inputData:any = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]:this.constant.serviceName_ValidatePaymentService,
        [this.constant.key_biller_authenticators]:JSON.stringify(data.authenticators),
        [this.constant.key_billerid]: data.billerId,
        "customerId": this.dataService.customerID,
        "sitxn": "no",
        [this.constant.key_cust_firstName]:this.dataService.userDetails?.customerName.split(' ')[0],
        [this.constant.key_cust_lastName]: this.dataService.userDetails?.customerName.split(' ')[this.dataService.userDetails?.customerName.split(' ').length - 1],
        [this.constant.key_cust_mobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_cust_email]:this.dataService.profileDetails[0].emailId.toLowerCase(),
        [this.constant.key_cust_device]: JSON.stringify(devicedetails),

        
      }}
      if(data.biller_type == "PAYEE"){
        inputData.payment_amount = data.pay_amt
      }
      console.log("getbillerlistparam ==>" + JSON.stringify(inputData))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

    getComplainDetails(type, compID ,fromdate , todate){
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]: this.constant.serviceName_RetrieveComplaintService,
        "complaint_type" :type ,
        "complaintid" :compID ,
        "mobile":this.storage.getLocalStorage(this.constant.storage_mobileNo),
        'customerId':this.dataService.customerID , 
        "from_complaint_date" :  fromdate,
        "to_complaint_date" : todate, 
  
      }}
      console.log("getcomplainlist ==>" + JSON.stringify(inputData))
       let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }


    ValidatePaymentParamJIOBSNL(data){
      var devicedetails
      var platformtype =''
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
    var custdetails= {
      [this.constant.key_cust_firstName]:this.dataService.userDetails?.customerName.split(' ')[0],
      [this.constant.key_cust_lastName]: this.dataService.userDetails?.customerName.split(' ')[this.dataService.userDetails?.customerName.split(' ').length - 1],
      [this.constant.key_cust_mobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_cust_email]:this.dataService.profileDetails[0].emailId.toLowerCase(),
    }
      // var devicedetails = {
      //   "init_channel": platformtype,
      //   "ip": this.dataService.ipAddress,
      //   "mac": "11-AC-58-21-1B-AA"
      // }
    
      console.log("this.constant.storage_mobileNo :" +this.storage.getLocalStorage(this.constant.storage_mobileNo))
      var inputData:any
       inputData = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]:this.constant.serviceName_ValidatePaymentServiceJIOBSNL,
        [this.constant.key_biller_authenticators]:JSON.stringify(data.authenticators),
        [this.constant.key_billerid]: data.billerId,
        "customerID": this.dataService.customerID,
        "sitxn": "no",
        "additional_validation_details":JSON.stringify(data.extraAuthValueArray),
        "customer":JSON.stringify(custdetails),
        [this.constant.key_cust_device]: JSON.stringify(devicedetails),

        
      }}
      if(data.biller_type == "PAYEE"){
        inputData.payment_amount = data.pay_amt
      }
      console.log("getbillerlistparam ==>" + JSON.stringify(inputData))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

}
