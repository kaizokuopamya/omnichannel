import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { Location } from '@angular/common'
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChequeStatusInquiryService } from './cheque-status-inquiry.service';

@Component({
  selector: 'app-cheque-status-inquiry',
  templateUrl: './cheque-status-inquiry.component.html',
  styleUrls: ['./cheque-status-inquiry.component.scss']
})
export class ChequeStatusInquiryComponent {
  chequeStatusEnquiryForm : FormGroup
  chequeTypeModel = "single" ;
  chequeList:any = [];
  newarr:any=[];
  selectedAccount:any = '';
  SchemeCode:any;
  platform:any;
  singleChequeInquiryList = [];
  bulkChequeInquiryList = [];
  singleChequeNumber: any = '';

  constructor(
    private router: Router,
    public dataService: DataService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    private location: Location,
    private chequeStatusInquiryService:ChequeStatusInquiryService,
    public common:CommonMethods
  ) { }


  ngOnInit(): void {
    this.platform = this.constant.getPlatform();
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : 'dashboardMobile'
    this.selectedAccount = this.dataService.customerOperativeAccList[0].accountNo;
    this.buildForm();
  }

  buildForm() {
    this.chequeStatusEnquiryForm = new FormGroup({
      account: new FormControl('', [Validators.required]),
      radioboxdemo: new FormControl('', [Validators.required]),
      chequeNumber: new FormControl('', [Validators.required,Validators.minLength(6),Validators.min(1)]),
      fromChequeNumber: new FormControl('',[Validators.required, Validators.minLength(6),Validators.min(1)]),
      toChequeNumber: new FormControl('',[Validators.required, Validators.minLength(6),Validators.min(1)]),
      remarks: new FormControl('', {validators:Validators.pattern('^[A-Za-z0-9]*')} ),
      accountNo: new FormControl(''),
    });
    this.chequeStatusEnquiryForm.controls['account'].setValue(this.selectedAccount, {onlySelf: true});
  }


  validateForm() {
    if (this.chequeStatusEnquiryForm.invalid) {
      this.chequeStatusEnquiryForm.get('account').markAsTouched();
      this.chequeStatusEnquiryForm.get('radioboxdemo').markAsTouched();
      this.chequeStatusEnquiryForm.get('chequeNumber').markAsTouched();
      this.chequeStatusEnquiryForm.get('fromChequeNumber').markAsTouched();
      this.chequeStatusEnquiryForm.get('toChequeNumber').markAsTouched();
      this.chequeStatusEnquiryForm.get('remarks').markAsTouched();

       return;
    }
  }

  enqnuiryStatus() {
    if (this.chequeStatusEnquiryForm.value.radioboxdemo == 'single') {
      this.chequeStatusEnquiryForm.get('fromChequeNumber').clearValidators(); // 6. Clear All Validators
      this.chequeStatusEnquiryForm.get('fromChequeNumber').updateValueAndValidity();
      this.chequeStatusEnquiryForm.get('toChequeNumber').clearValidators(); // 6. Clear All Validators
      this.chequeStatusEnquiryForm.get('toChequeNumber').updateValueAndValidity();
    } else {
      this.chequeStatusEnquiryForm.get('chequeNumber').clearValidators(); // 6. Clear All Validators
      this.chequeStatusEnquiryForm.get('chequeNumber').updateValueAndValidity();
      this.chequeStatusEnquiryForm.get('fromChequeNumber').setValidators([Validators.required,Validators.minLength(6)]); // 5.Set Required Validator
      this.chequeStatusEnquiryForm.get('fromChequeNumber').updateValueAndValidity();
      this.chequeStatusEnquiryForm.get('toChequeNumber').setValidators([Validators.required,Validators.minLength(6)]); // 5.Set Required Validator
      this.chequeStatusEnquiryForm.get('toChequeNumber').updateValueAndValidity();
    }
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }

  chequeEnquiryStatusSubmit() {
    this.enqnuiryStatus()
    if (this.chequeStatusEnquiryForm.valid) {
      console.log(this.chequeStatusEnquiryForm.value)
      if (this.chequeStatusEnquiryForm.value.radioboxdemo == 'single') {
        this.singleCheckEnquiry();
      } else {
        this.bulkCheckEnquiry();
      }

    }
    else {
      this.validateForm()
    }
  }

  singleCheckEnquiry() {
    let param = this.chequeStatusInquiryService.getSingleChequeInquiryParam(this.chequeStatusEnquiryForm.value, '');
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CHEQUESTATUSINQUIRY).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        this.singleChequeNumber = this.chequeStatusEnquiryForm.value.chequeNumber;
        this.bulkChequeInquiryList = [];
        this.singleChequeInquiryList = [];
        this.singleChequeInquiryList = data.set.records
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    },(error)=> {
      console.log(error);
    })

  }

  bulkCheckEnquiry() {
    let param = this.chequeStatusInquiryService.getBulkChequeInquiryParam(this.chequeStatusEnquiryForm.value);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BULKCHEQUEINQUIRY).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {

        this.singleChequeInquiryList = [];
        this.bulkChequeInquiryList = [];

        this.bulkChequeInquiryList = data.set.records;
        this.newarr = this.bulkChequeInquiryList.pop();
        console.log("bulkChequeInquiryList", this.bulkChequeInquiryList)
        console.log("newarr", this.newarr)
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    },(error)=> {
      console.log(error);
    })

  }

  onAccountSelectType(){
    if(window.innerWidth < 767) {
      this.common.openPopup('div.popup-bottom.sel-account');
    }
  }

  errorCallBack(subActionId, resp) {
    this.dataService.information = resp.Result;
    this.dataService.informationLabel = 'INFORMATION';
    this.dataService.primaryBtnText = 'OK';
    this.common.openPopup('div.popup-bottom.show-common-info');
  }

  onFromAccountSelect(event){
    this.selectedAccount = "";
    console.log(this.selectedAccount);
    this.selectedAccount = event;
    this.SchemeCode = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].SchemeCode;
    var accountNo = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].sbAccount;
    var userDtl = this.SchemeCode +" "+accountNo; 
    this.chequeStatusEnquiryForm.patchValue({ accountNo: userDtl });
    this.chequeStatusEnquiryForm.patchValue({ account: this.selectedAccount });
  }


  closePopup(){
    this.common.closePopup('div.popup-bottom.sel-account');
  }

  cancel() {
    if(this.constant.getPlatform() == "web"){
      this.router.navigateByUrl('/dashboard');
    }
    else{
      this.location.back();
    }
  }
}
