import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { TranslateService } from 'src/app/services/translate.service';
import { Location } from '@angular/common';
import { LanguageChangeService } from './language-change.service'

declare var $;

@Component({
  selector: 'app-language-change',
  templateUrl: './language-change.component.html',
  styleUrls: ['./language-change.component.scss']
})
export class LanguageChangeComponent implements OnInit {
  languageList = [];
  finalLangList = []
  LanguageForm: FormGroup;
  languageCode: string = "en";
  public innerWidth: any;
  pagesetting: any;
  // commonPageComponent = {
  //   'headerType': 'notLoginPrelogin',
  //   'sidebarNAv': false,
  //   'footer': 'innerFooter',
  //   'currentpageRoute': '/contactus'
  // }

  previousPageUrl;
  languageJSONList = [];
  langJsonData: any = {};
  langData: any = {};
  value = "e3f14233ab841476b70e35ac51ef38ea 210a005e65efc682fd204aac5387c800 zpu3enH9EjsVcvEZZd1xjcxW88CHUco6MYLzRvmrmqEPmetSsYmjQNiXyL4QC/tzngqaHJY3Fjkvvw2XNBJrRdOyz8i1g16p4xHZ7+VnihkA1B0JBWQJiSNHcAdubFlqiLCz0iuokMw/B0cg6w7h9FUzaiVbVP2lNFbmDNPHhWzH6BbCih9BalDXf9py+ZZ831I24STgCH2SDm9sxQnjf+e9VGxhjWU/eOGEbdHWMuO6IYx5pasQc+IaSXUIRmXCSzXM1TgzD7pwmpAOy94LZk/a2CQBEbWRN8hEEhYD6eBnKCKlql1/nJ4KMoE43pyWyihg7Mjc98GmrnoGt1fvrIBBD3pTojLrrQY2mHYSH+xpKVVHhTVmRfUvEvplLN5lzHB0Mt4tFu/R5vJF4ZlevF1ZQs8Rb+s1OAMUcYb4/cq6kjJwLe1OKXQ4fyTn+0JDd7W4kUKSThWHoh0zhQmX8em2k6FgcJYeVB6idmv9ifU5b1QG0lPWTEky3eT1eJ9GAXRW9DN9f61I49SYatbXJTCDbO96CBIVWZO4eD6zFfS34cYK+sMAd5uLcqFKGew8h6qJ17+nuwPC68veHKu5Nwh93xp806XjBAZ5pwdWoyA=";

  constructor(private form: FormBuilder,
    private _location: Location,
    private router: Router,
    private constant: AppConstants,
    public dataService: DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    private translate: TranslateService,
    private storage: LocalStorageService,
    private location: Location,
    private ngZone: NgZone,
    private encryptDecryptService: EncryptDecryptService,
    private commonMethod: CommonMethods,
    private LanguageService: LanguageChangeService
  ) { }

  ngOnInit(): void {
    this.dataService.headerType = 'preloginHeader';
    // this.dataService.removePreLoginFooterCss();
    this.ngZone.run(() => {
      if (this.dataService.bezellessIphone) {
        $("#mainDiv").removeClass("pre-login");
      }
    });
    if (this.dataService.previousPageUrl) {
      this.previousPageUrl = this.dataService.previousPageUrl;
    } else {
      this.previousPageUrl = "login"
    }
    history.pushState({}, this.previousPageUrl, this.location.prepareExternalUrl(this.previousPageUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    if (this.storage.hasKeyLocalStorage(this.constant.storage_languageJson)) {
      //this.initialize();       /* This initialize function commented only for some days 28/07/2002 -- vivek*/
      this.getLanguageObject();
    }
    else {
      this.getLanguageObject();
    }

  }
  currentlang = 'English'
  buildForm() {
    this.LanguageForm = new FormGroup({
      language: new FormControl(''),
    });
  }

  applyLanguage() {
    if (this.LanguageForm.valid) {
      this.changeLanguage();
    }
  }

  changeLanguage() {
    let lang = this.LanguageForm.get('language').value;
    if (lang) {
      this.dataService.updateLanguageCode = lang;
      this.storage.setLocalStorage(this.constant.storage_language, lang);
      let param = this.LanguageService.getLangDataObjectParam(lang);
      this.loader.showLoader();
      this.getChangeLangObjectParamapicall(param);
      // if(this.dataService.routefrom == "dashboard"){
      //     this.router.navigateByUrl('/dashboard');
      // }else{
      //   this._location.back();
      // }
      // this.router.navigateByUrl(this.pagesetting.currentpageRoute)
    } else {
      // showToastMessage('Under development', 'error');
    }
  }

  initialize() {
    this.buildForm();
    console.log('this.dataService.updateLanguageCode' + this.dataService.updateLanguageCode)
    //this.dataService.changeMessage(this.commonPageComponent);
    console.log(this.storage.getLocalStorage(this.constant.storage_languageList));
    let languageList = JSON.parse(this.storage.getLocalStorage(this.constant.storage_languageList));
    console.log(languageList);
    console.log("language code");
    console.log(this.storage.getLocalStorage(this.constant.storage_languageJson));
    //let languageJSONList = Object.keys(JSON.parse(this.storage.getLocalStorage(this.constant.storage_languageJson,true)));
    this.languageJSONList = this.languageList = languageList;
    // languageJSONList.forEach(language => {
    //   this.languageList.push(languageList.find(lang => lang.langCode === language));
    // });
    console.log(this.languageJSONList)

    for (var i = 0; i < this.languageList.length; i++) {
      if (this.languageList[i]?.langCode == this.dataService.updateLanguageCode) {
        if (this.languageList[i].lanugae != null) {
          this.finalLangList.push(
            {
              'name': this.languageList[i]?.lanugae.match(/\(([^)]+)\)/)[1],
              'lanugae': this.languageList[i]?.lanugae.split('(')[0],
              'langCode': this.languageList[i]?.langCode,
              'checked': true
            }
          )
        }
      } else {
        if (this.languageList[i].lanugae != null) {
          this.finalLangList.push(
            {
              'name': this.languageList[i]?.lanugae.match(/\(([^)]+)\)/)[1],
              'lanugae': this.languageList[i]?.lanugae.split('(')[0],
              'langCode': this.languageList[i]?.langCode,
              'checked': false
            }
          )
        }
      }
    }
    console.log('finalLangList:' + JSON.stringify(this.finalLangList))
    if (this.storage.hasKeyLocalStorage(this.constant.storage_language)) {
      this.languageCode = this.storage.getLocalStorage(this.constant.storage_language);
      this.LanguageForm.patchValue({ language: this.languageCode });
    } else {
      this.languageCode = 'en';
      this.LanguageForm.patchValue({ language: 'en' });
      this.translate.use('en');
    }

    console.log('this.languageList', JSON.stringify(this.languageList));


  }

  closeLanguage() {
    if (this.constant.getPlatform() == "web") {
      if (this.dataService.routefrom == "dashboard") {
        this.router.navigateByUrl('/dashboard');
      } else {
        this._location.back();
      }
    }
    else {
      if (this.storage.hasKeyLocalStorage(this.constant.storage_omniRegisteredUser)) {
        this.router.navigateByUrl('/loginMobile')
      }
      else {
        this.router.navigateByUrl('/LandingPage')
      }
    }
  }

  getLanguageObject() {
    var param = this.LanguageService.getLangObjectParam();
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_LANGUAGEJSONLIST).subscribe(data => {
      console.log("languageList=====> ", data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        let langJsonResponse = resp.language_JSON_Data;
        //var jsonLang = this.encryptDecryptService.decryptText(this.constant.languageKey, langJsonResponse);
        var jsonList = this.encryptDecryptService.decryptText(this.constant.languageKey, resp.LanguageList);
        //var jsonList = resp.LanguageList;
        console.log("Language_jsonList", jsonList);
        //console.log("jsonLang", jsonLang);
        //this.storage.setLocalStorage(this.constant.storage_languageJson, jsonLang,true);
        // if (this.storage.hasKeyLocalStorage(this.constant.storage_language)) this.use(this.storage.getLocalStorage(this.constant.storage_language));
        // else this.use(this.constant.defaultLanguageCode);
        //set status true or flase
        var listData = JSON.parse(jsonList)
        listData.forEach(el => {
          if (el.langCode == "en")
            el.checked = true;
          else
            el.checked = false;
        });
        console.log(listData);
        this.storage.setLocalStorage(this.constant.storage_languageList, JSON.stringify(listData));
        this.initialize();
      }
      else {

      }
    });
  }
  /**
   * This function is use to set the language
   * @param lang
   */
  use(lang: string): Promise<{}> {
    if (!this.commonMethod.validateEmpty(this.storage.getLocalStorage(this.constant.storage_languageJson, true))) {

      let langJson = this.storage.getLocalStorage(this.constant.storage_languageJson, true).replace(/\\/g, "");
      console.log("sarfaraj langJson =====>");
      console.log(langJson);
      this.langData = JSON.parse(langJson);
      var langObj = this.langData[lang]
      return new Promise<{}>((resolve, reject) => {
        this.langJsonData = langObj;
        resolve(this.langJsonData);
      });
    }
  }
  /**
   * request parameter for language json
   */

  /**
   * api call for final language change
   */
  getChangeLangObjectParamapicall(param) {
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_LANGUAGEJSONV1).subscribe(data => {
      // this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_LANGUAGEJSON).subscribe(data => {
      console.log("language=====> ", data);
      var resp = data.responseParameter;
      this.loader.hideLoader();
      if (resp.opstatus == "00") {
        let langJsonResponse = resp.language_JSON_Data;
        console.log("Chnage language=========>", langJsonResponse);
        var jsonLang = this.encryptDecryptService.decryptText(this.constant.languageKey, langJsonResponse);
        var jsonList = this.encryptDecryptService.decryptText(this.constant.languageKey, resp.LanguageList);
        //var jsonList = resp.LanguageList;
        console.log("jsonList", jsonList);
        console.log("jsonLang", jsonLang);
        this.storage.setLocalStorage(this.constant.storage_languageJson, jsonLang, true);
        this.translate.use(this.storage.getLocalStorage(this.constant.storage_language));
        if (this.storage.hasKeyLocalStorage(this.constant.storage_language)) this.use(this.storage.getLocalStorage(this.constant.storage_language));
        else this.use(this.constant.defaultLanguageCode);
        if (this.constant.getPlatform() == "web") {
          if (this.dataService.routefrom == "dashboard") {
            this.router.navigateByUrl('/dashboard');
          } else {
            this._location.back();
          }
        }
        else {
          if (this.storage.hasKeyLocalStorage(this.constant.storage_omniRegisteredUser)) {
            this.router.navigateByUrl('/loginMobile')
          }
          else {
            this.router.navigateByUrl('/LandingPage')
          }
        }
      }
    });
  }
}

