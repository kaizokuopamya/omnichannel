import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { DatePipe , Location} from '@angular/common';
import { AppConstants } from '../../../../../app.constant';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import {BbpsService} from 'src/app/services/bbps.service'
import * as moment from 'moment';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import {RechargeBillpayService} from '../../recharge-billpay/recharge-billpay.service'
@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent implements OnInit {

  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,
    private bbpsService: BbpsService,
    private http: HttpRestApiService,
    private rechargeBillpayService : RechargeBillpayService,
    private storage: LocalStorageService,
    private constant : AppConstants,
    private location : Location,
    private datepipe: DatePipe,) { }
    recentTrans:any;
   
  transactionForm: FormGroup;
  nocomplaintsRegistered:boolean =false;
  complaintList:any = [];
  durationForm: FormGroup;
  renderedData:any = []
  minend:any
  maxFrom : Date = new Date();
  maxend:Date = new Date();
  searchOptions = 'transaction'
  pendingBillerLogoListforRecentTrans:any
  ngOnInit(): void {
    this.buildForm();
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : "retailRechargeBillPay"
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    if(this.DataService.allComplaintList.length == 0){
      this.getAllcomplains("Transaction" , '' , moment().subtract(6, 'months').format("DD-MM-YYYY") ,  moment(new Date()).format("DD-MM-YYYY"))
    }else{
      this.renderedData =this.DataService.allComplaintList
    }
    // this.renderedData =  this.DataService.allComplaintList
    console.log("this.renderedData" + JSON.stringify(this.renderedData))
    this.DataService.isbbpsPage = true
  }
  complaintClick(item:any){

    this.DataService.Complaintdetails = item
    this.goToPage('complaintDetails')

  }
  fromDateChange(value){
    
    this.minend =value


  }
  endDateChange(value){
    this.maxFrom =value
    
  }
  raiseComplaintClick(){
    this.DataService.iscomingfromComplaint = true
    this.goToPage('retailPaymentHistory')
  }

  ngOnDestroy() 
  {
    this.DataService.isbbpsPage = false
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

  getAllcomplains(type , comID , fromdate , toDate){
    
  this.renderedData = []

    let billerListparam = this.bbpsService.getComplainDetails(type , comID ,fromdate , toDate);
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
    
      var resp = data.responseParameter;
      console.log("JSON.stringify(resp) complaint"+  JSON.stringify(resp))
      if (resp.opstatus == "00") {
        // this.complaintList = data.responseParameter;
        var bbpscomplaints = JSON.parse(resp.bbpsResponse)
        console.log("bbpscomplaints :" + JSON.stringify(bbpscomplaints))
        this.complaintList = bbpscomplaints.responseParameter.result
        this.renderedData = bbpscomplaints.responseParameter.result
        this.commonMethod.closeAllPopup();
        } 
        else  if(JSON.parse(data.responseParameter.bbpsResponse).status == 404){
          this.commonMethod.closeAllPopup();
          } 
        
        else  {
          this.commonMethod.closeAllPopup();
        // this.errormsg01 = JSON.parse(data.responseParameter.bbpsResponse).msg;
      //  this.apiErrorMsg =  "Sorry, we are facing some downtime due to which Complaints aren't available" ;
       


        //this.commonMethod.openPopup('div.errorMSg')

      }

  })
}

  complaintslistfuction(type , compID , fromDate , toDate) {
    // alert(this.DataService.customerID)
    var recentTransBillerId = ''
    let param =this.bbpsService.getComplainDetails("Transaction" , compID ,fromDate , toDate);
    this.http.callBankingAPIService('param', this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
    
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
      
          this.recentTrans =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
        //   this.recentTrans = JSON.parse(this.recentTrans)
          console.log('this.recentTrans ===> ' +  JSON.stringify(this.recentTrans ))
          for(var i = 0;  i < this.recentTrans.length ; i++){
            recentTransBillerId = recentTransBillerId +  this.recentTrans[i].billerid + ','
           }
         this.getbillersLogoDetialsforRecentTrans( this.recentTrans , recentTransBillerId)
         
       }
      else {
    
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
                  
                  }
               
              }
          }
          console.log("recentTransListSanal " + JSON.stringify(recentTransList))
         // this.DataService.finalRecentTransList = recentTransList
          this.renderedData = recentTransList
          this.reset()
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
          this.getAllcomplains("Transaction" , this.transactionForm.value.transactionNumber , '' , '')
        } else {
          this.validateForm(value)
        }
        break;

      case 'duration':
        this.trackFormValidationAfterSelection() ;
        if (this.durationForm.valid) {
          // console.log(" this.durationForm.value.startDate : " + this.datepipe.transform(this.durationForm.value.startDate, 'dd-MM-yyyy'))
          // console.log(" this.durationForm.value.startDate : " + this.datepipe.transform(this.durationForm.value.endDate, 'dd-MM-yyyy'))
          this.getAllcomplains("Transaction" , "", moment(this.durationForm.value.startDate).format("DD-MM-YYYY") ,  moment(this.durationForm.value.endDate).format("DD-MM-YYYY"))
          
        
        } else {
          this.validateForm(value)
        }
        break;
    }
  }

  reset(){
    if(this.searchOptions == 'duration'){
      this.durationForm.reset() ;
    }else{
      this.transactionForm.reset() ;
    }
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
