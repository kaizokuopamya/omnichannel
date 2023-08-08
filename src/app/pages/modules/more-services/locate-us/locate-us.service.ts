import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class LocateUsReqService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods
  ) { }

  getDefaultBankList() {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.val_DeviceID,
        [this.constant.key_dataType]: this.constant.val_upi_ALL,
        [this.constant.key_requestType]: this.constant.val_NEARBY,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);
  }

  getListBySearch(dataType, displayName, displayNameValue) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.val_DeviceID,
        [this.constant.key_dataType]: dataType,
        [this.constant.key_subtype]: displayName,
        [this.constant.key_displayName]: displayNameValue,
      }
    }

    console.log('list by search params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);
  }

  getNearByParam(type) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.val_DeviceID,
        [this.constant.key_dataType]: type, //BRANCH,ATM,ZONAL,HO
        [this.constant.key_requestType]: this.constant.val_NEARBY,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);
  }


  getNearByAtmParam() {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.val_DeviceID,
        [this.constant.key_dataType]: this.constant.val_upi_BRANCH,
        [this.constant.key_requestType]: this.constant.val_NEARBY,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);
  }


  getAllBranchWithoutCityCodeParam() {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.val_DeviceID,
        [this.constant.key_dataType]: this.constant.val_upi_BRANCH,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);
  }


  getAllBranchWithCityCodeParam(cityCode) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.val_DeviceID,
        [this.constant.key_dataType]: this.constant.val_upi_BRANCH,
        [this.constant.key_city]: cityCode,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);
  }

  /**
   * Get StateList by countryId
   * @param countryId
   */
  getStateListReqByCountryID(countryId) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_CountryCode]: countryId,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);

  }

  /**
   * Get CityList Req by stateId
   * @param stateId
   */
  getCityListReqByStateID(stateId) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_StateId]: stateId,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));
    return this.getEncryptedData(inputData);
  }


  /**
   * Get BranchList Req by cityId
   * @param cityId
   */
  getBranchListReqByCityID(cityId, latitude, longitude) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_city]: cityId,
        [this.constant.key_latitude]: latitude,
        [this.constant.key_longitude]: longitude,

      }
    }

    console.log('getBranchListReqByCityID ', JSON.stringify(inputData));

    return this.getEncryptedData(inputData);
  }

  /**
   * Get BranchList Req by cityId
   * @param cityId
   */
  getLocationParamsByBranchOrATM(cityId, latitude, longitude) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_city]: cityId,
        [this.constant.key_latitude]: latitude,
        [this.constant.key_longitude]: longitude,
      }
    }

    console.log('state list Params ', JSON.stringify(inputData));

    return this.getEncryptedData(inputData);
  }

  getLocateUsParam(type) {
    let lat = 19.0760;
    let long = 72.8777;
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_dataType]: type,
        [this.constant.key_latitude]: lat,//this.dataService.latitude,
        [this.constant.key_longitude]: long, //this.dataService.longitude
      }
    }

    console.log('getLocateUsParams ', JSON.stringify(inputData));

    return this.getEncryptedData(inputData);
  }

  getBranchCodeReqParams(formData) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_branchCode]: formData.branchCode,
      }
    }

    console.log('getBranchCodeReqParams ', JSON.stringify(inputData));

    return this.getEncryptedData(inputData);
  }

  getStateCityBranchReqParams(formData) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_branchID]: formData.branch,
      }
    }

    console.log('getBranchCodeReqParams ', JSON.stringify(inputData));

    return this.getEncryptedData(inputData);
  }


  getEncryptedData(inputData) {
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }
}




