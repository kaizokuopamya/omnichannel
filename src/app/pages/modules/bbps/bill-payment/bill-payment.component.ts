import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { BbpsService } from 'src/app/services/bbps.service';
import { CommonMethods } from '../../../../services/common-methods';
import { BillPaymnetService } from './bill-paymnet.service';
import { CustomCurrencyPipe } from '../../../../pipes/custom-currency.pipe';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe , Location} from '@angular/common';
import { FormValidationService } from '../../../../services/form-validation.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {RechargeBillpayService} from '../recharge-billpay/recharge-billpay.service';

declare var $: any;

@Component({
  selector: 'app-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.scss']
})
export class BillPaymentComponent implements OnInit , OnDestroy {
 

  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,
    public billPaymnetService: BillPaymnetService,
    private http:HttpRestApiService,
    public constant:AppConstants,
    private customCurrencyPipe: CustomCurrencyPipe,
    private storage :LocalStorageService,
    private formValidation: FormValidationService,
    private bbpsService: BbpsService,
    private datepipe: DatePipe,
    private location: Location,
    private rechargeBillpayService: RechargeBillpayService,
    private httpp: HttpClient,) { }
    
    billPaymentForm : FormGroup
    MobileRechargeForm : FormGroup
    paymentTypeForm : FormGroup


    boardNameToggle : boolean = false
    hideList:boolean =true;
    showFetchBill: boolean = false;
    isFluctuating:boolean = false


    staticAmt= []
    stateList = [];
    autharray:any = [];
    authValueArray:any =[]
    recentTranceList:any =[]
    billerList=[]
    finalBillerList:any =[];
    filteredBillerList:any =[];
    authenticators:any =[]
    unpaidBillList:any =[]


    ccNumber:any;
    validatePay:any;
    billerCategory:any
    minPayableAmt:any
    maxPayableAmt:any
    partialPay:any
    selectdBillerIsBbps:any
    inputAmt:any;
    boardNameValue : any = ''
    selectedBillerName:any;
    selectedBillerId:any;
    repsonseMsg:any;
    boardNameValueChildParent : any  = ''
    billpayType = this.DataService.billtype;
    billerType:any;
    selectedBoard:any
    billdetails:any;
    logoUrl:any;
    billSampleURL;
    billerdetailsList:any;
    billerdetailsDataPass:any;
    validatedillerRes;
    billerNote:any;
    cou_conv_fee:any = "0.00";
    bou_conv_fee:any ="0.00";
    totalHandlingCharge:any
    paymentType:any;
    paymentamount_validation:any;
    serviceAlertList:any = []
    lowAmt:any
    moreAmt:any


    ngOnInit(): void {
      this.buildForm();
      // alert("oninit")
      if(this.constant.getPlatform() == 'web'){
        // alert("inside if")
         this.getAllBillerlist()
      }
    
      this.getAllServiceAlert();
      this.filterRecenTranceAndPendingBills()
      this.staticAmt  = ["200", "500" ,"1000"]
      this.DataService.isbbpsPage = true
     // console.log("DataService.finalRecentTransList: " + JSON.stringify(this.DataService.finalRecentTransList))
      if(this.DataService.isComingFromReminderPayNow ){
        this.payNowFromReminder(this.DataService.payNowReminderData)
      }
      if(this.DataService.searchProviderData){
        this.boardTypeSelection(this.DataService.searchProviderData)
      }
      
    }

    ngOnDestroy() {
      this.DataService.isbbpsPage = false
     
      this.DataService.isComingFromReminderPayNow = false;
    }
  // ################### COMMON FUNCTIONS STARTS ############################### COMMON FUNCTIONS STARTS ################################################ COMMON FUNCTIONS STARTS #####################3
    
  goToPage(routeName) {
      this.router.navigateByUrl('/' + routeName);
    }
    filterRecenTranceAndPendingBills(){
    //  console.log("DDDD" + JSON.stringify(this.DataService.finalRecentTransList))
      for(var i =0 ; i <  this.DataService.finalRecentTransList?.length ; i++){
      if(this.DataService.finalRecentTransList[i]?.biller_category == this.DataService.billcategory)
      this.recentTranceList.push(this.DataService.finalRecentTransList[i])
      }
      for(var i = 0 ; i < this.DataService.allUnpaidBillerList?.length; i++ ){
      //console.log("DDDD" + JSON.stringify(this.DataService.allUnpaidBillerList))
      if(this.DataService.allUnpaidBillerList[i]?.moreDetails.biller_category == this.DataService.billcategory){
        this.unpaidBillList.push(this.DataService.allUnpaidBillerList[i])
      }
      }
    }
    paybill(item){
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
              // alert()
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
  
      this.DataService.isbillerbbps = item.isbillerbbps;

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
        "billerType" : this.billerType,
        'cou_conv_fee' : this.cou_conv_fee,
        'bou_conv_fee' : this.bou_conv_fee,
        'auth': item.billlist[0].authenticators,
        'partialPay' : item.moreDetails.partial_pay,
  
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
      console.log("itemitemitemitem" + JSON.stringify(this.billerdetailsDataPass))  
     
      this.goToPage('existingBillPayment') ;
      
    }
    buildForm() {
      this.billPaymentForm = new FormGroup({
        dummy: new FormControl(''),
        amt : new FormControl(''),
        boardname: new FormControl('', [Validators.required]),
   
      })   
      this.paymentTypeForm = new FormGroup({
        paymentMode: new FormControl('', [Validators.required]),
      })

      
    }
  
    validateForm(){
      if(this.billPaymentForm.invalid){
        // this.billPaymentForm.get('state').markAsTouched();
        this.billPaymentForm.get('boardname').markAsTouched();
        this.billPaymentForm.get('amt').markAsTouched();

        for(let i =0; i < this.autharray.length ; i++){
          this.billPaymentForm.get('consumerNumber'+ (i +1 )).markAsTouched();
        }
        return
      }
    }


    payNowFromReminder(value){
    this.billPaymentForm.get('boardname').setValue(value.billerName);
    this.billPaymentForm.controls['boardname'].updateValueAndValidity()
    this.getbillersLogoDetials(value)

    }

    getbillersLogoDetials(value){
      console.log("valuevalue" + JSON.stringify(value))

      let billerListparam = this.rechargeBillpayService.getLogoDetials(value.consumerDetails.billerId);
      this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES,{showErrorPopup:false}).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      console.log( "resp" ,  data.responseParameter);
      if (resp.opstatus == "00") {
        console.log( "resp" ,  data.responseParameter);
      var  billdetails = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList[0]
      var  billinfo = JSON.parse(billdetails.billerData)
      console.log("billdetails" + JSON.stringify(billinfo))
      this.boardTypeSelection(billinfo)

      for(var i=0 ; i<  value.consumerDetails.authArray.length; i ++){
        this.billPaymentForm.get('consumerNumber' + (i + 1)).setValue( value.consumerDetails.authArray[i].value);
        this.billPaymentForm.controls['consumerNumber' + (i + 1)].updateValueAndValidity()
      }
      this.billPaymentForm.get('amt').setValue( value.amount);
        this.billPaymentForm.controls['amt'].updateValueAndValidity()
      }
    })
    }


    getAllBillerlist(){
      this.finalBillerList = []
      let billerParamList = this.bbpsService.getbillerListforCategory(this.DataService.billcategory);
      //alert("getAllBillerlist1")
      this.http.callBankingAPIService(billerParamList, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
       // alert("getAllBillerlist")
        var resp = data.responseParameter;
      //  console.log("mahi " + JSON.parse(data.responseParameter));
        if (resp.opstatus == "00") {
          console.log("mahi " + JSON.parse(data.responseParameter.bbpsResponse));
          console.log(data.responseParameter);
       
            var billerList =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
             console.log("BillerList ss: " + JSON.stringify( billerList))
             for(var i= 0; i < billerList.length; i++){
              this.finalBillerList.push(JSON.parse(billerList[i].billerData))

             }
            
             this.filteredBillerList = this.finalBillerList
        }
        else {
          var msg ="Due to downtime Unable to retrieve Billers" 
          this.errorCallBack(msg, resp);
        }
      });


    }
     validatepaymentForm(){
      if(this.paymentTypeForm.invalid){
        this.paymentTypeForm.get('paymentMode').markAsTouched();
      }
     }
  
    billPaymentSubmit() {
     
      var billerdetailsList 
      this.authValueArray =[]
      var formvalue = this.billPaymentForm.value
      // this.authenticators[0].parameter_name = this.consumerLabel;
      // this.authenticators[0].value = this.billPaymentForm.value.consumerNumber;
     
       for(var i =0 ; i < this.autharray.length ; i++){
          

          this.authValueArray.push({
                // "seq": this.autharray[i].seq,
                "parameter_name": this.autharray[i].parameter_name,
                "value": formvalue["consumerNumber" + (i + 1)],
                "encryption_required": this.autharray[i]?.encryption_required ? this.autharray[i].encryption_required : "N",
              
          })
        }
      console.log("this.authValueArray :  " + JSON.stringify(this.authValueArray))
      console.log("this.billPaymentForm.value.boardname," + this.billPaymentForm.value.boardname,)
      console.log("selectedBillerName," + this.selectedBillerName,)
       billerdetailsList = {
        billerName:this.selectedBillerName,
        billerId: this.selectedBillerId,
        billId: this.billPaymentForm.value.consumerNumber1,
        customerid: this.DataService.customerID,
        authenticators:this.authValueArray,
        biller_type : this.billerType,
      }
     

      console.log("billerdetailsList :" + JSON.stringify(billerdetailsList))
      if(this.billPaymentForm.valid){
       this.DataService.electricBillObj.billername = this.selectedBillerName
        this.DataService.electricBillObj.custID = this.billPaymentForm.value.consumerNumber
        this.DataService.electricBillObj.billerID = this.selectedBillerId
       
  
        if(this.billerType == "BILLER"){

            if(this.validatePay == "Y"   ){
      
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
            billerdetailsList.pay_amt = this.billPaymentForm.value.amt.trim().replace(/[^.0-9]+/g, '')  
            // alert( billerdetailsList.pay_amt)
            if( !this.lowAmt &&  !this.moreAmt){
            this.validatePaymentDetails(billerdetailsList)
            }
          }else{
            this.paymentType ="adhoc"
           
            this.billerdetailsDataPass = {
              'billerName' :this.selectedBillerName,
              'billamt': this.billPaymentForm.value.amt.trim().replace(/[^.0-9]+/g, ''),
              'billCategory':this.billerCategory,
              'logourl' :this.logoUrl,
              'billerId' :billerdetailsList.billerId,
              "billerType" : this.billerType,
              'consumerNo': '',
              'validationid' :"",
              'dueDate': "",
              'paymentType': this.paymentType,
              'cou_conv_fee' : this.cou_conv_fee,
              'bou_conv_fee' : this.bou_conv_fee,
              'authenticator': this.authValueArray,
              "totalHandlingFee": this.totalHandlingCharge,
              "maxpayableAmt" : this.maxPayableAmt,
              "minpayableAmt" : this.minPayableAmt,
              "partialPay" : this.partialPay,
              'displayData':[
               
               
                {
                  "label":  'Amount',
                  'field' : "₹" +  this.billPaymentForm.value.amt.trim().replace(/[^.0-9]+/g, '')
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
            'billamt': this.billPaymentForm.value.amt.trim().replace(/[^.0-9]+/g, ''),
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
                'field' : "₹" +  this.billPaymentForm.value.amt.trim().replace(/[^.0-9]+/g, '')
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
      } else{ 
        this.validateForm() ;
      }
    }

    onSelectOption(item){
      this.boardNameToggle = !this.boardNameToggle
      //  $('#board-name').slideUp();
        $('#board-name').parent().removeClass('active')
        this.hideList = true
        this.boardTypeSelection(item)
     //   this.filteredBillerList = this.finalBillerList

    }
    billHistoryDetails(item){
      this.DataService.billHistoryDetails = item
      this.router.navigateByUrl('/billDetails');
  
      console.log("billHistoryDetails>>>> " + JSON.stringify(item))
    }

    //////////////////On biller Board Select ///////////////////////////////////////////

    boardTypeSelection(item){
      for(var i=0; i <   this.autharray.length; i++){
        this.billPaymentForm.removeControl("consumerNumber" + (i + 1));
      }
      console.log("item" , item)
      this.DataService.SelectedBiller = item
      this.billPaymentForm.get('boardname').setValue(item.biller_name);
      this.authValueArray =[]
      this.logoUrl = item.biller_logo;
      this.billSampleURL = item.biller_bill_copy;
      this.billerCategory = item.biller_category 
      this.selectdBillerIsBbps = item.isbillerbbps
      this.billerNote =  item.biller_remarks
      this.paymentamount_validation = item.paymentamount_validation 
      this.partialPay = item.partial_pay;
      this.validatePay =item.online_validation;
      this.billerType = item.biller_type   
      this.DataService.isbillerbbps = item.isbillerbbps
      this.DataService.isbbpsBiller = item.isbillerbbps;
      this.selectedBoard = item ;
      this.selectedBillerName = item.biller_name;
      this.selectedBillerId = item.billerid;
    
      if(item.authenticators.map((object:any) => object.optional).indexOf("N") == -1){
        this.autharray.push(item.authenticators[0]) 
     
      }else{
        this.autharray = item.authenticators;
      }
      for(var i=0; i <   this.autharray.length; i++){
        var validation = []
        if(this.autharray[i].optional =="N"){
          validation.push(Validators.required)
        }
        validation.push(Validators.pattern(this.autharray[i].regex))
        this.billPaymentForm.addControl("consumerNumber" + (i + 1), new FormControl('',  validation));
      }

        for(var i=0; i <   this.autharray.length; i++){
          if(this.autharray[i].data_type == "Numeric"){
            this.autharray[i].inputType= "number";
          }else{
            this.autharray[i].inputType= "text";
          }
         
          if(this.autharray[i].error_message.includes("digits") || this.autharray[i].error_message.includes("digit")){
            if(this.autharray[i].error_message.match(/([\d.]+) *digit/)){
            this.autharray[i].paramLength = JSON.parse(this.autharray[i].error_message.match(/([\d.]+) *digit/)[1])
            }else{
              this.autharray[i].paramLength = 20
            }
          }else if(this.autharray[i].parameter_name.includes("Mobile") || this.autharray[i].parameter_name.includes("mobile") ){
            this.autharray[i].paramLength = 10
          }
          else{
            this.autharray[i].paramLength = 20
          }
        
          if((this.autharray[i].error_message.includes("Card Number") || this.autharray[i].error_message.includes("card number")) && this.autharray[i].paramLength > 10  ){
            this.autharray[i].fieldType = "CC"
          }else{
            this.autharray[i].fieldType = "NONE"
          }

        }
        console.log("autharray" + JSON.stringify(this.autharray))
      
        if( this.billerType == 'PAYEE'){
          this.billPaymentForm.get('amt').setValidators([Validators.required]);
          this.billPaymentForm.get('amt').updateValueAndValidity();  
        }else{
          this.billPaymentForm.get('amt').clearValidators();
          this.billPaymentForm.get('amt').updateValueAndValidity(); 
        }


         //////////////// Handling fee ////////////////////////

      if(item.customer_conv_fee?.length > 0 ){
        item.customer_conv_fee.forEach(el => {
          if (el.payment_channel == "InternetBanking" || el.payment_channel == "MobileBanking") {


              if(el.cou_conv_fee ){
                  this.cou_conv_fee = el?.cou_conv_fee
              }else{
                this.cou_conv_fee = "0.00"
              }


              if(el.bou_conv_fee){
                this.bou_conv_fee = el?.bou_conv_fee
              }else{
                this.bou_conv_fee ="0.00"
              }


            console.log("this.cou_conv_fee" + this.cou_conv_fee)
            console.log("this.bou_conv_fee" + this.bou_conv_fee)
            
          }
        })
        console.log("outside" + this.cou_conv_fee)
        
      }else{
        this.cou_conv_fee = "0.00"
        this.bou_conv_fee = "0.00"
      }
      this.totalHandlingCharge = (parseFloat(this.cou_conv_fee) + parseFloat( this.bou_conv_fee)).toFixed(2)
      console.log(" this.totalHandlingCharge  " +  this.totalHandlingCharge)


      //////////////// Amount Linmit ////////////////////////

      for( var i = 0; i < item.payment_channels.length ; i++ ){
        
        if(item.payment_channels[i].payment_channel="InternetBanking" && this.constant.getPlatform() == "web"){
          this.maxPayableAmt = item.payment_channels[i].max_limit
          this.minPayableAmt = item.payment_channels[i].min_limit
        }else if(item.payment_channels[i].payment_channel="MobileBanking" && this.constant.getPlatform() != "web"){
          this.maxPayableAmt = item.payment_channels[i].max_limit
          this.minPayableAmt = item.payment_channels[i].min_limit
        }

      }
      
          //////////////// service fluctuation ////////////////////////

      for(var i = 0; i< this.serviceAlertList.length; i++){
      if(this.selectedBoard.billerid == this.serviceAlertList[i].billerId && this.serviceAlertList[i].billerState == "FLUCTUATING"){
        this.isFluctuating = true;
        break;
      }else{
        this.isFluctuating = false;
      }
    }
    // this.currency  = item.
    }


  

  // clickedOut($event){
  //   $('#board-name').slideUp();
  //   $('#board-name').parent().removeClass('active')
  // }




 ////////////////////////////get stateData //////////////////////////////////
  getState() {
   
    let stateListParams = this.bbpsService.getLocationList(this.DataService.billcategory);
    this.http.callBankingAPIService(stateListParams, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
     
          this.stateList =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerLocationList
          console.log('State List: ', this.stateList);
          // if(this.stateList.length == 1 && this.stateList[0] == "National"){
          //   this.onStateSelect(this.stateList[0])
          //    this.billPaymentForm.get('state').clearValidators();
          //    this.billPaymentForm.get('state').updateValueAndValidity();  
          // }
      }
      else {
        var msg = "Due to downtime unable to retrieve states"
        this.errorCallBack(msg, resp);
      }
    });
  }


  ////////////////////////////get billerData //////////////////////////////////

  onStateSelect(value){
   
    this.autharray =[]
   
    console.log("selected state ===> " + value);
    // console.log( "response SANAL === >" +  this.httpBbpsApiCall(value))
    var param = this.bbpsService.getbillerlist(value , this.DataService.billcategory)
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.finalBillerList=[]
        console.log(data.responseParameter);
       
          this.boardNameValue =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
          console.log('billerList: ', this.boardNameValue);

       
      }
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
       
         this.boardNameValue = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
          console.log('billerList: ' + JSON.stringify( this.boardNameValue));
          console.log('billerListlength: ' + this.boardNameValue[0].billerData);
          for(var i =0 ; i < this.boardNameValue.length ; i++){
             this.finalBillerList.push(JSON.parse(this.boardNameValue[i].billerData))

          }
         
          console.log('this.finalBillerList: ' + JSON.stringify(this.finalBillerList));
          
       
      }
      else {
        var msg = JSON.parse(resp.bbpsResponse).msg + " ResponseCode:(" + JSON.parse(resp.bbpsResponse).responseCode + ")"
        this.errorCallBack(msg, resp);
      }
    });
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
       
        if(this.validatedillerRes.hasOwnProperty('billlist')){
          var paymentAmmount =''
          var currentDate =    new Date()
          if(this.validatedillerRes.billlist[0].hasOwnProperty('early_billduedate')){
          
            var earlyDate =  this.validatedillerRes.billlist[0].early_billduedate.split("-");
            var formatedearlydate = earlyDate[1] +'/'+ earlyDate[0]+ '/' + earlyDate[2]
            //var formatedearlydate =
          //  06/16/2023
            console.log("formatedearlydate ==>" + formatedearlydate)
            var earlyfinaldue = new Date(formatedearlydate)
            var earlydate = earlyfinaldue.getTime() - currentDate.getTime()
              earlydate =  earlydate / (1000 * 3600 * 24);
              console.log("earlydate ==========> " , earlydate)
              if(earlydate < 0){
                if(this.validatedillerRes.billlist[0].hasOwnProperty('late_payment_charges')){
                  var dueDate =  this.validatedillerRes.billlist[0].billduedate.split("-");
                  var formatedDue = dueDate[1] +'/'+ dueDate[0]+ '/' + dueDate[2]
                  //var formatedearlydate =
                //  06/16/2023
                  console.log("formatedLateDate ==>" + formatedDue)
                  var finaldue = new Date(formatedDue)
                 
                  
                      var finalduedate =  finaldue.getTime() - currentDate.getTime() 
                      finalduedate =  finalduedate / (1000 * 3600 * 24);
                    console.log("finalduedate ==========> " , finalduedate)
                    if(finalduedate > 0){
                      paymentAmmount = this.validatedillerRes.billlist[0].billamount
                    }else{
                      paymentAmmount = this.validatedillerRes.billlist[0].late_payment_amount
                    }
                 
                  }
              }else{
                paymentAmmount = this.validatedillerRes.billlist[0].early_billamount
              }
          }else{
            paymentAmmount = this.validatedillerRes.billlist[0].billamount
          }
         
          
          //  alert(paymentAmmount)

          this.billerdetailsDataPass = {
          'billerName' :this.validatedillerRes.biller_name,
          'billamt':(parseFloat(paymentAmmount) + parseFloat(this.totalHandlingCharge) ).toFixed(2),
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
          if(this.validatedillerRes.billlist[0].hasOwnProperty('early_billduedate')){
          var earlybilldate = this.validatedillerRes.billlist[0].early_billduedate?.split("-")
          var earlyformatedbilldate =  earlybilldate[1] +'/'+ earlybilldate[0]+ '/' + earlybilldate[2]
          var earlyfinalbilldate =new Date(earlyformatedbilldate)
          this.billerdetailsDataPass.displayData.push(
            {
              "label":  'Early Payment Bill Date',
              'field' : this.datepipe.transform(earlyfinalbilldate, 'dd MMM yyyy'),
            },{
              "label":  'Early Payment Discount',
              'field' :"₹" + this.validatedillerRes.billlist[0].early_billdiscount,
            },
            {
              "label":  'Early Payment Amount',
              'field' : "₹" + this.validatedillerRes.billlist[0].early_billamount,
            }
            )
          }
          if(this.validatedillerRes.billlist[0].hasOwnProperty('late_payment_charges')){
         
            this.billerdetailsDataPass.displayData.push(
            {
                "label":  'Late Payment Charges',
                'field' :"₹" + this.validatedillerRes.billlist[0].late_payment_charges,
              },
              {
                "label":  'Late Payment Amount',
                'field' : "₹" + this.validatedillerRes.billlist[0].late_payment_amount,
              }
              )
            }
        
          this.showFetchBill = true ;
        }else{
        this.billerdetailsDataPass = {
          'billerName' :this.selectedBillerName,
          'billamt': "1.00",
          'billCategory':this.billerCategory,
          'logourl' :this.logoUrl,
          'billerId' :this.selectedBillerId,
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
        this.existingGetBillSubmit()
        }
       
      }
      
      this.showFetchBill = true ;
        console.log("this.billerdetailsDataPass ==>" + this.billerdetailsDataPass)
        
        }
       
        else if(resp.opstatus == "01"){
          var msg = ''
         if(JSON.parse(resp.bbpsResponse).responseCode == "422"){
          msg = JSON.parse(resp.bbpsResponse).msg
          }else{
          msg = "Due to downtime we are unable to validate your details. ResponseCode:(" + JSON.parse(resp.bbpsResponse).responseCode + ")"
          }
          this.repsonseMsg = msg
          this.commonMethod.openPopup('.billerrorMsg')
         
          
            this.billPaymentForm.reset()      
            this.authValueArray =[];
            this.autharray=[]
            this.logoUrl = '';
            this.billSampleURL = '';
            this.billerCategory ='';
            this.billerType =""
            this.selectdBillerIsBbps ='';
            this.inputAmt ='';
            this.billerNote = ''
            this.paymentamount_validation = ''

        }
        else {
          var msg ="Due to downtime unable to Validate your details"
          this.errorCallBack(msg, resp);
            this.billPaymentForm.reset()      
            this.authValueArray =[];
            this.autharray=[]
            this.logoUrl = '';
            this.billSampleURL = '';
            this.billerCategory ='';
            this.billerType =""
            this.selectdBillerIsBbps ='';
            this.inputAmt ='';
            this.billerNote = ''
            this.paymentamount_validation = ''
      }
    })
  }

  errorCallBack(msg, resp) {
    this.repsonseMsg = msg
    this.commonMethod.openPopup('.billerrorMsg')
  }


  existingGetBillSubmit() {
    // if(this.showAmountField){
    //   if(this.billPaymentForm.valid){
    //     this.billerdetailsDataPass.billamt = this.billPaymentForm.value.amt.trim().replace(/[^.0-9]+/g, '')
    //   }
    // }
  
    console.log("this.billerdetailsDataPassSANAL" + JSON.stringify(this.billerdetailsDataPass))
    this.DataService.billerdata = this.billerdetailsDataPass
      this.goToPage('existingBillPayment') ;
    
  }

  getBillDetails(consumerNum , billerId) {
    let stateListParams = this.billPaymnetService.getBillDetails(consumerNum , billerId, this.constant.serviceName_RetrieveBillService2);
    this.http.callBankingAPIService(stateListParams, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
      // console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
     
          this.billdetails =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
          this.billdetails = JSON.parse(this.billdetails)
         
          console.log('billdetails billdetails : ', JSON.stringify(this.billdetails));


      }
      else {

      this.errorCallBack(data.subActionId, resp);
      }
    });
  }
 
  formatCurrency(amt){
   
    console.log("amt" + amt)
    let amts = this.customCurrencyPipe.transform(amt, 'decimal').replace(/[^.0-9]+/g, '');
    console.log(amts)
    this.lowAmt =  parseFloat(this.billPaymentForm.value.amt) <  parseFloat(this.minPayableAmt)
    this.moreAmt =  parseFloat(this.billPaymentForm.value.amt) >  parseFloat(this.maxPayableAmt)

  
    this.inputAmt = amts
    this.formValidation.formatCurrencybbps(amt, this.billPaymentForm);
  }


  getAllServiceAlert(){
    let param = this.billPaymnetService.getServiceAlert();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      // console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      console.log("getAllServiceAlert " +  JSON.stringify(resp))
      if (resp.opstatus == "00") {
        this.serviceAlertList =  JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
          console.log("getAllServiceAlert " +JSON.stringify(this.serviceAlertList))
      }
      else {
    
      }
    })
  }
  onamtchange(amt){
    this.billPaymentForm.get('amt').setValue(amt);
    this.formatCurrency(amt)
  }

  creditcardInput(numb){
    console.log("numb" + numb)
    this.billPaymentForm.get('consumerNumber1').setValue(numb);
    this.ccNumber = numb.match(/.{1,4}/g)
    this.billPaymentForm.get('dummy').setValue(this.ccNumber.join(' ')); 

    console.log("this.ccNumber" + this.ccNumber)
  }


  filterBiller(value){
    
  
  //  console.log(value)
    if(value.length > 0){
      // $('#board-name').show();
      this.hideList = false
      this.filteredBillerList = this.finalBillerList.filter(function (el) {
     //   console.log(el.biller_legal_name.toLowerCase()  + " " +  value.toLowerCase())

         if(el.biller_name.toLowerCase().includes(value.toLowerCase())){
          return el
         }
              
      });
      //console.log(" this.filteredBillerList " +  this.filteredBillerList )
      for(var i = 0 ; i<  this.filteredBillerList.length;  i++){
      if(value.toLowerCase() ===   this.filteredBillerList[i].biller_name.toLowerCase()){
        console.log(value.toLowerCase() +  " == " +  this.filteredBillerList[i].biller_name.toLowerCase())
      //  console.log("this.filteredBillerList[i] : " + JSON.stringify(this.filteredBillerList[i])) 
        this.boardTypeSelection(this.filteredBillerList[i])
       return
      }else{
        console.log("not match")
        this.autharray= [],
      
        this.logoUrl = '';
        this.billSampleURL = '';
        this.billerCategory ='';
     
        this.selectdBillerIsBbps ='';
    
        this.billerNote = ''
        this.paymentamount_validation = ''

       // this.billPaymentForm.get('consumerNumber').updateValueAndValidity();  
        this.billPaymentForm.get('boardname').updateValueAndValidity();  
        this.partialPay = ''
        this.validatePay =''
        this.billerType = ''
        this.DataService.isbillerbbps = ''
      }
      }
    }else{
     // $('#board-name').hide();
     this.filteredBillerList = this.finalBillerList
     // $('#board-name').hide();
     this.logoUrl = '';
    }

   

  }
  toggleCategoriesSelection(event){
    event.stopPropagation();
    console.log("event" + JSON.stringify(event))
    if(event.isTrusted){
      this.hideList = false
      this.filteredBillerList = this.finalBillerList
      $('#board-name').parent().addClass('active')
    }
  }
  hidebillerlist(event){
    this.hideList = true
  }
}