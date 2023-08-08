import { Component, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService} from 'src/app/services/data.service'
import { RegistrationTpinService } from './registration-tpin.service';

@Component({
  selector: 'app-registration-tpin',
  templateUrl: './registration-tpin.component.html',
  styleUrls: ['./registration-tpin.component.scss']
})
export class RegistrationTpinComponent implements OnInit {
  public formErrorsstep5 = {
    tpin: '',
    confTpin: '',
  };
  enterTpin: boolean = false;
  enterConfrmTPin: boolean = false;
  tpinNotMatched: boolean = false;
  isFormValid: boolean = false;
  tpinRepeatError: boolean =false;
  tpinConsecutiveError: boolean = false;
  tpinValue:any;
  confirmTpin = '';

  @ViewChildren('sTpin') sTpin: any;
  @ViewChildren('cTpin') cTpin: any;
  @Output() nextEvent2 = new EventEmitter<number>();
  regiFormVerifyTpin: FormGroup;
  constructor(private form: FormBuilder,
    private router: Router,
    public dataService: DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    private constant: AppConstants,
    private storage: LocalStorageService,
    private formValidation: FormValidationService,
    private registerService: RegistrationTpinService,
    private commonMethod:CommonMethods
    ) { }


    ngOnInit(): void {
      console.log(this.dataService.registrationData)
      this.buildForm();
      this.bindForm();
    }

    buildForm() {
      this.regiFormVerifyTpin = new FormGroup({
        tpin1: new FormControl(''),
        tpin2: new FormControl(''),
        tpin3: new FormControl(''),
        tpin4: new FormControl(''),
        tpin5: new FormControl(''),
        tpin6: new FormControl(''),
        confTpin1: new FormControl(''),
        confTpin2: new FormControl(''),
        confTpin3: new FormControl(''),
        confTpin4: new FormControl(''),
        confTpin5: new FormControl(''),
        confTpin6: new FormControl('')
      });
  
    }


    bindForm() {
      this.regiFormVerifyTpin.patchValue({
        tpin: this.dataService.regFeildData.tpin,
        confTpin: this.dataService.regFeildData.confTpin
      });
    }

    validatesForm() {
      var tpin = this.regiFormVerifyTpin.value.tpin1 + this.regiFormVerifyTpin.value.tpin2 + this.regiFormVerifyTpin.value.tpin3 + this.regiFormVerifyTpin.value.tpin4 + this.regiFormVerifyTpin.value.tpin5 + this.regiFormVerifyTpin.value.tpin6;
      var confTpin = this.regiFormVerifyTpin.value.confTpin1 + this.regiFormVerifyTpin.value.confTpin2 + this.regiFormVerifyTpin.value.confTpin3 + this.regiFormVerifyTpin.value.confTpin4 + this.regiFormVerifyTpin.value.confTpin5 + this.regiFormVerifyTpin.value.confTpin6;
      this.enterTpin = false; this.enterConfrmTPin = false; this.tpinNotMatched = false; this.isFormValid = false;
  
      this.confirmTpin = confTpin;
      if (this.regiFormVerifyTpin.value.tpin1 == "" ||
        this.regiFormVerifyTpin.value.tpin2 == "" ||
        this.regiFormVerifyTpin.value.tpin3 == "" ||
        this.regiFormVerifyTpin.value.tpin4 == "" ||
        this.regiFormVerifyTpin.value.tpin5 == "" ||
        this.regiFormVerifyTpin.value.tpin6 == "") {
        this.enterTpin = true;
      }
      else if (this.regiFormVerifyTpin.value.confTpin1 == "" ||
        this.regiFormVerifyTpin.value.confTpin2 == "" ||
        this.regiFormVerifyTpin.value.confTpin3 == "" ||
        this.regiFormVerifyTpin.value.confTpin4 == "" ||
        this.regiFormVerifyTpin.value.confTpin5 == "" ||
        this.regiFormVerifyTpin.value.confTpin6 == "") {
        this.enterConfrmTPin = true;
      }
      else if (tpin != confTpin) {
        this.tpinNotMatched = true;
      }
      else {
        this.isFormValid = true;
        this.tpinValue = tpin;
      }
    }

    submitStep5() {
      //this.nextEvent2.next(5);
      this.validatesForm();
      this.tpinRepeatError = false;
      this.tpinConsecutiveError = false;
      this.tpinRepeatError = this.checkRepeatedDigits(this.tpinValue);
      this.tpinConsecutiveError = this.checkConsecutiveDigits(this.tpinValue);
  
      if (this.isFormValid && !this.tpinRepeatError && !this.tpinConsecutiveError) {
        let paramReq = this.registerService.getTPINUpdateParam(this.tpinValue);
        let extraParams = {showErrorPopup :true};
        this.http.callBankingAPIService(paramReq, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_SETUPDATEPIN_reg,extraParams).subscribe(data => {
          console.log(data);
          var resp = data.responseParameter
          if (resp.opstatus == "00") {
            this.updateRegistrationStatus();
          }
          else {
            this.errorCallBack(data.subActionId, resp);
          }
        },(error)=>{
          console.log(error);
        });
      } else {
        this.formErrorsstep5 = this.formValidation.validateForm(this.regiFormVerifyTpin, this.formErrorsstep5, true);
      }
    }


     /**
     * For Registration status update this function is invoked
     */
  updateRegistrationStatus() {
    let param = this.registerService.getUpdateRegistrationDetailsParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_UPDATEREGISTRATIONSTATUS_reg).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.dataService.isLoggedIn = true;
        this.storage.setLocalStorage(this.constant.storage_omniRegisteredUser, "true");
        this.dataService.successMsg = "REGISTRATION_SUCCESS_MESSAGE";
        this.router.navigateByUrl('/successPage');
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }


    errorCallBack(subActionId, resp) {
      if (resp.opstatus == "03") {
        // showToastMessage(resp.Result, "error");
      }
    }


   

    
  onKeyUp(index, event,type) {
    const eventCode = event.which || event.keyCode;
    console.log(index);
    console.log(event.which);
    console.log(event.keyCode);

    if (this.getSpasswordElement(index, type).value.length === 1) {
      if (index !== 5) {
        this.getSpasswordElement(index + 1, type).focus();
      } else {
        this.getSpasswordElement(index, type).blur();
        // Submit code
        console.log('submit code ');
      }
    }
    if (eventCode === 12 && index !== 1) {
      this.getSpasswordElement(index - 1, type).focus();
    }
    if (eventCode === 8 || eventCode === 229) {
      if (event.key != "Unidentified") {
        this.enterConfrmTPin = false;this.tpinNotMatched = false;this.tpinRepeatError = false;this.tpinConsecutiveError = false;
        //this.otpForm.get(this.uFormInput[index]).setValue("");
        this.getSpasswordElement(index - 1, type).focus();
      }
    }
  }
  
  onFocus(index,type) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getSpasswordElement(item, type);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getSpasswordElement(index, type) {
    //console.log(this.mPinRows);
    if (type == "spassword") {
      if (index <= 5)
        return this.sTpin._results[index].nativeElement;
    }
    else if (type == "cpassword") {
      if (index <= 5)
        return this.cTpin._results[index].nativeElement;
    }

  }

  checkRepeatedDigits(val) {
    console.log('checkRepeatedDigits val', val);
    let regex1 = /^([0-9])\1{5}$/;
    if (regex1.test(val)) {
      console.log("repeated true");
      // this.repeatedDigits = true;
      return true;
    } else {
      console.log("repeated false");
      // this.repeatedDigits = false;
      return false;
    }
  }

  checkConsecutiveDigits(val) {
    console.log('checkConsecutiveDigits val === ', val);

    if (val == "012345" || val == "123456" || val == "234567" || val == "345678" || val == "456789" || val == "567890") {
      console.log("consecutive true");
      // this.consecutiveDigits = true;
      return true;
    } else if (val == "987654" || val == "876543" || val == "765432" || val == "654321" || val == "543210" || val == "098765") {
      console.log("consecutive true");
      // this.consecutiveDigits = true;
      return true;
    } else {
      console.log("consecutive false");
      // this.consecutiveDigits = false;
      return false;
    }
  }

  tpinPolicy(){
    this.commonMethod.openPopup("div.tpin-popup")
  }
  closePopups(popupName){
    this.commonMethod.closePopup(popupName);
  }
}
