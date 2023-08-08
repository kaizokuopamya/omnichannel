import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { PositivePayService } from './positive-pay.service';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { CommonMethods } from 'src/app/services/common-methods';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-positive-pay',
  templateUrl: './positive-pay.component.html',
  styleUrls: ['./positive-pay.component.scss']
})
export class PositivePayComponent {
  positivePayForm : FormGroup ;
  accountList:any=[]
  selectedAccount:any=[]
  selectedAccName:any="";
  todayDate: any;
  threeMonthsBackDate: any;
  status:boolean = false;
  selAccNo:any ="";
  SchemeCode:any;
  platform:any;
  
  constructor(
    private router:Router,
    public dataService: DataService,
    public positivePayService:PositivePayService,
    public constant:AppConstants,
    public datepipe:DatePipe,
    private commonMethod:CommonMethods,
    private storage : LocalStorageService,
    private http: HttpRestApiService,
    private formValidation: FormValidationService,
    ) { }

    ngOnInit(): void {
      this.platform = this.constant.getPlatform();
      this.dataService.otpSessionPreviousPage='positivePay'
      this.buildForm();
      this.selAccNo = "";
      this.dataService.customerOperativeAccList.forEach(el => {
        if (el.accountType != "CAPPI" && el.Status?.toLowerCase()=='active') {
          el.accountFlag == "P" ? this.accountList.splice(0, 0, el) : this.accountList.push(el);
        }
      })
  
      this.positivePayForm.patchValue({ selectAccount : this.accountList[0].accountNo });
      this.positivePayForm.patchValue({ accountNo : this.accountList[0].SchemeCode +" "+ this.accountList[0].sbAccount }); //for mobile
      this.selectedAccount = this.accountList[0].accountNo;
      if(this.dataService.isCordovaAvailable){
        this.onFromAccountSelect(this.selectedAccount)
      }else{
        this.onAccountNoChange(this.selectedAccount);
      }
      this.todayDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      const today = new Date();
      const backdate = new Date();
  
      this.threeMonthsBackDate =this.datepipe.transform(backdate.setMonth(backdate.getMonth() - 3), 'yyyy-MM-dd');
      console.log('three months back date: ', this.threeMonthsBackDate);
  
      var backURL = '';
      if(this.dataService.isCordovaAvailable){
        if(this.dataService.quickAccessFromDashboard){
          backURL = 'mobQuickAccessLanding';
        }else{
          backURL = 'dashboardMobile';
        }
      }else{
        backURL = 'dashboard';
      }
    }

    buildForm(){
      this.positivePayForm = new FormGroup({
        selectAccount: new FormControl('', [Validators.required]),
        payeeName: new FormControl('', [Validators.required]),
        chequeNumber: new FormControl('', [Validators.required, Validators.minLength(6), Validators.min(1)]),
        amount: new FormControl('', [Validators.required]),
        datepicker1: new FormControl('', [Validators.required]),
        transactionCode: new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(3)]),
        micr: new FormControl('', [Validators.required,Validators.minLength(9)]),
        accountNo: new FormControl('')
      },{ validators: Validators.compose([this.validateMICR.bind(this)])});
    }
  
    validateMICR(formGroup){
      const { value: micr } = formGroup.get('micr');
      console.log('micr',micr);
      let micrNo = micr.slice(3,6)
      return micrNo != '023' ? { invalidmicr: true } : null;
    }

    validateForm(){
      if (this.positivePayForm.invalid) {
        this.positivePayForm.get('selectAccount').markAsTouched();
        this.positivePayForm.get('payeeName').markAsTouched();
        this.positivePayForm.get('chequeNumber').markAsTouched();
        this.positivePayForm.get('amount').markAsTouched();
        this.positivePayForm.get('datepicker1').markAsTouched();
        this.positivePayForm.get('transactionCode').markAsTouched();
        this.positivePayForm.get('micr').markAsTouched();
        return;
      }
    }

    positvePaySubmit(formData){

      formData.datepicker1 = moment(formData.datepicker1).format('DD-MMM-YYYY')
      console.log(formData)
      if(this.positivePayForm.valid && this.status != true){
        this.dataService.resetTransactionObj();
  
        this.dataService.feedbackType = "positivePay";
       // this.router.navigate(['/positivePayConfirmation']);
       let amt = formData.amount;
       var param = this.positivePayService.getPositivePayParam(formData);
       this.dataService.request = param;
       this.dataService.endPoint = this.constant.serviceName_POSITIVEPAY;
       formData.selectedName = this.selectedAccName != '' ? this.selectedAccName : '-'
       formData.datepicker1 = this.datepipe.transform(formData.datepicker1, this.dataService.dateFormat);
       this.dataService.screenType = "positivePay"
       this.dataService.authorizeHeader = "Positive Pay";
       this.dataService.transactionReceiptObj.amount = ((formData.amount).trim().replace(/[^.0-9]+/g, ''));
      this.dataService.transactionReceiptObj = formData;
      this.dataService.commonOtpServiceType = this.constant.val_POSITIVEPAY;
      this.dataService.screenDetails = {
        FROM_ACCOUNT: this.dataService.transactionReceiptObj.selectAccount,
        ISSUER_NAME: this.dataService.transactionReceiptObj.selectedName,
        PAYEE_NAME: this.dataService.transactionReceiptObj.payeeName,
        AMOUNT: amt,
        CHEQUK_NUMBER : this.dataService.transactionReceiptObj.chequeNumber,
        CHEQUE_ISSUE_DATE : this.dataService.transactionReceiptObj.datepicker1,
        MICR:this.dataService.transactionReceiptObj.micr
      }
      this.router.navigateByUrl('/otpsession');
      }
      else{
       this.validateForm();
      }
    }

    onAccountNoChange(accountNumber) {
      if (accountNumber != '') {
        this.selectedAccount = this.accountList.find(i => i.accountNo == accountNumber);
        this.selectedAccName = this.dataService.userDetails?.customerName;
        this.selAccNo = accountNumber;
      }
      else{
        this.selAccNo = "";
      }
    }
  
    goBack(){
      if(this.constant.getPlatform() == "web"){
        this.router.navigateByUrl('/dashboard');
      }
      else{
        this.router.navigateByUrl('/dashboardMobile');
      }
    }

  checkEnquiry() {
    this.status = false;
    if (this.positivePayForm.value.chequeNumber.length == 6) {
      let param = this.positivePayService.getSingleChequeInquiryParam(this.dataService.isCordovaAvailable ? this.selAccNo : this.selectedAccount.accountNo, this.positivePayForm.value.chequeNumber);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CHEQUESTATUSINQUIRY).subscribe(data => {
        console.log(data);
        var resp = data.responseParameter
        if (resp.opstatus == "00") {
          this.status = data.set.records[0].status == "UNUSED" ? false : true;
        }
        else {
          this.positivePayForm.patchValue({ chequeNumber: "" })
          this.errorCallBack(data.subActionId, resp);
        }
      },(error)=>{
        console.log(error);
      })
    }
  }

  errorCallBack(subActionId, resp) {
    this.dataService.information = resp.Result;
    this.dataService.informationLabel = 'INFORMATION';
    this.dataService.primaryBtnText = 'OK';
    this.commonMethod.openPopup('div.popup-bottom.show-common-info');
  }

  formatCurrency(value) {
    this.formValidation.formatCurrency(value, this.positivePayForm);
  }
  
  OnInput(evn) {
    var regex = new RegExp("(\\.\\d{" + 2 + "})\\d+", "g");
    evn = evn.replace(regex, '$1');
    this.positivePayForm.patchValue({
      amount: evn
    })
  }
  
    onAccountSelectType(){
      if(window.innerWidth < 767) {
        this.commonMethod.openPopup('div.popup-bottom.sel-account');
      }
    }
  
    closePopup(){
      this.commonMethod.closePopup('div.popup-bottom.sel-account');
    }
  
  
    onFromAccountSelect(accountNumber){
      this.selectedAccount = "";
      console.log(this.selectedAccount);
      this.selectedAccount = accountNumber;
      this.selectedAccName = this.dataService.userDetails?.customerName;
      this.selAccNo = accountNumber;
  
      this.SchemeCode = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].SchemeCode;
      var accountNo = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].sbAccount;
      var userDtl = this.SchemeCode +" "+accountNo; 
      this.positivePayForm.patchValue({ accountNo: userDtl });
      this.positivePayForm.patchValue({ selectAccount: this.selectedAccount });
    }

}
