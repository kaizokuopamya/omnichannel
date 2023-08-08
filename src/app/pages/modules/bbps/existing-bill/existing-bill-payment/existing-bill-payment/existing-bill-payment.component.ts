import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { BbpsService } from 'src/app/services/bbps.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { CommonMethods } from '../../../../../../services/common-methods';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { CustomCurrencyPipe } from '../../../../../../pipes/custom-currency.pipe';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AccountType } from 'src/app/model/common.model';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe, Location } from '@angular/common';
import {ExistingBillPayemtServiceService} from './existing-bill-payemt-service.service';
import { SendMoneyService } from '../../../../fund-transfer/send-money/send-money.service';

declare var $: any;
@Component({
  selector: 'app-existing-bill-payment',
  templateUrl: './existing-bill-payment.component.html',
  styleUrls: ['./existing-bill-payment.component.scss']
})
export class ExistingBillPaymentComponent implements OnInit , OnDestroy {

  constructor(
    private router: Router,
    public dataService: DataService,
    private customCurrencyPipe: CustomCurrencyPipe,
    private bbpsService: BbpsService,
    private formValidation: FormValidationService,
    public commonMethod: CommonMethods,
    private http: HttpRestApiService,
    private constant: AppConstants,
    private location: Location,
    public datepipe:DatePipe,
    private sendMoneyService:SendMoneyService,
    private storage: LocalStorageService,
    private existingBillPayemtServiceService: ExistingBillPayemtServiceService) { }
    lowAmt:boolean =false
    moreAmt:boolean =false
    insufficientbal:boolean =false;
    accountNameToggle  : boolean = false ;
    upiNameToggle  : boolean = false ;
    showAccountMessage : boolean = false ;
    showUpiMessage : boolean = false ;


    platformtype:any = '';
    accountNumber:any = '';
    selectedAccount: any = '';
    accountValue : any = '';
    accBalance: any = '';
    refreshedTime;
    mobileSelectedAcc:any;
    inputAmt:any;
    SchemeCode = "";
    viewData:any;
    maskedSelectedAccount =""
    accountNameValue : any = '' ;
    upiNameValue : any = '' ;
    paymentType : any = 'account';
    selectedFromAccMobile:any;
    billerdetailsList:any;
    companyName: 'BBPS';
    ifscNumber;
    toSelectedAcc:any;
    ID = 12


    remarkForm: FormGroup;

    accountList:any = [];
    billPaymentList =[]
    upiValue = ['435578993@psb', '98345214541@psb', '9875214581@psb']

    
  ngOnInit(): void {
    this.viewData = this.dataService.billerdata;
    console.log("this.viewData" + JSON.stringify(this.viewData))
    this.dataService.isbbpsPage = true
    this.dataService.finalBilldata = ''
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : 'retailBillPayment'
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.fetchpoolAccount()
    
    this.toSelectedAcc = ''
    if (this.constant.getPlatform() == "web") {
      this.platformtype = 'InternetBanking'
    }else{
      this.platformtype = 'MobileBanking'
    }
    
    // this.validatePaymentDetails();
  
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status == "Active") {
        if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT) {
          if (el.accountFlag == "P") {
            this.accountList[0] = el;
          }
        }
      }
    })
    console.log("this.DataService.customerOperativeAccList: " + JSON.stringify(this.dataService.customerOperativeAccList))
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status == "Active") {
        if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT) {
          if (el.accountFlag != "P") {
            this.accountList.push(el);
          }
        }
      }
    })
    console.log("this.accountList" + JSON.stringify(this.accountList) )
    this.accountNumber = this.accountList[0].accountNo;
    this.ifscNumber = this.accountList[0].ifscCode;
    this.selectedAccount = this.accountList[0].SchemeCode +" " + this.accountList[0].sbAccount;
    //this.onFromAccountSelect(this.selectedAccount);
    this.getAccountBalance(this.accountNumber);
    this.accBalance = this.accountList[0].acctBalance
    console.log("this.accountList" +  JSON.stringify(this.accountList));
    this.dataService.otpSessionPreviousPage = 'retailRechargeBillPay';
    this.dataService.isbbpsPage = true
    if(parseFloat(this.accBalance) > parseFloat(this.viewData.billamt)){
      this.insufficientbal = false
      }else{
        this.insufficientbal = true
      }
      this.buildForm() ;
  }
  ngOnDestroy() {
    this.dataService.isbbpsPage = false
  }

  fetchpoolAccount(){
    var param = this.existingBillPayemtServiceService.getbbpsPoolAcc()
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_GetpoolAcc).subscribe((data) => {
      console.log("fetchpoolAccount" , data);
      var resp = data.responseParameter;
   
      if (resp.opstatus == '00') {
        this.toSelectedAcc = data.listofDataset[0].records[0].configVal
        this.constant.bbpsPoolAcc = data.listofDataset[0].records[0].configVal
     
      } else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }
  formatCurrency(amt){
   
    console.log("amt" + amt)
    let amts = this.customCurrencyPipe.transform(amt, 'decimal').replace(/[^.0-9]+/g, '');
    console.log(amts)
    this.lowAmt =  parseFloat(amts) <  parseFloat(this.viewData.minpayableAmt)
    this.moreAmt =  parseFloat(amts) >  parseFloat(this.viewData.maxpayableAmt)
    this.inputAmt = amts
    this.formValidation.formatCurrencybbps(amt, this.remarkForm);
    this.onAmountinput(amts)
  }

  onAccountSelectType() {
    if(window.innerWidth < 767) {
      this.commonMethod.openPopup('div.popup-bottom.sel-account');
    }
  }
  buildForm() {
  this.remarkForm = new FormGroup({
    remark: new FormControl(''),
    amt: new FormControl(''),
  
  });
  if(this.viewData.partialPay == 'Y'){
    
    this.remarkForm.get('amt').setValue(this.viewData.billamt);
    this.remarkForm.get('amt' ).setValidators([Validators.required] );
    this.remarkForm.get('amt').updateValueAndValidity();  

    this.formatCurrency(this.viewData.billamt)
    
  }else{  
    
    this.remarkForm.get('amt').clearValidators()

  }
}
  // onFromAccountSelect(selectedAccount){
  //   console.log(selectedAccount);
    
  //   var account = this.accountList.filter((objs) => objs.accountNo == selectedAccount)[0];
  //   this.SchemeCode= account.SchemeCode
  //   this.maskedSelectedAccount =  account.sbAccount;
  //   this.selectedAccount = selectedAccount;
  //   this.selectedFromAccMobile = selectedAccount;
  //   this.accountItem(selectedAccount)
  // }
  selectAccountradio(item){
    this.mobileSelectedAcc = item
  }

  AccountsubmitClick(){
    this.accountItem( this.mobileSelectedAcc)
    this.commonMethod.closeAllPopup();
  }
  accountItem(value){

    console.log( JSON.stringify( value))
    this.accountNumber = value.accountNo
    this.selectedAccount = value.SchemeCode + " " + value.sbAccount
    this.ifscNumber = value.ifscCode;
    this.dataService.billerdata.ifsc =   this.ifscNumber
    console.log( ' this.accountNumber :' +   this.accountNumber + ' ' +  this.ifscNumber)
    this.getAccountBalance(this.accountNumber);
   
  }


  getAccountBalance(selectedAccount){
    console.log("selectedAccount" + selectedAccount)

  var param = this.sendMoneyService.getAccountBalanceParam(selectedAccount);
  this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BALANCEINQUIRY).subscribe(data => {
    console.log(data);
    var resp = data.responseParameter
    if (resp.opstatus == "00") {
      this.accBalance = data.set.records[0].ledgerBalance
      this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
      if(parseFloat(this.accBalance) > parseFloat(this.viewData.billamt)){
      this.insufficientbal = false
      }else{
        this.insufficientbal = true
      }
    
  }
    else {
      this.errorCallBack(data.subActionId, resp);
      
    }
  })
}





validatePaymentDetails(){

  var param = this.bbpsService.ValidatePaymentParam( this.dataService.billerdata );
  this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
    console.log(data);
    var resp = data.responseParameter
    console.log("ValidatePaymentService ===> " + JSON.stringify(resp))
    if (resp.opstatus == "00") {
    
      
    }
    else {
      this.errorCallBack(data.subActionId, resp);
    }
  })
}

errorCallBack(subActionId, resp) {
  //showToastMessage(resp.Result, "error");
}
getToAccValue(item){
  // this.accountValue = maskedAcctNo ;
  this.accountValue = item.SchemeCode.concat(' ', item.sbAccount) ;
 }

 closePopup(){
   this.commonMethod.closeAllPopup() ;
 }

 goToPage(routeName) {
  this.router.navigateByUrl('/' + routeName);
}
goToPageCust(routeName) {
  this.router.navigateByUrl(routeName);
}

onSelectOption(e, type){
  if (e.stopPropagation) e.stopPropagation();
  switch(type){
    case 'account':
      this.accountNameToggle = !this.accountNameToggle
      if(this.accountNameToggle){
        $('#account-name').slideToggle();
        $('#account-name').parent().toggleClass('active')
      } else{
        $('#account-name').slideUp();
        $('#account-name').parent().removeClass('active')
      }
      break ;

    case 'upi' :
      this.upiNameToggle = !this.upiNameToggle
      if(this.upiNameToggle){
        $('#upi-name').slideToggle();
        $('#upi-name').parent().toggleClass('active')
      } else{
        $('#upi-name').slideUp();
        $('#upi-name').parent().removeClass('active')
      }
      break ;
  }
 

}


accountTypeSelection(item, type ){
  this.onSelectOption('', type)

  switch(type){
    case 'account':
      this.accountValue = item.SchemeCode.concat(' ', item.sbAccount) ;
      this.showAccountMessage = false ;
      break

    case 'upi':
      this.upiNameValue = item;
      this.showUpiMessage = false ;
      break ;
  }

}

clickedOut($event){
  switch(this.paymentType){
    case 'account' :
      $('#account-name').slideUp();
      $('#account-name').parent().removeClass('active')
    break;

    case 'upi':
      $('#upi-name').slideUp();
      $('#upi-name').parent().removeClass('active')
      break ;
  }

}

paymentSelection(e){
  this.paymentType = e ;
}
onAmountinput(value){
  console.log(value)
  if(parseFloat(this.accBalance) >= parseFloat(value)){
    this.insufficientbal = false
  }else{
    if(value != ''){
    this.insufficientbal = true
    }
  }
  this.lowAmt =  parseFloat(value) <  parseFloat(this.viewData.minpayableAmt)
  this.moreAmt =  parseFloat(value) >  parseFloat(this.viewData.maxpayableAmt)

 
}
 proceedPaymentClick(){
  var finalpayableAmt
var displayAmt
  if(this.viewData.partialPay == 'Y'){
    displayAmt =this.remarkForm.value.amt
    finalpayableAmt = this.customCurrencyPipe.transform(this.remarkForm.value.amt, 'decimal').replace(/[^.0-9]+/g, '');
   }else{
    finalpayableAmt = this.viewData.billamt
    displayAmt =this.viewData.billamt
   }

   var balancecheck = parseFloat(this.accBalance) > parseFloat(finalpayableAmt)
   
   if(!this.insufficientbal){
     this.showAccountMessage = false ;
      var date = this.datepipe.transform(new Date().toISOString(), "dd MMM yyyy h:mm a" )
        console.log("this.viewData" + this.viewData)
        this.viewData.remarks = this.remarkForm.value.remark

      var bbpsReqParam = this.existingBillPayemtServiceService.getBbpsTransferParam(this.viewData , this.accountNumber , this.toSelectedAcc , 'within' , this.ID, this.viewData.billerName , finalpayableAmt , this.ifscNumber);

      console.log("bbpsReqParam " + bbpsReqParam)
      this.dataService.request = bbpsReqParam;
      this.dataService.endPoint = this.constant.serviceName_TRANSFERTRANSACTION;
      this.dataService.authorizeHeader = "BILL PAYMENT SEND MONEY";
      this.dataService.transactionReceiptObj.isScheduled = false;
      this.dataService.transactionReceiptObj.from_acc = this.selectedAccount;
      this.dataService.transactionReceiptObj.to_acc = this.toSelectedAcc;
      this.dataService.transactionReceiptObj.payee_name = this.viewData.billerName;
      this.dataService.transactionReceiptObj.amount = "₹" + finalpayableAmt;
      this.dataService.transactionReceiptObj.remarks = this.remarkForm.value.remark != '' ? this.remarkForm.value.remark : "-";
      this.dataService.commonOtpServiceType =  this.constant.val_BILLPAYMENT + " of " +  this.dataService.billcategory;
      this.dataService.transactionReceiptObj.date = this.datepipe.transform(new Date().toISOString(), "dd MMM yyyy h:mm a" );
      this.dataService.screenType = 'bbpsTransfer';
      this.dataService.bbpspaymentType =  this.viewData.paymentType;
      
      // alert(this.DataService.bbpspaymentType)
      this.dataService.finalBilldata = []
      for(var i =0 ; i< this.viewData.displayData.length; i++){
        this.dataService.finalBilldata.push(this.viewData.displayData[i])
      }

      if(this.viewData.partialPay == 'Y'){
        this.dataService.finalBilldata.push ({ "label":  'Payment Amount','field' : finalpayableAmt});
      }
      this.dataService.finalBilldata.push ({ "label":  'Remark','field' : this.remarkForm.value.remark != '' ? this.remarkForm.value.remark : "-"},{ "label":  'From Account','field' :this.selectedAccount},{ "label":  'Date','field' : date});
    
      console.log("this.DataService.finalBilldata : " + JSON.stringify(this.dataService.finalBilldata))
      if( !this.lowAmt &&  !this.moreAmt){
        if(this.toSelectedAcc != ''){
          this.router.navigate(['/otpsession']);
      }else{
        this.commonMethod.openPopup('div.popup-bottom.poolAccpopup');
      }
      }
      }
   else{
    if(finalpayableAmt != ''){
      this.insufficientbal = true
    }
     this.showAccountMessage =true ;
     
   }
 
 }

 upiPaymentProceed(){
  if(this.upiNameValue != ''){
    this.showUpiMessage = false ;


    this.router.navigate(['/otpsession']);
  }
  else{
    this.showUpiMessage =true ;
  }
 }

}
