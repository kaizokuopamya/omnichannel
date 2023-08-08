import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MyChequeBookService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    public datePipe: DatePipe
  ) { }

  getchekbookList(cifNo,accNo,formData){
    var toFormDate=this.datePipe.transform(formData.fromDate,'dd-MM-yyyy');
    var toDate=this.datePipe.transform(formData.toDate, 'dd-MM-yyyy');
    var chequeHistory = this.storage.getLocalStorage(this.constant.storage_mobileNo) +"|"+cifNo+"|"+accNo+"|"+ toFormDate +"|"+toDate;
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: accNo,
        [this.constant.key_chequeHistoryData]: chequeHistory,
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;



  }
}
