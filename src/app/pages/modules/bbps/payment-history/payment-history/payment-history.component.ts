import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { CommonMethods } from '../../../../../services/common-methods';
import { DatePipe , Location} from '@angular/common';
import { AppConstants } from '../../../../../app.constant';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import {PaymentHistoryService} from './payment-history.service'
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import {RechargeBillpayService} from '../../recharge-billpay/recharge-billpay.service'
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit , OnDestroy {

  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,
    private paymentHistoryService: PaymentHistoryService,
    private http: HttpRestApiService,
    private location : Location,
    private rechargeBillpayService : RechargeBillpayService,
    private storage: LocalStorageService,
    private constant : AppConstants,
    private datepipe: DatePipe,) { }

    transactionForm: FormGroup;
    durationForm: FormGroup;

    showFiltrtErrorMsg:boolean = false

    recentTrans:any;
    transactionErrorMsg:any
    minend:any
    maxend:Date = new Date();
    finalRecentTransList:any;
    maxFrom : Date = new Date();
    filterErrorMsg:any
 
    minfrom:any;
    popupHeader:any = "Transcation History"
    itemsPerPage = 10;
    p = 1;
    searchOptions = 'transaction'
    pendingBillerLogoListforRecentTrans:any

  renderedData:any = []
  ngOnInit(): void {
    this.buildForm();
   
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : "retailRechargeBillPay"
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));


    if(this.DataService.iscomingfromComplaint){
      this.commonMethod.openPopup('div.filter1');
      this.popupHeader = "Search Transcation to raise complaint"
    }else{
      if(this.DataService.finalRecentTransList.length == 0){
      this.getResentTransaction('','','','')
      }else{
        
        this.renderedData = this.DataService.finalRecentTransList
      }
      this.popupHeader = "Transcation History"
    }

    console.log("this.renderedData" + JSON.stringify(this.renderedData))
 
    this.DataService.isbbpsPage = true
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
    this.DataService.iscomingfromComplaint = false

  }

  fromDateChange(value){
    
    this.minend =value


  }
  endDateChange(value){
    this.maxFrom =value
    
  }

  buildForm() {
    this.transactionForm = new FormGroup({
      transactionNumber: new FormControl('', [Validators.required]),
    });
    this.durationForm = new FormGroup({
    
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
    });
  }

  validateForm(value) {
    switch (value) {
      case 'transaction':
        if (this.transactionForm.invalid) {
          this.transactionForm.get('transactionNumber').markAsTouched();
        }
        break;

      case 'duration':
        if (this.durationForm.invalid) {
         
          this.durationForm.get('startDate').markAsTouched();
          this.durationForm.get('endDate').markAsTouched();
        }
        break;
    }
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  openFilter() {
    this.commonMethod.openPopup('div.filter1');
  }

  closePopup() {
    this.commonMethod.closeAllPopup();
  }

  getResentTransaction(type , refNum , fromDate , toDate) {
    // alert(this.DataService.customerID)
    this.renderedData = []
    var recentTransBillerId = ''
    let param = this.paymentHistoryService.getTransactionHistoryParam(type , refNum , fromDate , toDate);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES ,  {showErrorPopup:false}).subscribe(data => {
    
      var resp = data.responseParameter;
      var bbpsRespons = JSON.parse(resp.bbpsResponse)
     
      if (resp.opstatus == "00") {
        this.showFiltrtErrorMsg = false
        console.log(data.responseParameter);
        if(!Array.isArray(JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result)){
          this.recentTrans.push(JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result)
        }else{
          this.recentTrans =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
        }
        //x  this.recentTrans =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
        //   this.recentTrans = JSON.parse(this.recentTrans)
          console.log('this.recentTrans ===> ' +  JSON.stringify(this.recentTrans ))
          for(var i = 0;  i < this.recentTrans.length ; i++){
            recentTransBillerId = recentTransBillerId +  this.recentTrans[i].billerid + ','
           }
         this.getbillersLogoDetialsforRecentTrans( this.recentTrans , recentTransBillerId)
         
       }
       else if(bbpsRespons.status == "422"){
        this.showFiltrtErrorMsg = true
        this.filterErrorMsg =bbpsRespons.msg
        if(type != "" && refNum != "" && fromDate != "" && toDate != "" && this.DataService.iscomingfromComplaint){
          this.commonMethod.openPopup('div.filter1', true);
        }
       }
       else if(bbpsRespons.status == "404"){
        this.showFiltrtErrorMsg = true
        if(bbpsRespons.msg){
          this.filterErrorMsg = bbpsRespons.msg
          }else{
            this.filterErrorMsg ="Currently facing issue while fetching transaction history"
          }
        
       if(type != "" && refNum != "" && fromDate != "" && toDate != "" && this.DataService.iscomingfromComplaint){
          this.commonMethod.openPopup('div.filter1', true);
        }
      }
      else {
        this.showFiltrtErrorMsg = true
        this.filterErrorMsg ="Currently facing issue while fetching transaction history"
       // this.filterErrorMsg = JSON.parse(data.responseParameter.bbpsResponse).msg
        if(type != "" && refNum != "" && fromDate != "" && toDate != "" && this.DataService.iscomingfromComplaint){
          this.commonMethod.openPopup('div.filter1', true);
        }
      }
    });
  }

  getbillersLogoDetialsforRecentTrans(recentTransList ,recentTransBillerId){
   
    let billerListparam = this.rechargeBillpayService.getLogoDetials(recentTransBillerId);
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        
          this.pendingBillerLogoListforRecentTrans = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
          console.log("this.pendingBillerLogoList " + JSON.stringify(this.pendingBillerLogoListforRecentTrans.billerData) )
          console.log("this.billerlist " + JSON.stringify(recentTransList) )
          for(var i= 0; i < recentTransList.length; i++){
            for(var j= 0; j < this.pendingBillerLogoListforRecentTrans.length ; j++){
                if(recentTransList[i].billerid == this.pendingBillerLogoListforRecentTrans[j].billerId){
                 
                  recentTransList[i].moreDetails = JSON.parse(this.pendingBillerLogoListforRecentTrans[j].billerData)
                  var txnDate = this.recentTrans[i].txn_date_time.split("-");
           
                  var formatedtxndate = txnDate[1] +'/'+ txnDate[0]+ '/' + txnDate[2]
                  console.log("formatedDuedate ==>" + formatedtxndate)
                  var finaltxn = new Date(formatedtxndate)
                 
                 this.recentTrans[i].formatedTxnDate = this.datepipe.transform(finaltxn, 'dd MMM yy, hh:mm a')
                  }
               
              }
          }
          console.log("recentTransListSanal " + JSON.stringify(recentTransList))
         // this.DataService.finalRecentTransList = recentTransList
          this.renderedData = recentTransList
          this.transactionForm.reset()
          this.durationForm.reset()

            this.commonMethod.closeAllPopup();
          
        //  alert(this.finalRecentTransList.length)
         
      }
      else {
      ///  this.errorCallBack(data.subActionId, resp);
      }
    });
  }


  trackFilterSubmit(value) {

    switch (value) {
      case 'transaction':
        this.trackFormValidationAfterSelection() ;
        if (this.transactionForm.valid) {
          this.getResentTransaction(value , this.transactionForm.value.transactionNumber , '' , '')
        } else {
          this.validateForm(value)
        }
        break;

      case 'duration':
        this.trackFormValidationAfterSelection() ;
        if (this.durationForm.valid) {
        
          // console.log(" this.durationForm.value.startDate : " + this.datepipe.transform(this.durationForm.value.startDate, 'dd-MM-yyyy'))
          // console.log(" this.durationForm.value.startDate : " + this.datepipe.transform(this.durationForm.value.endDate, 'dd-MM-yyyy'))
          this.getResentTransaction(value , "", moment(this.durationForm.value.startDate).format("DD-MM-YYYY") ,  moment(this.durationForm.value.endDate).format("DD-MM-YYYY")
          )
        
        } else {
          this.validateForm(value)
        }
        break;
    }
  }

  resetform(){
   
      this.durationForm.reset() ;
  
      this.transactionForm.reset() ;
      this.maxFrom =  new Date();
      this.minfrom = '';
      this.filterErrorMsg ==''
      this.showFiltrtErrorMsg = false;
  }
 

  trackFormValidationAfterSelection(){
    if(this.searchOptions == 'duration'){
      this.transactionForm.get('transactionNumber').clearValidators();
      this.durationForm.get('startDate')?.setValidators([Validators.required]);
      this.durationForm.get('endDate')?.setValidators([Validators.required]);

      this.transactionForm.get('transactionNumber').updateValueAndValidity();
      this.durationForm.get('startDate').updateValueAndValidity();
      this.durationForm.get('endDate').updateValueAndValidity();

    } else {
      this.transactionForm.get('transactionNumber').setValidators([Validators.required]);
     
      this.durationForm.get('startDate')?.clearValidators();
      this.durationForm.get('endDate')?.clearValidators();

      this.transactionForm.get('transactionNumber').updateValueAndValidity();
    
      this.durationForm.get('startDate').updateValueAndValidity();
      this.durationForm.get('endDate').updateValueAndValidity();
    }

  }

  billHistoryDetails(item){
    this.DataService.billHistoryDetails = item
    this.router.navigateByUrl('/billDetails');

    console.log("billHistoryDetails>>>> " + JSON.stringify(item))
  }

}
