import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../../app.constant';
import { DatePipe, Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {EncryptDecryptService} from '../../../../../services/encrypt-decrypt.service'
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class RaiseComplainService {

  constructor(
    private constant: AppConstants,
    private storage: LocalStorageService,
    private datepipe: DatePipe,
    private dataService: DataService,
    private encryptDecryptService : EncryptDecryptService,private http: HttpClient

  ) { }


  getComplaintTypeParam(){
    var inputData = {
      [this.constant.key_entityId]: this.constant.val_entityId_BBPS,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_service_name]:this.constant.serviceName_GetComplaintType,

    }


    console.log("getComplaintType ==>" + JSON.stringify(inputData))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }




  getParticipationTypeParam(){
    var inputData = {
      [this.constant.key_entityId]:this.constant.val_entityId_BBPS,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_service_name]:this.constant.serviceName_GetParticipationType,

    }

    console.log("GetParticipationType ==>" + JSON.stringify(inputData))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getComplaintReason(){
    var inputData = {
      [this.constant.key_entityId]:this.constant.val_entityId_BBPS,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_service_name]:this.constant.serviceName_GetComplaintDisposition,
      // [this.constant.Key_participation_type]:type
    }

    console.log("GetParticipationType ==>" + JSON.stringify(inputData))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  raisecomplain(value){
    var inputData = {
      [this.constant.key_entityId]: this.constant.val_entityId_BBPS,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_service_name]:this.constant.serviceName_RaiseComplaintService,
      'customerId':this.dataService.customerID ,
      "complaint_type": "Transaction",
      "mobile":  this.storage.getLocalStorage(this.constant.storage_mobileNo),
      "bbps_ref_no": value.refNumber,
      "disposition": value.complaintReason,
      "complaint_desc": value.complaintDescription
      // [this.constant.Key_participation_type]:type
    }

    console.log("raiseComplain ==>" + JSON.stringify(inputData))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}
