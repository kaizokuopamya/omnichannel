import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FORMERRORSSTOPCHEQUES } from './stop-cheque.model';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppConstants } from 'src/app/app.constant';
import { StopChequeService } from './stop-cheque.service';
import { CommonMethods } from 'src/app/services/common-methods';

@Component({
  selector: 'app-stop-cheque',
  templateUrl: './stop-cheque.component.html',
  styleUrls: ['./stop-cheque.component.scss']
})
export class StopChequeComponent {
  stopChequeForm: FormGroup;
  formErrorsStopCheques = FORMERRORSSTOPCHEQUES;
  stopChequeTpe: string = ''
  chequeType:any;
  commonPageComponent :any;
  chequeTypeModel = "single" ;
  status = '';
  statusSingle = '';
  noOfLeaves:any = '';
  reasonList:any = [];
  reasonProductList:any=[];
  accountList:any=[];
  selAccNo:any ="";
  SchemeCode:any;
  platform:any;
  selectedAccount:any;
  selectedAccName:any;
  
  constructor(
    private router: Router,
    public dataService: DataService,
    private http: HttpRestApiService,
    private storage:LocalStorageService,
    private constant:AppConstants,
    private stopChequeService: StopChequeService,
    private commonMethod:CommonMethods,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.platform = this.constant.getPlatform();
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
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status?.toLowerCase()=='active') {
        el.accountFlag == "P" ? this.accountList.splice(0, 0, el) : this.accountList.push(el);
      }
    })
    this.stopChequeForm.patchValue({ account : this.accountList[0].accountNo });
    this.stopChequeForm.patchValue({ accountNo : this.accountList[0].SchemeCode +" "+ this.accountList[0].sbAccount }); //for mobile
    this.selectedAccount = this.accountList[0].accountNo;
    this.dataService.otpSessionPreviousPage = '/stopcheques';
    let param = this.stopChequeService.getReasonChequeParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_PRODUCTLIST).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
       this.reasonList = data.set.records;
      }
      else {
        this.errorCallBack(data?.subActionId, resp);
      }
    },(error)=>{
      console.log(error)
    })

  }

  buildForm() {
    this.stopChequeForm = new FormGroup({
      account: new FormControl('', [Validators.required]),
      radioboxdemo: new FormControl('', [Validators.required]),
      chequeNumber: new FormControl('', [Validators.required,Validators.minLength(6),Validators.min(1)]),
      frmChequeNumber: new FormControl(''),
      toChequeNumber: new FormControl(''),
      reason: new FormControl('', [Validators.required] ),
      remark: new FormControl('', [Validators.required]),
      accountNo: new FormControl(''),
    });

  }

  stopSingleChequeApiCall(param){
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_STOPCHEQUEPAYMENT).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        //showToastMessage(resp.Result);
        this.stopChequeForm.reset();
      }
      else {
        this.errorCallBack(data?.subActionId, resp);
      }
    },(error)=>{
      console.log(error)
    })
  }

  stopMultipleChequeApiCall(param){
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BULKCHEQUESTOPPAYMENT).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        //this.errorCallBack(data?.subActionId,resp);
        this.stopChequeForm.reset();
      }
      else {
        this.errorCallBack(data?.subActionId, resp);
      }
    },(error)=>{
      console.log(error)
    })
  }

  errorCallBack(subActionId ='', resp) {
    this.dataService.information = resp.Result;
    this.dataService.informationLabel = 'INFORMATION';
    this.dataService.primaryBtnText = 'OK';
    this.commonMethod.openPopup('div.popup-bottom.show-common-info');
  }

  stopType() {
    if (this.stopChequeForm.value.radioboxdemo == 'single') {
      this.stopChequeForm.get('frmChequeNumber').clearValidators(); // 6. Clear All Validators
      this.stopChequeForm.get('frmChequeNumber').updateValueAndValidity();
      this.stopChequeForm.get('toChequeNumber').clearValidators(); // 6. Clear All Validators
      this.stopChequeForm.get('toChequeNumber').updateValueAndValidity();
      this.stopChequeForm.get('chequeNumber')?.setValidators([Validators.required,Validators.minLength(6)]);
      this.stopChequeForm.get('chequeNumber')?.updateValueAndValidity();
    } else {
      this.stopChequeForm.get('chequeNumber').clearValidators(); // 6. Clear All Validators
      this.stopChequeForm.get('chequeNumber').updateValueAndValidity();
      this.stopChequeForm.get('frmChequeNumber').setValidators([Validators.required,Validators.minLength(6)]); // 5.Set Required Validator
      this.stopChequeForm.get('frmChequeNumber').updateValueAndValidity();
      this.stopChequeForm.get('toChequeNumber').setValidators([Validators.required,Validators.minLength(6)]); // 5.Set Required Validator
      this.stopChequeForm.get('toChequeNumber').updateValueAndValidity();
    }
  }

  validateForm() {
    if (this.stopChequeForm.invalid) {
      if(this.stopChequeForm.value.reason == "999"){
      this.stopChequeForm.get('account').markAsTouched();
      this.stopChequeForm.get('radioboxdemo').markAsTouched();
      this.stopChequeForm.get('chequeNumber').markAsTouched();
      this.stopChequeForm.get('frmChequeNumber').markAsTouched();
      this.stopChequeForm.get('toChequeNumber').markAsTouched();
      this.stopChequeForm.get('reason').markAsTouched();
       this.stopChequeForm.get('remark').markAsTouched();
      
      }else{
        this.stopChequeForm.get('account').markAsTouched();
        this.stopChequeForm.get('radioboxdemo').markAsTouched();
        this.stopChequeForm.get('chequeNumber').markAsTouched();
        this.stopChequeForm.get('frmChequeNumber').markAsTouched();
        this.stopChequeForm.get('toChequeNumber').markAsTouched();
        this.stopChequeForm.get('reason').markAsTouched();
      }
       return;
    }
  }


  onReasonChange(value){
    if(value == "999"){ 
      this.stopChequeForm.controls['remark'].setValidators([Validators.required]);
      }
      else{
      this.stopChequeForm.controls['remark'].clearValidators();
      }
      this.stopChequeForm.controls['remark'].updateValueAndValidity();
  }

  checkEnquiry(type){
    this.statusSingle = '';
    this.status = '';
    if(type == 'chqNo'){
      if(this.stopChequeForm.value.chequeNumber.length == 6){
        let param = this.stopChequeService.getSingleChequeInquiryParam(this.stopChequeForm.value , 'Stop');
        this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CHEQUESTATUSINQUIRY).subscribe(data => {
          console.log(data);
          var resp = data.responseParameter
          if (resp.opstatus == "00") {
            this.statusSingle = data.set.records[0].status;
          }
          else {
            this.errorCallBack(data.subActionId, resp);
          }
        },(error)=>{
          console.log(error)
        })
      }
    }
    else{
      if(this.stopChequeForm.value.frmChequeNumber.length == 6){
        let param = this.stopChequeService.getSingleChequeInquiryParam(this.stopChequeForm.value , 'fromStop');
        this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CHEQUESTATUSINQUIRY).subscribe(data => {
          console.log(data);
          var resp = data.responseParameter
          if (resp.opstatus == "00") {
            this.status = data.set.records[0].status;
          }
          else {
            this.errorCallBack(data.subActionId, resp);
          }
        },(error)=>{
          console.log(error)
        })
      }
    }
  }

  //New Code
  stopChequeSubmit(){
    this.stopType()
    this.validateForm()
    this.noOfLeaves = +this.stopChequeForm.value.toChequeNumber - +this.stopChequeForm.value.frmChequeNumber + 1;
    // this.commonMethod.openPopup('div.popup-bottom.confirmation1');
    if(this.stopChequeForm.valid && (this.status.toLocaleLowerCase() == 'unused' || this.statusSingle.toLocaleLowerCase()  === 'unused')){
      this.commonMethod.openPopup('div.popup-bottom.confirmation1');
    }

  }
  openchargespopup(){
    this.commonMethod.openPopup('div.popup-bottom.chargesPopup');
  }
  openPopup(){
    // this.DataService.chequeInquiryList =
    this.router.navigateByUrl('/chequeStatusList');
  }
  onCancel() {
    if(this.constant.getPlatform() == "web"){
      this.router.navigateByUrl('/dashboard');
    }
    else{
      this.router.navigateByUrl('/dashboardMobile');
    }
  }

  stopChequeAPICall(){


    if(this.stopChequeForm.valid){


      var _remark = this.reasonList.filter(obj => obj.productName == this.stopChequeForm.value.reason)[0].ProductCode;

      if(this.stopChequeForm.value.radioboxdemo == 'single'){
        if(this.stopChequeForm.value.chequeNumber < 1 )
        {
          //showToastMessage("Invalid Cheque number")
          return;
        }

        this.dataService.request = this.stopChequeService.getSingleStopChequeParam(this.stopChequeForm.value);
        this.dataService.endPoint = this.constant.serviceNmae_CHEQUESTOPPAYMENT;
        this.dataService.transactionReceiptObj.accountNo = this.stopChequeForm.value.account == "" ? "-" : this.stopChequeForm.value.account
        this.dataService.transactionReceiptObj.chequeNo = this.stopChequeForm.value.chequeNumber == "" ? "-" : this.stopChequeForm.value.chequeNumber
        this.dataService.transactionReceiptObj.remarks = this.stopChequeForm.value.reason == "999" ? this.stopChequeForm.value.remark : _remark
        this.dataService.transactionReceiptObj.fromChequeNo = "-";
        this.dataService.transactionReceiptObj.toChequeNo = "-";
        this.dataService.screenDetails = {
          FROM_ACCOUNT:this.dataService.transactionReceiptObj.accountNo,
          CHEQUE_NUMBER:this.dataService.transactionReceiptObj.chequeNo,
          REASON:this.dataService.transactionReceiptObj.remarks
        }
      }
      else{

        if(this.status == 'STOPPED'){
          return;
        }

        this.dataService.request = this.stopChequeService.getBulkStopChequeParam(this.stopChequeForm.value);
        this.dataService.endPoint = this.constant.serviceName_BULKCHEQUESTOPPAYMENT;
        this.dataService.transactionReceiptObj.accountNo = this.stopChequeForm.value.account == "" ? "-" : this.stopChequeForm.value.account
        this.dataService.transactionReceiptObj.remarks = this.stopChequeForm.value.reason == "999" ? this.stopChequeForm.value.remark : _remark
        this.dataService.transactionReceiptObj.fromChequeNo = this.stopChequeForm.value.frmChequeNumber == "" ? "-" : this.stopChequeForm.value.frmChequeNumber
        this.dataService.transactionReceiptObj.toChequeNo = this.stopChequeForm.value.toChequeNumber == "" ? "-" : this.stopChequeForm.value.toChequeNumber
        this.dataService.transactionReceiptObj.chequeNo = "-";
        this.dataService.screenDetails = {
          FROM_ACCOUNT:this.dataService.transactionReceiptObj.accountNo,
          FROM_CHEQUE_NUMBER:this.dataService.transactionReceiptObj.fromChequeNo,
          TO_CHEQUE_NUMBER:this.dataService.transactionReceiptObj.toChequeNo,
          REASON:this.dataService.transactionReceiptObj.remarks
        }
      }

      this.dataService.authorizeHeader = "Stop cheque";
      this.dataService.commonOtpServiceType = this.constant.val_STOPCHEQUE;
      this.dataService.screenType = 'stopCheque';
      this.router.navigate(['/otpsession']);

    }
    else{
      this.validateForm();
    }
  }

  proceed() {
    this.commonMethod.closePopup('div.popup-bottom.confirmation1');
    this.stopChequeAPICall();
  }



  onAccountSelectType(){
    if(window.innerWidth < 767) {
      this.commonMethod.openPopup('div.popup-bottom.sel-account');
    } 
  }

  closePoup(){
    this.commonMethod.closePopup('div.popup-bottom');
  }

  _closePopup(){
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
    this.stopChequeForm.patchValue({ accountNo: userDtl });

    this.stopChequeForm.patchValue({ account: this.selectedAccount });
  }

  changeCheque(event){
    if (this.stopChequeForm.value.radioboxdemo == 'single') {
      this.stopChequeForm.patchValue({ chequeNumber: '' });
    } else{
      this.stopChequeForm.patchValue({ frmChequeNumber: '' });
      this.stopChequeForm.patchValue({ toChequeNumber: '' });
    }
  }




}
