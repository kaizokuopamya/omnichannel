import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { InwardChequeInquiryService } from '../inward-cheque-inquiry.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { Location } from '@angular/common';


@Component({
  selector: 'app-inward-cheque-inquiry',
  templateUrl: './inward-cheque-inquiry.component.html',
  styleUrls: ['./inward-cheque-inquiry.component.scss']
})
export class InwardChequeInquiryComponent {

  inwardChequeInquiryForm: FormGroup;
  chNum: boolean = true;
  dateRange: boolean;
  accountNumber: any;
  dateChequeSelection = "date-range";
  cifNumber: any;
  toDate: any;
  currentDate: any = moment().toDate();
  todifference: any;
  inwardchecklist: any = [];
  tempInwardChequeInquiry: any = "";
  tempInwardcheckList: any = [];
  SchemeCode: any;
  selectedAccount: any;
  selectedAccName: any;
  selAccNo: any;
  platform: any;
  selectedComponent:string = 'inquiry'

  constructor(
    private router: Router,
    public dataService: DataService,
    private inwardChequeInquiryService: InwardChequeInquiryService,
    private http: HttpRestApiService,
    private constant: AppConstants,
    private storage: LocalStorageService,
    private location: Location,
    public commonMethods: CommonMethods
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.platform = this.constant.getPlatform();
    this.cifNumber = this.dataService.userDetails.cifNumber;
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status?.toLowerCase()=='active') {
        el.accountFlag == "P" ? this.accountNumber.splice(0, 0, el) : this.accountNumber.push(el);
      }
    })
    this.inwardChequeInquiryForm.patchValue({ selAcc: this.accountNumber[0].accountNo });
    this.inwardChequeInquiryForm.patchValue({ accountNo: this.accountNumber[0].SchemeCode + " " +  this.accountNumber[0].sbAccount });//for mobile
    this.selectedAccount = this.accountNumber[0].accountNo;
  }

  buildForm() {
    this.inwardChequeInquiryForm = new FormGroup({
      selAcc: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      chequeNumber: new FormControl(''),
      accountNo: new FormControl(''),
    });
  }

  validateForm() {
    if (this.inwardChequeInquiryForm.invalid) {
      this.inwardChequeInquiryForm.get('selAcc').markAsTouched();
      this.inwardChequeInquiryForm.get('toDate').markAsTouched();
      this.inwardChequeInquiryForm.get('fromDate').markAsTouched();
      this.inwardChequeInquiryForm.get('chequeNumber').markAsTouched();
    }
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  submit() {
    if (this.inwardChequeInquiryForm.valid) {
      this.inwarChequeApiCall();
    }
    else {
      this.validateForm();
    }
  }

  changecomponent(component){
      switch(component){
        case 'inquiry':
          this.selectedComponent = component;
        break;
        case 'details':
          this.selectedComponent = component;
        break;
        case 'list':
          this.selectedComponent = component;
        break;
       
      }
  }

  inwarChequeApiCall() {
    let tempInwardChequeInquiry;
    tempInwardChequeInquiry = {
      ["accountNumber"]: this.inwardChequeInquiryForm.value.selAcc,
      ["fromDate"]: this.convertDate(this.inwardChequeInquiryForm.value.fromDate),
      ["toDate"]: this.convertDate(this.inwardChequeInquiryForm.value.toDate),
      ["chequeNumber"]: this.inwardChequeInquiryForm.value.chequeNumber,
    }
    var param = this.inwardChequeInquiryService.getInwardChequeInquiryParam(tempInwardChequeInquiry);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_INWARDCHEQUEINQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.inwardchecklist = data?.set?.records;
        if (this.inwardChequeInquiryForm.value.chequeNumber == "") {
          this.dataService.inwardchecklistvalue = this.inwardchecklist;
        }
        else {
          this.inwardchecklist.forEach(element => {
            if (this.inwardChequeInquiryForm.value.chequeNumber == element.cheque_Number) {
              this.tempInwardcheckList.push(element);
              this.dataService.inwardchecklistvalue = this.tempInwardcheckList;
            }
          });

        }
        console.log("dataservice inwarcheck::::::", this.dataService.inwardchecklistvalue)

        if (this.dataService.inwardchecklistvalue.length > 0) {
          this.selectedComponent = 'list';
        }
        else {
          resp.Result = "No data to display";
          this.errorCallBack(data.subActionId, resp);
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    },(error)=>{
      console.log(error);
    })
  }

  errorCallBack(subActionId, resp) {
    this.dataService.information = resp.Result;
    this.dataService.informationLabel = 'INFORMATION';
    this.dataService.primaryBtnText = 'OK';
    this.commonMethods.openPopup('div.popup-bottom.show-common-info');
  }

  convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  }

  ToDateChange(event) {
    var diff = Math.floor(this.inwardChequeInquiryForm.value.fromDate - this.inwardChequeInquiryForm.value.toDate);
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    this.toDate = Math.floor(months / 12);
    console.log("this.toDate: " + this.toDate)
  }

  fromDateChange(event) {
    console.log("eventsssssssssssssssss", event);
    var diff = Math.floor(this.inwardChequeInquiryForm.value.fromDate - this.inwardChequeInquiryForm.value.toDate);
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    this.toDate = Math.floor(months / 12);
    console.log("this.toDate: " + this.toDate);
  }

  onCancel() {
    if (this.constant.getPlatform() == "web") {
      this.router.navigateByUrl('/dashboard');
    }
    else {
      this.location.back();
    }
  }


  onAccountSelectType() {
    if (window.innerWidth < 767) {
      this.commonMethods.openPopup('div.popup-bottom.sel-account');
    }
  }

  closePopup() {
    this.commonMethods.closePopup('div.popup-bottom.sel-account');
  }

  onFromAccountSelect(accountNumber) {
    this.selectedAccount = "";
    console.log(this.selectedAccount);
    this.selectedAccount = accountNumber;
    this.selectedAccName = this.dataService.userDetails?.customerName;
    this.selAccNo = accountNumber;
    this.SchemeCode = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].SchemeCode;
    var accountNo = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].sbAccount;
    var userDtl = this.SchemeCode +" "+accountNo; 
    this.inwardChequeInquiryForm.patchValue({ accountNo: userDtl });
    this.inwardChequeInquiryForm.patchValue({ selAcc: this.selectedAccount });
  }
}
