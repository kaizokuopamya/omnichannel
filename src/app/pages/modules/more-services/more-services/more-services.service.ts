import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';


@Injectable({
  providedIn: 'root'
})
export class MoreServicesService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService,
  ) { }

  getMoreServicesList() {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.Key_moduleName]:this.constant.val_PRELOGIN
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }

  getSubmenu(id){
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.Key_moduleName]:this.constant.val_PRELOGIN,
        [this.constant.key_menuId]:id
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }
}
