import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe , Location} from '@angular/common';
import jspdf from 'jspdf';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import {MobilePrepaidServiceService} from '../mobile/mobile-prepaid/mobile-prepaid/mobile-prepaid-service.service'
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { CommonMethods } from '../../../../services/common-methods';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { BbpsService } from 'src/app/services/bbps.service';
declare var OSREC: any;
@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit , OnDestroy{

  constructor(private router: Router,
    public DataService: DataService,  
        private storage :LocalStorageService, 
           private http:HttpRestApiService,   
           private mobilePrepaidServiceService : MobilePrepaidServiceService,
            private bbpsService: BbpsService,  public loader: pageLoaderService,  
              private datepipe: DatePipe,
    public commonMethod: CommonMethods,
    public constant : AppConstants,
     private location :Location) { }
    billdetails:any
    renderableData:any
    newdata:any;
    validatePay:any
    receiptResp:any
    mobValErrorMsg:any
    billerCategory:any;
    totalAccountList: any = [];
    accountList:any = [];
    authValueArray:any = []
    autharray:any = []
    billerType:any
    logoUrl:any;
    ifMobileValidated:boolean = false;
    validatedillerRes:any;
    selectedBillerName:any
    showFetchBill:boolean = false
    paymentType:any;
    partialPay:any;
    lowAmt:any;
    cou_conv_fee:any;
    operatorDetails:any;
    bou_conv_fee:any
    totalHandlingCharge:any;
    moreAmt:any;
    repsonseMsg:any;
    billerdetailsDataPass:any =[]
    maxPayableAmt:any;
    minPayableAmt:any;
    paymentamount_validation:any
    selectedOptions={
      "operatorName" : '',
      "operatorId" : '',
      "circle" : '',
      "circleId" : '',
    }
    refTransJson =[{
      "key":'',
      "value":''
    }]
  ngOnInit(): void {
  
    this.DataService.isbbpsPage = true
    this.billdetails = this.DataService.billHistoryDetails 
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : 'retailPaymentHistory';
      history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
      history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.renderData()
    this.accountList = this.DataService.customerOperativeAccList.filter(
      (obj) =>(obj.accountType!='CAPPI')
    );
    console.log(" this.billdetails " +  JSON.stringify(this.billdetails) )
    console.log("DataService.breadcrumblist" + JSON.stringify(this.DataService.breadcrumblist))
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  errorCallBack(msg, resp) {
    this.repsonseMsg = msg
    this.commonMethod.openPopup('.billerrorMsg')
  }

renderData(){
  this.refTransJson[0].value = this.billdetails.source_ref_no;

  this.renderableData={
    "billertype" : this.billdetails.biller_type,
    'shortName' :  this.billdetails?.short_name,
    'logo' : this.billdetails.moreDetails.biller_logo,
    'billerName': this.billdetails.moreDetails.biller_name,
    'paidDate': this.billdetails.formatedTxnDate,
    'amt': this.billdetails.debit_amount,
    'billStatus' : this.billdetails.biller_status,
    'loopingData': [
      
      {
        'label':'Biller category',
        'field':this.billdetails.moreDetails.biller_category
      },
    {
      'label':'From  account',
      'field':this.billdetails.payment_account.account_number
    },

    {
      'label':'Bill status',
      'field':this.billdetails.biller_status
    },
    {
      'label':'Payment ID',
      'field':this.billdetails.paymentid
    },
    {
      'label':'Payment status',
      'field':this.billdetails.payment_status
    },
      
      
      {
      'label': "Payment remark",
      'field' : this.billdetails.payment_remarks
      },
      {
        'label': "Paid on",
        'field' : this.billdetails.formatedTxnDate
        },
      {
        'label': "Customer convenience fee",
        'field' :  "₹" +this.billdetails.cou_conv_fee
        },
      {
        'label': "Bou convenience fee",
        'field' :  "₹" +this.billdetails.bou_conv_fee
        }
    ]
   
   

  }
 

  if(this.billdetails.biller_status == "FAILED"){
    this.renderableData.loopingData.push(
      {
        'label': "Payment failure reason",
        'field': this.billdetails.biller_status_desc
      })

  }


  if(this.billdetails.moreDetails.isbillerbbps == "Y"){
    this.renderableData.loopingData.push(
    {
      'label': "BBPS reference number",
      'field': this.billdetails.bbps_ref_no
    })
  }else{
    this.renderableData.loopingData.push(
      {
        'label': "Source reference number",
        'field': this.billdetails.source_ref_no
      })
  }

 
    for(var i = 0 ; i < this.billdetails.authenticators.length; i++){
    this.renderableData.loopingData.push(  {
      
        'label':this.billdetails.authenticators[i].parameter_name,
        'field' : this.billdetails.authenticators[i].value,
    
    })
    
  
}
if (this.billdetails.biller_status == "SUCCESS" && this.billdetails.payment_status == "PAID") {
  if(this.billdetails.billlist[0]?.billnumber){
    this.renderableData.loopingData.push(
      {
        'label': "Bill number",
        'field': this.billdetails.billlist[0]?.billnumber,
      })
  }
}
}

  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
  goToPageCust(routeName){
    this.router.navigateByUrl(routeName);
  }
  raiseComplaint(){
  if( this.billdetails.moreDetails.isbillerbbps == "Y"){
    this.DataService.complaintbbpsrefNumber =  this.billdetails.bbps_ref_no
    this.DataService.isBillerBBPs = true
  }else{
    this.DataService.complaintbbpsrefNumber =  this.billdetails.paymentid
    this.DataService.isBillerBBPs = false
  }
    this.goToPage('retailRaiseComplaint')
  }
  shareDetails() {
    this.shareViaMail();
  }
  shareViaMail() {
    let details = this.getValuesToSend();
    window.open('mailto:?subject=Receipt&body=' + details);
  }
  getValuesToSend() {
    let selectedFields = "";
   
  
      selectedFields += "From Account :" + this.receiptResp?.from_acc + ", ";
      selectedFields += "To Account :" + this.receiptResp?.to_acc + ", ";
    selectedFields += "Payee Name :" + this.receiptResp?.payee_name + ", ";
    selectedFields += "Amount :"   +OSREC.CurrencyFormatter.format( this.receiptResp?.amount, { currency: 'INR', symbol: 'INR' });", ";
    //  OSREC.CurrencyFormatter.format( this.receiptResp.amount, { currency: 'INR', symbol: 'INR' });
    selectedFields += "Remark :" + this.receiptResp?.remarks + ", ";
    selectedFields += "Schedule Date :" + this.receiptResp?.date + ", ";

    return selectedFields.replace(/,\s*$/, "");
  }

  downloadPdfReceipt(type) {
    this.loader.showLoader();
    var pdfsize = 'a4';
    var doc = new jspdf();
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    this.totalAccountList = this.DataService.customerOperativeAccList;
    var selAccDtl = this.totalAccountList.filter(item => item.sbAccount == this.billdetails.payment_account.account_number);
    console.log("this.totalAccountList " + JSON.stringify(this.totalAccountList ))
    console.log("selAccDtl " + JSON.stringify(selAccDtl ))

      var imgColor = '';
      console.log("bbpstransfer")
      var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.DataService.primaryAccountDtl.accountNo);
      var bbpsJson = []; 
      var PaymentMessage=''
    
      if( this.billdetails.biller_status == 'SUCCESS'){
        PaymentMessage = "Payment made successfully"
         imgColor = 'success';
      }else if(this.billdetails.biller_status == 'PENDING'){
        PaymentMessage = "Payment is pending"
        imgColor = 'failed';
      }else{
        PaymentMessage = "Payment failed"
        imgColor = 'failed';
      }
      var renderObj = {
        "key" : "Biller name",
        "value" :this.renderableData.billerName
      }
      bbpsJson.push(renderObj)
      for(var i = 0 ; i < this.renderableData.loopingData.length; i ++){
        bbpsJson.push({
          "key" :  this.renderableData.loopingData[i].label,
          "value" : this.renderableData.loopingData[i].field
        })
     
      }
      bbpsJson.push({
        "key" :  'Amount',
        "value" : this.renderableData.amt
      },
      {
        "key" :  'Paid on',
        "value" : this.renderableData.paidDate
      },
      )
      

      // for(var i = 0 ;i< this.DataService.bbpsReceiptDetails.length;  i++){
      //   bbpsJson.push(  
      //     {
      //       'key' : this.DataService.bbpsReceiptDetails[i].label,
      //       'value' : this.DataService.bbpsReceiptDetails[i].field
      //     }
      //   )  
      // }

      var splitTitles = doc.splitTextToSize(" :"+ this.newdata == undefined || this.newdata == null  ? "" : this.newdata[0].BranchAddress, 30);
      doc.text(splitTitles, pageWidth - 150, 25, {align :'left'});
      var branchJSON = [
        { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
        { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
        { 'key': 'Ifsc Code', 'value': this.billdetails.payment_account.ifsc },

         
      ];
      this.loader.hideLoader();
      this.commonMethod.generatePDF(imgColor, PaymentMessage, "Successful", this.refTransJson, bbpsJson, 'BBPS', branchJSON, type, this.billdetails.payment_account.account_number, this.datepipe.transform(new Date(), 'ddMMyyyyhhmmss'));
 

  }

  onNumberInput(number){
    console.log(number)
    if(number.length == 10){
        var param = this.mobilePrepaidServiceService.getPrepaidOperator(number)
        this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
          console.log(data);
          var resp = data.responseParameter
          var bbpsresponse = JSON.parse(data.responseParameter.bbpsResponse)
          if (resp.opstatus == "00") {
            this.operatorDetails = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
             this.ifMobileValidated = true
            //   this.operatorDetails = JSON.parse(operatorData.responseParameter.result)
            console.log("DATA123" + JSON.stringify( this.operatorDetails));
            this.operatorDetails.mobileNumber = number
            this.selectedOptions.operatorId = this.operatorDetails.billerid
            this.selectedOptions.operatorName = this.operatorDetails.biller_name
            this.selectedOptions.circleId = this.operatorDetails.circleid
            this.selectedOptions.circle = this.operatorDetails.circle_name
            this.browsePlanSubmit()
          }
          else if(bbpsresponse.status =="404"){
            this.commonMethod.openPopup('.mob-postpaid-error')
            this.ifMobileValidated = false;
            this.mobValErrorMsg = 'MOB_VALID_ERROR'

          }else{
            this.ifMobileValidated = false;
            this.commonMethod.openPopup('.mob-postpaid-error')
            this.errorCallBack(data.subActionId , resp);
            this.mobValErrorMsg = 'ISSUE_FETCH_OPERATOR'
          }
        })
    }else{
      this.ifMobileValidated = false;
    }
  }

  browsePlanSubmit(){
    var authValueArray = [{
      // "seq": this.autharray[i].seq,
      "parameter_name": this.autharray[0].parameter_name,
      "value": this.autharray[0].value
    
      }]
    var  billerdetailsList = {
      billerName:this.selectedOptions.operatorName,
      billerId: this.selectedOptions.operatorId,
      customerid: this.DataService.customerID,
      authenticators:authValueArray,
      biller_type : this.billerType,
    }
    this.operatorDetails.billerid =  this.selectedOptions.operatorId 
    this.operatorDetails.biller_name = this.selectedOptions.operatorName 
    this.operatorDetails.circleid = this.selectedOptions.circleId 
    this.operatorDetails.circle_name = this.selectedOptions.circle
    this.operatorDetails.validateData = billerdetailsList
    this.operatorDetails.callPullDetails = this.billdetails.moreDetails
    this.DataService.mobilePrepaidDetails = this.operatorDetails
    console.log(" this.DataService.mobilePrepaidDetails" ,  this.DataService.mobilePrepaidDetails)
    
   this.goToPage('browsePlan')
 
  }



  billPaymentSubmit() {

    var billerdetailsList 
    this.authValueArray =[]
    this.billerType = this.billdetails.moreDetails.biller_type,
    this.paymentamount_validation = this.billdetails.moreDetails.paymentamount_validation
    this.autharray =  this.billdetails.authenticators
    this.validatePay = this.billdetails.moreDetails.online_validation
    this.partialPay =  this.billdetails.moreDetails.partial_pay
    this.billerCategory = this.billdetails.biller_category,
    this.selectedBillerName = this.billdetails.biller_name
    this.logoUrl = this.billdetails.moreDetails.biller_logo
    this.cou_conv_fee = this.billdetails.cou_conv_fee,
    this.bou_conv_fee = this.billdetails.bou_conv_fee,
    this.totalHandlingCharge =  (parseFloat(this.billdetails.cou_conv_fee) + parseFloat( this.billdetails.bou_conv_fee)).toFixed(2)





   for( var i = 0; i < this.billdetails.moreDetails.payment_channels.length ; i++ ){
        
    if(this.billdetails.moreDetails.payment_channels[i].payment_channel="InternetBanking" && this.constant.getPlatform() == "web"){
      this.maxPayableAmt = this.billdetails.moreDetails.payment_channels[i].max_limit
      this.minPayableAmt = this.billdetails.moreDetails.payment_channels[i].min_limit
    }else if(this.billdetails.moreDetails.payment_channels[i].payment_channel="MobileBanking" && this.constant.getPlatform() != "web"){
      this.maxPayableAmt = this.billdetails.moreDetails.payment_channels[i].max_limit
      this.minPayableAmt = this.billdetails.moreDetails.payment_channels[i].min_limit
    }

  }

  this.lowAmt =  parseFloat(this.billdetails.debit_amount) <  parseFloat(this.minPayableAmt)
  this.moreAmt =  parseFloat(this.billdetails.debit_amount) >  parseFloat(this.maxPayableAmt)


     for(var i =0 ; i < this.autharray.length ; i++){
        

        this.authValueArray.push({
              // "seq": this.autharray[i].seq,
              "parameter_name": this.autharray[i].parameter_name,
              "value": this.autharray[i].value
            
        })
      }
    // console.log("this.authValueArray :  " + JSON.stringify(this.authValueArray))
    // console.log("this.billPaymentForm.value.boardname," + this.billPaymentForm.value.boardname,)
    // console.log("selectedBillerName," + this.selectedBillerName,)
     billerdetailsList = {
      billerName:this.billdetails.biller_name,
      billerId: this.billdetails.billerid,
    //  billId: this.billPaymentForm.value.consumerNumber1,
      customerid: this.DataService.customerID,
      authenticators:this.autharray,
      biller_type : this.billerType
    }
   

    console.log("billerdetailsList :" + JSON.stringify(billerdetailsList))
  
    //  this.DataService.electricBillObj.billername = this.selectedBillerName
    //   this.DataService.electricBillObj.custID = this.billPaymentForm.value.consumerNumber
    //   this.DataService.electricBillObj.billerID = this.selectedBillerId
     

      if(this.billerType == "BILLER"){

          if( this.billdetails.moreDetails.online_validation == "Y"   ){
    
            this.validatePaymentDetails(billerdetailsList)
            this.paymentType ="instapay"
          
          }else if (this.validatePay == "N"  && this.paymentamount_validation  == "N"){
            this.paymentType ="biller"
            this.commonMethod.openPopup('.billerrorMsg')
            this.repsonseMsg = "Please register this biller, Bills can only be paid after registration"
            

            // this.getBillDetails(this.billPaymentForm.value.consumerNumber,this.billPaymentForm.value.boardname )
          }
      }
      else if(this.billerType == "PAYEE"){
       
        if(this.validatePay == "Y"){
          this.paymentType ="instapay"
          billerdetailsList.pay_amt = this.billdetails.debit_amount
          // alert( billerdetailsList.pay_amt)
          if( !this.lowAmt &&  !this.moreAmt){
            if(this.billerCategory != "Mobile Prepaid" ){
              this.validatePaymentDetails(billerdetailsList)
            }else{
              this.DataService.billcategory = this.billerCategory
              this.DataService.bbpsMobileNumber =this.autharray[0].value
              this.onNumberInput(this.autharray[0].value)
             
            }
          }
        }else{
          this.paymentType ="adhoc"
         
          this.billerdetailsDataPass = {
            'billerName' :this.billdetails.biller_name,
            'billamt': this.billdetails.payment_amount,
            'billCategory':this.billdetails.biller_category,
            'logourl' :this.billdetails.moreDetails.biller_logo,
            'billerId' :billerdetailsList.billerId,
            "billerType" : this.billerType,
            'consumerNo': '',
            'validationid' :"",
            'dueDate': "",
            'paymentType': this.paymentType,
            'cou_conv_fee' : this.billdetails.cou_conv_fee,
            'bou_conv_fee' : this.billdetails.bou_conv_fee,
            'authenticator': this.authValueArray,
            "totalHandlingFee": (parseFloat(this.billdetails.cou_conv_fee) + parseFloat( this.billdetails.bou_conv_fee)).toFixed(2),
            "maxpayableAmt" : this.maxPayableAmt,
            "minpayableAmt" : this.minPayableAmt,
            "partialPay" : this.partialPay,
            'displayData':[
             
             
              {
                "label":  'Amount',
                'field' : "₹" +  this.billdetails.payment_amount,
              },
            
              
            
            ]
           
          }
          for(var i = 0; i < this.authValueArray.length; i++){
            this.billerdetailsDataPass.displayData.push(
              {
                "label":  this.authValueArray[i].parameter_name,
                'field' : this.authValueArray[i].value
              }
            )
          }
          console.log("this.billerdetailsDataPass : " + JSON.stringify(this.billerdetailsDataPass))
          this.DataService.billerdata = this.billerdetailsDataPass;
          if( !this.lowAmt &&  !this.moreAmt){
          this.goToPage('existingBillPayment') ;
          }
          // this.getBillDetails(this.billPaymentForm.value.consumerNumber,this.billPaymentForm.value.boardname )
        }
    }
    else if(this.billerType == "BOTH"){
     
      if(this.validatePay == "Y" && this.paymentamount_validation == "N"){
        this.paymentType ="instapay"
       
        this.validatePaymentDetails(billerdetailsList)
      }else if(this.validatePay == "N" && this.paymentamount_validation == "N"){
        // this.getBillDetails(this.billPaymentForm.value.consumerNumber,this.billPaymentForm.value.boardname )
        this.paymentType ="adhoc"
       
        this.billerdetailsDataPass = {
          'billerName' :this.selectedBillerName,
          'billamt': this.billdetails.payment_amount,
          'billCategory':this.billerCategory,
          'logourl' :this.logoUrl,
          'billerId' :billerdetailsList.billerId,
          'consumerNo': billerdetailsList[0].authenticators.value,
          'validationid' :"",
          'dueDate': "",
          'paymentType': this.paymentType,
          "billerType" : this.billerType,
          'cou_conv_fee' : this.cou_conv_fee,
          'bou_conv_fee' : this.bou_conv_fee,
          "totalHandlingFee": this.totalHandlingCharge,
          "maxpayableAmt" : this.maxPayableAmt,
          "minpayableAmt" : this.minPayableAmt,
          "partialPay" : this.partialPay,
          'displayData':[
           
           
            {
              "label":  'Amount',
              'field' : "₹" + this.billdetails.payment_amount
            },
          
            
          
          ]
         
        }
        for(var i = 0; i < this.authValueArray.length; i++){
          this.billerdetailsDataPass.displayData.push(
            {
              "label":  this.authValueArray[i].parameter_name,
              'field' : this.authValueArray[i].value
            }
          )
        }
        this.DataService.billerdata = this.billerdetailsDataPass;
        this.goToPage('existingBillPayment') ;
      }
  }
      // this.goToPage('existingGetBill') ;
  
  }

    /////////////////////////// Validate Payment  //////////////////////

    validatePaymentDetails(data){
      var billamt
     var param = this.bbpsService.ValidatePaymentParam(data );
     this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
       console.log(data);
       var resp = data.responseParameter
       console.log("ValidatePaymentService ===> " + JSON.stringify(resp))
       if (resp.opstatus == "00") {
         this.validatedillerRes = JSON.parse(resp.bbpsResponse).responseParameter.result
      //   this.validatedillerRes =  JSON.parse(this.validatedillerRes )
         console.log("this.validatedillerRes ===> " +  JSON.stringify(this.validatedillerRes))
         console.log(typeof this.validatedillerRes)
         
 
         if(this.paymentamount_validation == "Y"){
           this.billerdetailsDataPass = {
             'billerName' :this.validatedillerRes.biller_name,
             'billamt':  (parseFloat(this.validatedillerRes.payment_amount) + parseFloat(this.totalHandlingCharge) ).toFixed(2),
             'billCategory': this.validatedillerRes.biller_category,
             'logourl' :this.logoUrl,
             'billerId' :this.validatedillerRes.billerid,
             'consumerNo': this.validatedillerRes.authenticators[0].value,
             'validationid' :this.validatedillerRes.validationid,
             'paymentType': this.paymentType,
             "billerType" : this.billerType,
             'cou_conv_fee' : this.cou_conv_fee,
             'bou_conv_fee' : this.bou_conv_fee,
             "totalHandlingFee": this.totalHandlingCharge,
             "partialPay" : this.partialPay,
             "maxpayableAmt" : this.maxPayableAmt,
             "minpayableAmt" : this.minPayableAmt,
             'displayData':[
               {
                 "label":  'Biller Name',
                 'field' : this.validatedillerRes.biller_name
               },
               {
                 "label":  this.validatedillerRes.authenticators[0].parameter_name,
                 'field' :  this.validatedillerRes.authenticators[0].value,
               },
               {
                 "label":  ' Amount',
                 'field' : "₹" +  this.validatedillerRes.payment_amount
               },
               {
                 "label":  'Handling Fees',
                 'field' : "₹" + this.totalHandlingCharge,
               },
               {
                 "label":  'valid until',
                 'field' : this.validatedillerRes.valid_until,
               },
             ]
           }
           
         }else{
          console.log("this.logoUrl : " + this.logoUrl)
          if(this.validatedillerRes.hasOwnProperty('billlist')){
          this.billerdetailsDataPass = {
            'billerName' :this.validatedillerRes.biller_name,
            'billamt':(parseFloat(this.validatedillerRes.billlist[0].billamount) + parseFloat(this.totalHandlingCharge) ).toFixed(2),
            'billCategory': this.validatedillerRes.biller_category,
            'logourl' :this.logoUrl,
            'billerId' :this.validatedillerRes.billerid,
            'consumerNo': this.validatedillerRes.authenticators[0].value,
            'validationid' :this.validatedillerRes.validationid,
            'dueDate': this.validatedillerRes.billlist[0].billduedate,
            'paymentType': this.paymentType,
            "billerType" : this.billerType,
            'cou_conv_fee' : this.cou_conv_fee,
            'bou_conv_fee' : this.bou_conv_fee,
            "totalHandlingFee": this.totalHandlingCharge,
            "partialPay" : this.partialPay,
            "maxpayableAmt" : this.maxPayableAmt,
              "minpayableAmt" : this.minPayableAmt,
             // "formatedDuedate" :this.datepipe.transform(finaldue, 'dd MMM yyyy'),
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
                "label":  'Bill Status',
                'field' : this.validatedillerRes.billlist[0].billstatus,
              },
            ]
          }
          if(this.validatedillerRes.billlist[0].billdate){
            var billdate = this.validatedillerRes.billlist[0].billdate?.split("-")
            var formatedbilldate =  billdate[1] +'/'+ billdate[0]+ '/' + billdate[2]
            var finalbilldate =new Date(formatedbilldate)
            this.billerdetailsDataPass.displayData.push(
            {
              "label":  'Bill Date',
              'field' : this.datepipe.transform(finalbilldate, 'dd MMM yyyy'),
            })
          }
          if(this.validatedillerRes.billlist[0].billduedate){
          
            var duedate =  this.validatedillerRes.billlist[0].billduedate?.split("-");
            var formatedDuedate =  duedate[1] +'/'+ duedate[0]+ '/' + duedate[2]
            var finaldue = new Date(formatedDuedate)
            this.billerdetailsDataPass.formatedDuedate = this.datepipe.transform(finaldue, 'dd MMM yyyy')
          }
          this.showFetchBill = true ;
        }else{
         
  
          this.billerdetailsDataPass = {
            'billerName' :this.selectedBillerName,
            'billamt': "1.00",
            'billCategory':this.billerCategory,
            'logourl' :this.logoUrl,
            'billerId' :this.validatedillerRes.billerid,
            'consumerNo': "NA",
            'validationid' :this.validatedillerRes.validationid,
            'dueDate': "",
            'paymentType': this.paymentType,
            "billerType" : this.billerType,
            'cou_conv_fee' : this.cou_conv_fee,
            'bou_conv_fee' : this.bou_conv_fee,
            "totalHandlingFee": this.totalHandlingCharge,
            "maxpayableAmt" : this.maxPayableAmt,
            "minpayableAmt" : this.minPayableAmt,
            "partialPay" : this.partialPay,
            'displayData':[]
           
          }
          for(var i = 0; i < this.authValueArray.length; i++){
            this.billerdetailsDataPass.displayData.push(
              {
                "label":  this.authValueArray[i].parameter_name,
                'field' : this.authValueArray[i].value
              }
            )
          }
          }
          
        }
        
       
         this.showFetchBill = true ;
         console.log("this.billerdetailsDataPass ==>" + this.billerdetailsDataPass)
         this.DataService.billerdata = this.billerdetailsDataPass
         this.goToPage('existingBillPayment');
         
         }else if(resp.opstatus == "01"){
           var msg = ''
          if(JSON.parse(resp.bbpsResponse).responseCode == "422"){
           msg = JSON.parse(resp.bbpsResponse).msg
           }else{
           msg = "Due to downtime we are unable to validate your details. ResponseCode:(" + JSON.parse(resp.bbpsResponse).responseCode + ")"
           }
           this.repsonseMsg = msg
           this.commonMethod.openPopup('.billerrorMsg')
          

 
         }
         else {
           var msg ="Due to downtime unable to Validate your details"
           this.errorCallBack(msg, resp);
         
             this.authValueArray =[];
             this.autharray=[]
   
       }
     })
   }
}