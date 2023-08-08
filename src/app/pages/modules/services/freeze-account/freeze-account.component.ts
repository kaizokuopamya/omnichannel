import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FreezeAccountService } from './freeze-account.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-freeze-account',
  templateUrl: './freeze-account.component.html',
  styleUrls: ['./freeze-account.component.scss']
})
export class FreezeAccountComponent implements OnInit {
  freezeAccountForm: FormGroup;
  selectedAccountData: any;
  accountList:any;
  accountListMobile:any;
  accountNumber;
  selectedAccount:any;
  type:any;
  selectedAccountNo ='SELECT';
  selected : any ;
  standalone:boolean;

  constructor(
    private router: Router,
    public dataService: DataService,
    private freezeAccountService:FreezeAccountService,
    private storage: LocalStorageService,
    private http: HttpRestApiService,
    private constant: AppConstants,
    private commonMethod: CommonMethods,
    private location: Location,

  ) {}

  buildForm() {
    this.freezeAccountForm = new FormGroup({
      accountNumber: new FormControl('', { validators: Validators.required }),
      typeoffreeze: new FormControl('', { validators: Validators.required }),
      remarks: new FormControl(''),
    });
  }

  /**
   * Initialization functionality
   */
  initialization() {
    this.buildForm() 
    this.selectedAccountData = this.location.getState();
    this.buildForm();

    this.accountList = this.dataService.customerOperativeAccList.filter(
      (obj) =>(obj.accountType!='CAPPI')
    );

    this.accountListMobile = this.dataService.customerOperativeAccList.filter(
      (obj) =>(obj.accountType!='CAPPI')
    );
    this.accountListMobile.push({ "SchemeCode" : "all" , "accountNo" : "ALL"});
    console.log("accountListttttttt:::::::::::",this.accountListMobile);

    if(this.selectedAccountData.account) {
      this.freezeAccountForm.patchValue({
        accountNumber : this.selectedAccountData.account,
        typeoffreeze: 'Debit'
      })
    }
    else {
      this.freezeAccountForm.patchValue({
        accountNumber : this.accountList[0].accountNo,
        typeoffreeze: 'Debit'
      })
    }

    this.dataService.otpSessionPreviousPage = "/freezeAccount"

  }

  ngOnInit(): void {

    this.initialization();
  }

  validateForm(){
    //within bank
    if (this.freezeAccountForm.invalid) {
      this.freezeAccountForm.get('accountNumber').markAsTouched();
      this.freezeAccountForm.get('typeoffreeze').markAsTouched();
      this.freezeAccountForm.get('remarks').markAsTouched();
      return;
    }
  }
  breadcrumroute(routeName){
    this.dataService.updateBreadcrumb(this.router.url , routeName)
    this.router.navigateByUrl('/' + routeName);
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }

  submit(){
    console.log("this.freezeAccountForm.value.remarks" + this.freezeAccountForm.value.remarks);
    this.validateForm();
    if(this.freezeAccountForm.valid){
      this.type = "Debit"; //hardcoded for now
      if(this.freezeAccountForm.value.typeoffreeze == ''){
        this.type = "Debit"
      }
      else if(this.freezeAccountForm.value.typeoffreeze == 'C'){
        this.type = "Credit"
      }
      else if(this.freezeAccountForm.value.typeoffreeze == 'T'){
        this.type = "Total"
      }
      this.commonMethod.openPopup('div.confirmation1');
    }
  }

  cancel(){
    this.commonMethod.closePopup('div.confirmation1');
  }

  proceed(){
    this.selectedAccount = []
    this.accountList.forEach(element => {
      if(element.accountNo == this.freezeAccountForm.value.accountNumber)
      {
          var data = {
            'accountNo':element.accountNo,
            'branchCode':element.branchCode
          }
          this.selectedAccount.push(data)
      }
    });

    if(this.freezeAccountForm.value.accountNumber == 'all'){
      this.freezeAccount()
      return;
    }

    var param = this.freezeAccountService.getAccountEnquiryParam(this.selectedAccount);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ACCOUNTINQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data);
        if (data.hasOwnProperty("set")) {
          var data = data.set.records[0].statement.split(',')
          var freezdata = data[6].trim()
          if(freezdata=='D' || freezdata=='F' || freezdata=='R')
          {
            this.cancel();
            this.commonMethod.openPopup('div.popup-bottom.acc-already-freeze');
          }
          else
          {
            this.freezeAccount();
          }

        }
      }
      else {
        this.errorCallBack(data?.subActionId, resp);
      }
    },(error)=>{
      console.log(error);
    });
  }

  freezeAccount() {
    this.dataService.resetTransactionObj();
    let param;
    if(this.freezeAccountForm.value.accountNumber == "all"){
      param = this.freezeAccountService.freezeAccountParamCIF(this.freezeAccountForm.value);
      this.dataService.endPoint = this.constant.serviceName_FREEZACCOUNTCIF;
    }else{
      param = this.freezeAccountService.freezeAccountParam(this.freezeAccountForm.value);
      this.dataService.endPoint = this.constant.serviceName_FreezeAccount;
    }

    this.dataService.screenType = 'freezeAccount';
    this.dataService.feedbackType = "freezeAccount"
    this.dataService.authorizeHeader = "FREEZE ACCOUNT";
   
    var totalAcc  = "";
    this.accountList.forEach(el => {
      totalAcc += ", "+el.accountNo
    });
    this.dataService.transactionReceiptObj.accountNumber = this.freezeAccountForm.value.accountNumber == "all" ? totalAcc.substring(1) : this.freezeAccountForm.value.accountNumber ;
    this.dataService.transactionReceiptObj.typeOfFreeze = 'Debit Freeze Only';
    this.dataService.transactionReceiptObj.remarks = this.freezeAccountForm.value.remarks ? this.freezeAccountForm.value.remarks : "Freezed by customer";
    this.dataService.request = param;
  this.dataService.commonOtpServiceType = this.constant.val_FREEZEACCOUNT;
    this.dataService.otpSessionPreviousPage = "/freezeAccount";
    this.dataService.screenDetails = { 
      ACCOUNT_NUMBER: this.dataService.transactionReceiptObj.accountNumber,
      TYPE_OF_FREEZE:this.dataService.transactionReceiptObj.typeOfFreeze,
      REMARKS:this.dataService.transactionReceiptObj.remarks
    }
    this.router.navigateByUrl("/otpsession");
  }

  /**
   * function to called on unsuccessfull responce
   * @subActionId
   * @resp
   */
  errorCallBack(subActionId, resp) {
    this.dataService.information = resp.Result;
    this.dataService.informationLabel = 'INFORMATION';
    this.dataService.primaryBtnText = 'OK';
    this.commonMethod.openPopup('div.popup-bottom.show-common-info');
  }

  goBack(){
    if(this.constant.getPlatform() == "web"){
      if(this.dataService.fromAccountInfo){
        this.dataService.fromAccountInfo = false;
        this.router.navigateByUrl("/" + this.dataService.previousPageUrl);
      }else{
        this.router.navigateByUrl("/dashboard");
      }
    }
    else{
      this.location.back();
    }
  }

  closePopup(popup){
    this.commonMethod.openPopup(popup);
  }

  closePopups(){
    this.commonMethod.closePopup('div.popup-bottom.sel-account');
  }

  selectAccount(){
    this.commonMethod.openPopup('div.popup-bottom.sel-account');
  }
  getSelectedAccount(accNo){
    this.selectedAccountNo = accNo.SchemeCode +" "+ accNo.sbAccount;
    this.selected = this.selectedAccountNo;

    this.freezeAccountForm.patchValue({
      accountNumber : accNo.accountNo
    })
  }
}

