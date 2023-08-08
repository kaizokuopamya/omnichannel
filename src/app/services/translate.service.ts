import { Injectable } from '@angular/core';
import { HttpRestApiService } from './http-rest-api.service';
import { AppConstants } from '../app.constant';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { DataService } from './data.service';
import { HttpClient } from "@angular/common/http";
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  langJsonData: any = {};
  langData: any = {};
  enLangJSON: any;

  constructor(
    private http: HttpRestApiService,
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService : DataService,
    private httpClient: HttpClient
  ) { }

  /**
  * api to get language object
  */
  getLanguageObject() {
    var param = this.getLangObjectParam();
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_LANGUAGEJSON).subscribe(data => {
      console.log("language=====> ");
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        let langJsonResponse = resp.language_JSON_Data;
        var jsonLang = this.encryptDecryptService.decryptText(this.constant.languageKey, langJsonResponse);
        var jsonList = this.encryptDecryptService.decryptText(this.constant.languageKey, resp.LanguageList);
        //var jsonList = resp.LanguageList;
        console.log("jsonList");
        console.log(jsonList);
        console.log("jsonLang");
        console.log(jsonLang);
        this.storage.setLocalStorage(this.constant.storage_languageJson, jsonLang,true);
        if (this.storage.hasKeyLocalStorage(this.constant.storage_language)) this.use(this.storage.getLocalStorage(this.constant.storage_language));
        else this.use(this.constant.defaultLanguageCode);
        //set status true or flase
        var listData = JSON.parse(jsonList)
        listData.forEach(el => {
          if(el.langCode == "en")
            el.checked = true;
          else
            el.checked = false;
        });
        console.log(listData);
        this.storage.setLocalStorage(this.constant.storage_languageList, JSON.stringify(listData));
      }
      else {
        console.log("Language API Error!");
        //load languages from local file
        this.getLocalLanguageJsonFile();
      }
    });
  }

    /**
   * This function is use to set the language
   * @param lang
   */
     useJsonFile(lang: string, langJsonData): Promise<{}> {
      console.log("JSON EN DATA", langJsonData);
      var jsonLang = JSON.stringify(langJsonData.Language_Data);
      var jsonList = JSON.stringify(langJsonData.Language_List);
      var listData = JSON.parse(jsonList)
      listData.forEach(el => {
        if (el.langCode == "en")
          el.checked = true;
        else
          el.checked = false;
      });
      console.log("Lang listData", listData);
      this.storage.setLocalStorage(this.constant.storage_languageList, JSON.stringify(listData));
      this.langData = JSON.parse(jsonLang);
      var langObj = this.langData[lang];
      return new Promise((resolve, reject) => {
        this.langJsonData = langObj;
        resolve(this.langJsonData);
      });
    }

  /**
   * This function is use to set the language
   * @param lang
   */
  // use(lang: string): Promise<{}> {
  //   if (!this.commonMethod.validateEmpty(this.storage.getLocalStorage(this.constant.storage_languageJson,true))) {

  //     let langJson = this.storage.getLocalStorage(this.constant.storage_languageJson,true).replace(/\\/g, "");
  //     console.log("sarfaraj langJson =====>");
  //     console.log(langJson);
  //     this.langData = JSON.parse(langJson);
  //     var langObj = this.langData[lang]
  //     return new Promise<{}>((resolve, reject) => {
  //       this.langJsonData = langObj;
  //       resolve(this.langJsonData);
  //     });
  //   }
  // }

  use(lang: string): Promise<{}> {
    // if (!this.commonMethod.validateEmpty(this.storage.getLocalStorage(this.constant.storage_languageJson,true))) {
      let langJson = this.storage.getLocalStorage(this.constant.storage_languageJson,true).replace(/\\/g, "");
      console.log("langJson =====>");
      console.log(langJson);
      this.langData = JSON.parse(langJson);
      var langObj = this.langData[lang]
      return new Promise<{}>((resolve, reject) => {
        this.langJsonData = langObj;
        resolve(this.langJsonData);
      });
    // } else {
    //   this.getLocalLanguageJsonFile();
    // }
  }

  getLocalLanguageJsonFile() {
    this.httpClient.get("assets/i18n/language.json").subscribe(langData => {
      this.useJsonFile(this.constant.defaultLanguageCode, langData);
    });
  }

  /**
   * request parameter for language json
   */
  getLangObjectParam() {
    var inputData = {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_cbsType]: this.constant.val_cbsType,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_deviceId]: this.constant.deviceID,
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
    }

    console.log("getLangObjectParam ",JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }

  getLangDataObjectParam(selectLangValue) {
    var inputData = {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_cbsType]: this.constant.val_cbsType,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_deviceId]: this.constant.deviceID,
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
      [this.constant.key_prefered_Language]: selectLangValue,
      
    }

    console.log("getLangDataObjectParam ",JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }
}
