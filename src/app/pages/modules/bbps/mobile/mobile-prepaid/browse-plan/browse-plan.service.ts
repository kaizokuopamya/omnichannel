import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../../../app.constant';
import { DatePipe, Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {EncryptDecryptService} from '../../../../../../services/encrypt-decrypt.service'
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from '../../../../../../services/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class BrowsePlanService {

  constructor(  private storage: LocalStorageService, private constant: AppConstants,
    private datepipe: DatePipe,
    private dataService: DataService,
    private encryptDecryptService : EncryptDecryptService,private http: HttpClient) {
      
     }

     getplans(plandetails){
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]:this.constant.serviceName_RetrieveRechargePlans,
        [this.constant.key_billerid]:plandetails.billerid,
        [this.constant.Key_recharge_mobNumber]:plandetails.mobileNumber,
        [this.constant.Key_circle_name]:plandetails.circle_name,
        
      }}
      console.log("getplans ==>" + JSON.stringify(inputData))
      console.log('this.storage.getSessionStorage(this.constant.val_sessionKey)' , this.storage.getSessionStorage(this.constant.val_sessionKey))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }
}
