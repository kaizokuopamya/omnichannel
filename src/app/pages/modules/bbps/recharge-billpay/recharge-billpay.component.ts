import { Component, OnInit, OnDestroy , AfterViewChecked , AfterContentInit} from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../../../app.constant';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import {BbpsService} from 'src/app/services/bbps.service'
import { DatePipe , Location} from '@angular/common';
import {ChangeDetectorRef } from '@angular/core';
import {UpaidBillInfosService} from '../unpaid-bill-infos/upaid-bill-infos.service'
import * as moment from 'moment';
import { CommonMethods } from '../../../../services/common-methods';
import { LocalStorageService } from '../../../../services/local-storage.service';
import {RechargeBillpayService} from './recharge-billpay.service'
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import{BillReminderListService} from '../pending-bill/bill-reminder-list/bill-reminder-list.service'
@Component({
  selector: 'app-recharge-billpay',
  templateUrl: './recharge-billpay.component.html',
  styleUrls: ['./recharge-billpay.component.scss']
})
export class RechargeBillpayComponent implements OnInit , OnDestroy , AfterContentInit{
   instantPayList

  constructor( private router:Router,
    public DataService: DataService , 
    public constant: AppConstants,
    public location : Location,
    private bbpsService : BbpsService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    public upaidBillInfosService: UpaidBillInfosService,
    public commonMethod: CommonMethods,
    private datepipe: DatePipe, private cdref: ChangeDetectorRef ,
    private billReminderListService :BillReminderListService,
    private rechargeBillpayService : RechargeBillpayService) { 
    this.DataService.bbpsMobileNumber = '';
    this.getBillerCategory()
    }
    
    finalExistingBillerDetails:any =[]
    allfiveRegisteredBillers:any = [];
    finalUnpaidBillerDetails:any= []
    fiveRegisteredBillers:any = [];
    allBillerWithLogo:any= [];
    upaidBillerWithLogo:any=[];
    mergedBillList:any =[]
    complaintList:any=[]
    pagerenderslider:any =[];
    pagerenderslider2:any= [];
    billReminderList:any =[]
    finalRecentTrans:any = [];
    providerSearch:any =[];



  rechargeBillPayOptionsMobile:OwlOptions;
  rechargeBillPayOptions :OwlOptions;


  billdetails:any
  todaysDate:any;
  leftDate:any
  errormsg01:any;
  existingBillerDetails:any
  pendingBillerLogoList:any
  billerIdlist:any = '';
  validatedillerRes:any
  billerdetailsDataPass:any;
  logoUrl:any
  finalRecentTransList:any;
  partialPay:any;
  validatePay:any;
  platformtype:any;
  cou_conv_fee:any = "0.00";
  bou_conv_fee:any ="0.00";
  totalHandlingCharge:any
  apiErrorMsg:any
  transactionHistorylist:any
  recentTrans:any;
  pendingBillerLogoListforRecentTrans:any;
  payTypeBox : any  = 'instaPay' ;
  sliderJSon1:any;
  sliderJSon2:any;
  sliderJSon3:any;
  recentTransError:any


  isDesktop:boolean
  noBillerRegistered:boolean = false;
  nocomplaintsRegistered:boolean= false;
  noRecentTransactions:boolean = false;



  ngOnInit(): void {
   
    
    this.todaysDate = moment(new Date()).format('DD/MM/YYYY');
    this.DataService.isbbpsPage = true
    if (this.constant.getPlatform() == "web") {
      this.platformtype = 'InternetBanking'
      this.isDesktop = true
      this.rechargeBillPayOptions = this.DataService.getrecommendedCardCarouselOptions();
     }else{
      this.platformtype = 'MobileBanking'
       this.isDesktop = false
       console.log(" this.pagerenderslider " + JSON.stringify( this.pagerenderslider ))
       this.rechargeBillPayOptionsMobile = this.DataService.getrecommendedCardCarouselOptionsMobile();
     }
    // this.cdref.detectChanges();
   
 
  
    
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : "dashboardMobile"
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
   if(this.DataService.allregisteredBillerList.length == 0){
    this.getAllRegisteredBillers()
   }else{
    this.allfiveRegisteredBillers = this.DataService.allregisteredBillerList.slice(0 , 5) 
   // this.finalUnpaidBillerDetails = this.DataService.allUnpaidBillerList.slice(0 , 5)
    this.upaidBillerWithLogo =this.DataService.allUnpaidBillerList.slice(0 , 5)
   
   }
   if(this.DataService.billReminderList.length == 0){
    this.getreminderList()
  }else{
    this.billReminderList =  this.DataService.billReminderList 
  }
    
    if( this.DataService.finalRecentTransList.length == 0){
     
      this.getResentTransaction()
    }else{
     
      this.finalRecentTrans  =this.DataService.finalRecentTransList
    }
   
    this.getAllcomplains()
  }
  getBillerCategory() {
    let categoryListParam = this.bbpsService.getBillerCategories();
    this.http.callBankingAPIService(categoryListParam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log("sanal ==> " + JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        
          this.DataService.bbpsBillerCategory =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.categoryList
         // this.existingBillerDetails = JSON.parse(this.existingBillerDetails)
         this.instantPayList = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.categoryList
        this.initializeSlider(JSON.parse(data.responseParameter.bbpsResponse).responseParameter.categoryList)
        }
      else {
   
      }
    });
  }
  initializeSlider(list){
    console.log("this.DataService.bbpsBillerCategory" , list)
    let groupByN = (n, data) => {
      let result = [];
      for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
      return result;
    };
    this.pagerenderslider = groupByN(8, list)
    console.log("pagerenderslider" , this.pagerenderslider)
    

  }
  ngAfterContentInit() {
  
    
     }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  goToPage(value){
    this.router.navigateByUrl("/" + value);
   
  } 
  onIntaClick(name  ){
   
    this.DataService.billtype = name
    this.DataService.billcategory = name
    if(this.DataService.billcategory == "Mobile Prepaid"){
      this.router.navigateByUrl("mobilePrepaid");
    }else{
      if(this.platformtype == "InternetBanking"){
      this.router.navigateByUrl("retailBillPayment");
      }else{
        this.router.navigateByUrl("mobbillersearch");
      }
    }
  }
  trimName(name){
    let catname 
    if(name){
      catname =  name.replace(/ /g,'')
    }
    return catname
  }
  raiseComplaintClick(){
    this.DataService.iscomingfromComplaint = true
    this.goToPage('retailPaymentHistory')
  }
  removeBiller(){
 
    var param = this.upaidBillInfosService.deletebillerparam(this.billdetails.billeraccount.billeraccountid);
    console.log("reqData" + JSON.stringify(param))
    this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      console.log("deteleBiller ===> " + JSON.stringify(resp))
      if (resp.opstatus == "00") {
        this.DataService.allregisteredBillerList = []
        this.commonMethod.openPopup('.successMsg')
        }
        else if (resp.opstatus == "01") {
          let errorMsg = JSON.parse(resp.bbpsResponse)
              this.apiErrorMsg = errorMsg.msg
              this.commonMethod.openPopup('.errorMSg')
        }
        else {
          // this.errorCallBack(data.subActionId, resp);
      }
    });
  }
  // getTransactionHistory(){
  //   let param = this.rechargeBillpayService.getTransactionHistoryParam();
  //   this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
  //     // console.log(JSON.parse(data.responseParameter.bbpsResponse));
  //     var resp = data.responseParameter;
  //     if (resp.opstatus == "00") {
  //       this.transactionHistorylist =  JSON.parse(data.responseParameter.bbpsResponse).responseParameter
  //         console.log("getTransactionHistory " +JSON.stringify(this.transactionHistorylist))
  //     }
  //     else {
    
  //     }
  //   })
  // }

  getAllRegisteredBillers() {
   
    // alert(this.DataService.customerID)
    let billerListparam = this.rechargeBillpayService.getBillDetails();
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES , {showErrorPopup:false}).subscribe(data => {
    
      var resp = data.responseParameter;
      console.log("JSON.stringify(resp)2"+  JSON.stringify(resp))
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        var fiveBillerId = ''
       // alert( this.existingBillerDetails)
          this.existingBillerDetails =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
     //     this.existingBillerDetails = JSON.parse(this.existingBillerDetails)
          console.log('this.existingBillerDetails ===> ' +  this.existingBillerDetails )
        
          // this.getUnpaidbills(this.existingBillerDetails)
          console.log(" this.billerIdlist" +  this.billerIdlist)
          console.log(" this.finalExistingBillerDetails" +  JSON.stringify(this.finalExistingBillerDetails))
         for(var i = 0;  i < this.existingBillerDetails.length ; i++){
               fiveBillerId = fiveBillerId +  this.existingBillerDetails[i].billeraccount.billerid + ','
          }
         this.getbillersLogoDetials(this.existingBillerDetails ,fiveBillerId)
         this.noBillerRegistered = false;
      }
      else  {
        // this.errormsg01 = JSON.parse(data.responseParameter.bbpsResponse).msg;
      this.apiErrorMsg =  JSON.parse(data.responseParameter.bbpsResponse).msg;
        if(JSON.parse(data.responseParameter.bbpsResponse).status == 404){
        this.noBillerRegistered = true;
        } 


       // this.commonMethod.openPopup('div.errorMSg')

      }
   
    });
  }


  getreminderList(){

    let param = this.billReminderListService.addBillReminderparam()
     this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETBBPSREMINDERSLIST).subscribe(data => {
       // console.log(JSON.parse(data.responseParameter.bbpsResponse));
       var resp = data.responseParameter;
       console.log("GetBillerSERVIVE " +  JSON.stringify(resp))
       if (resp.opstatus == "00") {
        var reminderlist = data.set.records
         console.log("reminderlistreminderlist " , reminderlist)
      //   reminderlist.splice(2, 1);
         for(var i =0 ; i< reminderlist.length; i++){
           if(reminderlist[i].statusId != '10'){
               var parsedata = JSON.parse(reminderlist[i].consumerDetails)
     
               reminderlist[i].consumerDetails = parsedata
            
               this.billReminderList.push(reminderlist[i])
               this.DataService.billReminderList = this.billReminderList
               
               
             }
         }
       
         console.log( " this.billReminderList" +  JSON.stringify(this.billReminderList)  )
         
       }
       else {
     
       }
     })
 
 
   }



  getAllcomplains(){
    var toDate = moment(new Date()).format("DD-MM-YYYY")
    var fromdate = moment().subtract(6, 'months').format("DD-MM-YYYY")
    let billerListparam = this.rechargeBillpayService.getComplainDetails(fromdate , toDate);
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES , {showErrorPopup:false}).subscribe(data => {
    
      var resp = data.responseParameter;
      console.log("JSON.stringify(resp)"+  JSON.stringify(resp))
      if (resp.opstatus == "00") {
        // this.complaintList = data.responseParameter;
        var bbpscomplaints = JSON.parse(resp.bbpsResponse)
        console.log("bbpscomplaints :" + JSON.stringify(bbpscomplaints))
        this.complaintList = bbpscomplaints.responseParameter.result
        this.DataService.allComplaintList = this.complaintList;
        console.log("finalRecentTransListsanal  " + JSON.stringify(this.finalRecentTransList))
        var recent =[]
        var complaint =[]
          console.log("recentTransList[i].bbps_ref_no" + recent)
          console.log("this.complaintList[k].bbps_ref_no" + complaint)
          console.log(" this.complaintList this.complaintList " +  JSON.stringify(this.complaintList))
        } else  {
        // this.errormsg01 = JSON.parse(data.responseParameter.bbpsResponse).msg;
      //  this.apiErrorMsg =  "Sorry, we are facing some downtime due to which Complaints aren't available" ;
        if(JSON.parse(data.responseParameter.bbpsResponse).status == 404){
        this.nocomplaintsRegistered = true;
        } 


        //this.commonMethod.openPopup('div.errorMSg')

      }

  })
}


  getResentTransaction() {
    
    var recentTransBillerId = ''
    let param = this.rechargeBillpayService.getTransactionHistoryParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
    
      var resp = data.responseParameter;
      console.log("resp.opstatus" + JSON.stringify(resp))
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
      
          this.recentTrans =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
        //   this.recentTrans = JSON.parse(this.recentTrans)
        
          console.log('this.recentTrans ===> ' +  JSON.stringify(this.recentTrans ))
          for(var i = 0;  i < this.recentTrans.length ; i++){
            recentTransBillerId = recentTransBillerId +  this.recentTrans[i].billerid + ','

            var txnDate = this.recentTrans[i].txn_date_time.split("-");
           
            var formatedtxndate = txnDate[1] +'/'+ txnDate[0]+ '/' + txnDate[2]
            console.log("formatedDuedate ==>" + formatedtxndate)
            var finaltxn = new Date(formatedtxndate)
           
           this.recentTrans[i].formatedTxnDate = this.datepipe.transform(finaltxn, 'dd MMM yy, hh:mm a')
           }
          
         this.getbillersLogoDetialsforRecentTrans( this.recentTrans , recentTransBillerId)
        
       }
       else if(JSON.parse(data.responseParameter.bbpsResponse).status == 404){
        this.noRecentTransactions = true;
        this.recentTransError = "NO_TRANS_MADE"
        } 
       else  {
        // this.errormsg01 = JSON.parse(data.responseParameter.bbpsResponse).msg;
        this.noRecentTransactions = true;
        this.recentTransError = "RECENT_TRANSACTION_ISSUE"
       
        this.apiErrorMsg =  "" ;
        // this.commonMethod.openPopup('div.errorMSg')

      }
    });
  }

  getbillersLogoDetialsforRecentTrans(recentTransList ,recentTransBillerId){
    var complaintwithlogo
    let billerListparam = this.rechargeBillpayService.getLogoDetials(recentTransBillerId);
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {



        console.log(data.responseParameter);
        
          this.pendingBillerLogoListforRecentTrans = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
          console.log("this.pendingBillerLogoList " + JSON.stringify(this.pendingBillerLogoListforRecentTrans.billerData) )
          console.log("this.billerlist " + JSON.stringify(recentTransList) )
          console.log("this.pendingBillerLogoListforRecentTrans " + JSON.stringify(this.pendingBillerLogoListforRecentTrans) )
          var complainlistwithlogo
          for(var i= 0; i < recentTransList.length; i++){
            for(var j= 0; j < this.pendingBillerLogoListforRecentTrans.length ; j++){
                if(recentTransList[i].billerid == this.pendingBillerLogoListforRecentTrans[j].billerId){
                 
                  recentTransList[i].moreDetails = JSON.parse(this.pendingBillerLogoListforRecentTrans[j].billerData)
                  
                  }
              }
            
              console.log("this.complaintList.length" + this.complaintList.length )
              //  for(var k= 0; k < this.complaintList.length ; k++){
              //    console.log("recentTransList[i].bbps_ref_no" + recentTransList[i].bbps_ref_no)
              //    console.log("this.complaintList[k].bbps_ref_no" + this.complaintList[k].bbps_ref_no)
              //   if(recentTransList[i].bbps_ref_no == this.complaintList[k].bbps_ref_no){
              //     this.complaintList[k].moreDetails = JSON.parse(this.pendingBillerLogoListforRecentTrans[j].billerData)
              //   }
              // }
             
          }
          console.log("recentTransListSanalcomplaintList " + JSON.stringify(this.complaintList))
          console.log("recentTransListSanal " + JSON.stringify(recentTransList))
          this.DataService.finalRecentTransList = recentTransList
          this.finalRecentTransList = recentTransList
        //  alert(this.finalRecentTransList.length)
          this.finalRecentTrans = recentTransList.slice(0 , 5)
          
      }
      else {
      ///  this.errorCallBack(data.subActionId, resp);
      }
    });
  }



  getbillersLogoDetials(billerlist , idList) {
    this.finalUnpaidBillerDetails=[]
    console.log("idListsss " + idList)
    var sortedBilllist = []
    let billerListparam = this.rechargeBillpayService.getLogoDetials(idList);
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        
          this.pendingBillerLogoList = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
          console.log("this.pendingBillerLogoList " + JSON.stringify(this.pendingBillerLogoList.billerData) )
          console.log("this.billerlist " + JSON.stringify(billerlist) )
          for(var i= 0; i < billerlist.length; i++){
            for(var j= 0; j < this.pendingBillerLogoList.length ; j++){
                if(billerlist[i].billeraccount.billerid == this.pendingBillerLogoList[j].billerId){
                 
                   billerlist[i].moreDetails = JSON.parse(this.pendingBillerLogoList[j].billerData)
                  if(billerlist[i].billlist?.length){
                      var duedate =  billerlist[i].billlist[0].billduedate.split("-");
                      var formatedDuedate = duedate[1] +'/'+ duedate[0]+ '/' + duedate[2]
                      console.log("formatedDuedate ==>" + formatedDuedate)
                      var finaldue = new Date(formatedDuedate)
                      var currentDate = new Date()
                      this.leftDate = finaldue.getTime() - currentDate.getTime() 
                      this.leftDate =  this.leftDate / (1000 * 3600 * 24);
                      console.log("finaldue.getDate() : " + finaldue.getTime()) 
                      console.log("currentDate.getDate() : " + currentDate.getTime()) 
                      console.log("leftDate() : " + this.leftDate) 
                      this.leftDate = parseInt( this.leftDate , 10)
                      billerlist[i].daysLeft =  this.leftDate 
                      billerlist[i].formatedDuedate =  this.datepipe.transform(finaldue, 'dd MMM yy')

                      console.log("this.leftDate" + this.leftDate);  
                      console.log("this.formatedDuedate" + billerlist[i].formatedDuedate); 
                      sortedBilllist.unshift(billerlist[i])
                    }else{
                      sortedBilllist.push(billerlist[i])
                    }
                  }
               
              }
          }

          console.log("FinalbillerlistSANAL " + JSON.stringify(sortedBilllist))
         // alert( billerlist.length)
      }
      else {
      ///  this.errorCallBack(data.subActionId, resp);
      }
        this.DataService.allregisteredBillerList = sortedBilllist

        if(sortedBilllist.length){
          this.allfiveRegisteredBillers = sortedBilllist.slice(0 , 5)
         
        }  
      for(var i = 0 ; i < sortedBilllist.length ;i++){
            if(sortedBilllist[i].billlist?.length > 0){
              for(var j = 0 ; j < sortedBilllist[i].billlist.length; j++ ){
                if(sortedBilllist[i].billlist[j].billstatus == "UNPAID"){
                  this.finalUnpaidBillerDetails.push(sortedBilllist[i])
                }
               
              }
              
          }
        }
        this.DataService.allUnpaidBillerList = this.finalUnpaidBillerDetails
        if(this.finalUnpaidBillerDetails.length){
          this.upaidBillerWithLogo = this.finalUnpaidBillerDetails.slice(0 , 5)
        }
        
        console.log("all FinalbillerlistSANAL2" + JSON.stringify(billerlist))
        console.log("all allfiveRegisteredBillers" + JSON.stringify(this.allfiveRegisteredBillers))
    
    });
    
  }
  deleteBiller(item){

  }
  payPendingBill(item){

    console.log("itemitem" + JSON.stringify(item))
    let billerdetailsList = {
      billerName:item.moreDetails.biller_name,
      billerId: item.moreDetails.billerid,
      authenticators: item.billlist[0].authenticators,
      
    }
    this.logoUrl =item.moreDetails.biller_logo,
    this.partialPay = item.moreDetails.partial_pay;
    this.validatePay =item.moreDetails.online_validation;
    if(item.moreDetails.customer_conv_fee?.length > 0 ){
    item.moreDetails.customer_conv_fee.forEach(el => {
        if (el.payment_channel == "Internet" && el.payment_method == "BankAccount") {
          if( el.cou_conv_fee != undefined){
           
            
            this.cou_conv_fee = el?.cou_conv_fee
          }else{
            this.cou_conv_fee = "0.00"
          }

          if( el.bou_conv_fee != undefined){
            this.bou_conv_fee = el?.bou_conv_fee
          }else{
            this.bou_conv_fee = "0.00"
          }
          }
       })
       console.log("this.cou_conv_fee : " + this.cou_conv_fee)
       console.log("this.bou_conv_fee : " + this.bou_conv_fee)
    }else{

      this.cou_conv_fee = "0.00"
      this.bou_conv_fee = "0.00"
    }
    this.totalHandlingCharge = (parseFloat(this.cou_conv_fee) + parseFloat( this.bou_conv_fee)).toFixed(2)
   // alert(item.moreDetails.online_validation)
    //  if(item.moreDetails.online_validation == "Y"){
    //     this.validatePaymentDetails(billerdetailsList)
    // }

      this.DataService.isbillerbbps = item.isbillerbbps
      this.billerdetailsDataPass = {
      'billerName' :item.moreDetails.biller_name,
      'billamt':  (parseFloat(item.billlist[0].billamount) + parseFloat(this.totalHandlingCharge) ).toFixed(2),
      'billCategory': item.moreDetails.biller_category,
      'logourl' :item.moreDetails.biller_logo,
      'billerId' :item.moreDetails.billerid,
      'dueDate': item.billlist[0].billduedate,
      'billId': item.billlist[0].billid,
      'consumerNo': item.billeraccount.authenticators[0].value,
      'paymentType': "billpay",
      'cou_conv_fee' : this.cou_conv_fee,
      'bou_conv_fee' : this.bou_conv_fee,
      'auth': item.billlist[0].authenticators,
      'partialPay' : item.moreDetails.partial_pay,
        "formatedDuedate":item.formatedDuedate,
      'displayData':[
        {
          "label":  'Short Name',
          'field' : item.billeraccount.short_name
        },
       
        {
          "label":  'Bill Amount',
          'field' : "₹" +  parseFloat(item.billlist[0].billamount),
        },
        {
          "label":  'Handling Fees',
          'field' : "₹" + this.totalHandlingCharge,
        },
        {
          "label":  'Bill Date',
          'field' : item.billlist[0].billdate
        },
        {
          "label":  'Bill Status',
          'field' :  item.billlist[0].billstatus,
        },
      ]
    }
    this.DataService.billerdata =   this.billerdetailsDataPass
    console.log("itemitemitemitem" + JSON.stringify(item))  
    this.goToPage('existingBillPayment') ;
  }

  validatePaymentDetails(data){

  
    var param = this.bbpsService.ValidatePaymentParam(data);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      console.log("ValidatePaymentService ===> " + JSON.stringify(resp))
      if (resp.opstatus == "00") {
        this.validatedillerRes = JSON.parse(resp.bbpsResponse).responseParameter.result
        this.validatedillerRes =  JSON.parse(this.validatedillerRes )
        console.log("this.validatedillerRes ===> " +  JSON.stringify(this.validatedillerRes))
        console.log(typeof this.validatedillerRes  )
        this.billerdetailsDataPass = {
          'billerName' :this.validatedillerRes.biller_name,
          'billamt':  (parseFloat(this.validatedillerRes.billlist[0].billamount) + parseFloat(this.totalHandlingCharge) ).toFixed(2),
          'billCategory': this.validatedillerRes.biller_category,
          'logourl' :this.logoUrl,
          'billerId' :this.validatedillerRes.billlist[0].billerid,
          'validationid' :this.validatedillerRes.validationid,
          'dueDate': this.validatedillerRes.billlist[0].billduedate,
          'paymentType': 'Biller',
          'cou_conv_fee' : this.cou_conv_fee,
          'bou_conv_fee' : this.bou_conv_fee,
          'displayData':[
            {
              "label":  'Customer Name',
              'field' : this.validatedillerRes.billlist[0].customer_name
            },
            {
              "label":  this.validatedillerRes.authenticators[0].parameter_name,
              'field' :  this.validatedillerRes.authenticators[0].value,
            },
            {
              "label":  'Bill Amount',
              'field' : "₹" +  this.validatedillerRes.billlist[0].billamount,
            },
            {
              "label":  'Handling Fees',
              'field' : "₹" + this.totalHandlingCharge,
            },
            {
              "label":  'Bill Date',
              'field' : this.validatedillerRes.billlist[0].billdate
            },
            {
              "label":  'Bill Status',
              'field' : this.validatedillerRes.billlist[0].billstatus,
            },
          ]
        }
        
        console.log("this.billerdetailsDataPass ==>" + this.billerdetailsDataPass)
        this.DataService.billerdata = this.billerdetailsDataPass
         this.goToPage('existingBillPayment') ;
        }
        else if (resp.opstatus == "01") {
          let errorMsg = JSON.parse(resp.bbpsResponse)
              this.apiErrorMsg = errorMsg.msg
              this.commonMethod.openPopup('.errorMSg')
        }
        else {
          this.errorCallBack(data.subActionId, resp);
      }
    });

    
   
  }
  billHistoryDetails(item){
    this.DataService.billHistoryDetails = item
    this.router.navigateByUrl('/billDetails');

    console.log("billHistoryDetails>>>> " + JSON.stringify(item))
  }
  onSeachResultClick(value){
    console.log("value : " + JSON.stringify(value))
    this.DataService.searchProviderData =value.billerData
    this.DataService.billtype = value.billerData.biller_category
    this.DataService.billcategory = value.billerData.biller_category
    if(value.billerData.biller_category == "Mobile Prepaid"){
    this.goToPage('mobilePrepaid')
    }else{
      this.goToPage('retailBillPayment')
    }
  }
  onProviderSearch(value){


    if(value.length >= 3){
      let param = this.rechargeBillpayService.getServiceProviderName(value);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      var provderSearchs
        var resp = data.responseParameter;
        if (resp.opstatus == "00") {
          console.log(data.responseParameter);
          this.providerSearch = []
          this.providerSearch =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
             // provderSearchs = JSON.parse(provderSearchs)
             console.log (typeof this.providerSearch)
             console.log ("provderSearchs.length" + this.providerSearch.length)
             console.log("provderSearchs +"  + JSON.stringify(this.providerSearch[0]))
              // for( var i =0 ; i < provderSearchs.length ;i++) {
              //   this.providerSearch.push(provderSearchs[i]);
              // }
            console.log('this.providerSearch ===> ' +  JSON.stringify(this.providerSearch ))
           
          
         }
        else {
         
        }
      });
    }
    else{
      this.providerSearch = []
    }

  }

  errorCallBack(e , e3){

  }
  unpaidBillDetails(item){
 console.log("item>>>> " + JSON.stringify(item))

    this.DataService.unpaidbilldetail = item
    this.router.navigateByUrl('/unpaidBill');
  }

  
  
  onpenbillClick(item){
    console.log('itemitem' + JSON.stringify(item))
    let billerdetailsList = {
      billerName:item.moreDetails.biller_name,
      billerId:item.billerid,
      billamount: item.net_billamount,
      billerlogo: item.moreDetails.biller_logo,
      customerid: item.customerid,
      authenticators: item.authenticators,
      loopingData:[
        {
          'label': 'Bill Number',
          'field': item.billnumber
        },
        {
          'label': 'Customer Name',
          'field': item.billid
        },
      
      ]
    }

    this.DataService.billerdata = billerdetailsList
    this.router.navigateByUrl('/existingBillPayment');
  }
  ondeleteBillerclick(item){ 
    this.billdetails =  item
     this.commonMethod.openPopup('.confirmMsg')
    }
    onDeleteConfirmationclick(){
      this.getAllRegisteredBillers()
      this.commonMethod.closeAllPopup()
    }
  paySelection(payType){
    this.payTypeBox = payType
    // switch(payType){
    //   case 'instaPay' :
    //     this.payTypeBox = payType
    //     break ;

    //   case 'registerPay':
    //     this.payTypeBox = payType
    //     break;
    // }
  }
}
