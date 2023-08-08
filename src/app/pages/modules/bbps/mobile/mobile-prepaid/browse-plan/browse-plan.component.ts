import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import{BbpsService} from 'src/app/services/bbps.service'
import { CommonMethods } from 'src/app/services/common-methods';
import  {BrowsePlanService} from './browse-plan.service'
import { DatePipe , Location} from '@angular/common';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../../../../services/local-storage.service';
import { AppConstants } from 'src/app/app.constant';
import {RechargeBillpayService} from '../../../recharge-billpay/recharge-billpay.service'

@Component({
  selector: 'app-browse-plan',
  templateUrl: './browse-plan.component.html',
  styleUrls: ['./browse-plan.component.scss']
})
export class BrowsePlanComponent implements OnInit , OnDestroy{
  operatorsDetails:any
  plandetails:any
  threeGFourGPlans:any = []
  extraAuthValueArray:any = []
  recommended:any = []
  roaming:any =[]
  amtAscending:boolean = true
  cou_conv_fee:any ="0.00"
  bou_conv_fee:any ="0.00"
  selectedPlan:any
  billerNote:any;
  billDetails:any;
  selectedField:any = "amount"
  sortrow:any ="amount"
  validatedillerRes:any;
  billerdetailsDataPass:any;
  paymentamount_validation:any
  sms:any =[]
  specialTariff:any =[]
  seletcedTab:any
  plantype:any =[]
  topup:any =[]
  authValueArray:any =[]
  paymentType:any;
  repsonseMsg:any;
  validatePay:any
  logoUrl:any;
  selectedBillerName:any;
  billerType:any
  selectedBoard:any;
  totalHandlingCharge:any;
  selectedBillerId:any;
  autharray:any;
  billSampleURL:any;
  billerCategory:any;
  selectdBillerIsBbps:any;
  maxPayableAmt:any
  minPayableAmt:any
  partialPay:any;
  constructor(
    private router:Router, 
    public DataService: DataService,
    public commonMethod : CommonMethods,
    private http : HttpRestApiService,
    private rechargeBillpayService : RechargeBillpayService,
    private browsePlanService: BrowsePlanService,
    private storage : LocalStorageService,
    private constant :  AppConstants,
    private bbpsService : BbpsService,
    private datepipe: DatePipe,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.operatorsDetails = this.DataService.mobilePrepaidDetails
    this.DataService.isbbpsPage = true
    console.log("this.operatorsDetails" + JSON.stringify(this.operatorsDetails))
    this.getplans()
    this.boardTypeSelection(this.DataService.mobilePrepaidDetails.callPullDetails)
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false

}
ontabClick(plan){
  this.seletcedTab = plan
  this.selectedPlan = []
  this.plandetails.forEach(el => {
    if (el.planCategoryName == plan) {
      this.selectedPlan.push(el)
    }
     
  })
 
  this.onFilterAmt( this.amtAscending , this.selectedField)
  

}


  onFilterAmt(value:boolean , field:any){
    this.sortrow = field
    this.selectedField = field
  
    if(value){
    this.selectedPlan.sort((a, b) => a[field] - b[field])
   
    }else{
      this.selectedPlan.sort((a, b) => b[field] - a[field])
    }
    this.amtAscending = !this.amtAscending;
  }


    //////////////////On biller Board Select ///////////////////////////////////////////

    boardTypeSelection(item){
      
      this.DataService.SelectedBiller = item
      this.authValueArray =[]
      console.log("item ==> " + JSON.stringify(item))
      
        this.selectedBoard = item ;

        this.selectedBillerName = item.biller_name;
        this.selectedBillerId = item.billerid;
        this.autharray = item.authenticators;



        for(var i=0; i <   this.autharray.length; i++){
          if(this.autharray[i].data_type == "Numeric"){
            this.autharray[i].inputType= "number";
          }else{
            this.autharray[i].inputType= "text";
          }
         
          if(this.autharray[i].error_message.includes("digits") || this.autharray[i].error_message.includes("digit")){
            this.autharray[i].paramLength = JSON.parse(this.autharray[i].error_message.match(/([\d.]+) *digit/)[1])
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
        this.logoUrl = item.biller_logo;
        this.billSampleURL = item.biller_bill_copy;
        this.billerCategory = item.biller_category
     
        this.selectdBillerIsBbps = item.isbillerbbps
    
        this.billerNote =  item.biller_remarks
        this.paymentamount_validation = item.paymentamount_validation

       // alert(this.paymentamount_validation + "  " + item.paymentamount_validation)
      
       // this.billPaymentForm.get('consumerNumber').updateValueAndValidity();  
       // this.billPaymentForm.get('boardname').updateValueAndValidity();  
        this.partialPay = item.partial_pay;
        this.validatePay =item.online_validation;
        this.billerType = item.biller_type
        this.DataService.isbillerbbps = item.isbillerbbps
      



         //////////////// Handling fee ////////////////////////

      if(item.customer_conv_fee?.length > 0 ){

        item.customer_conv_fee.forEach(el => {
          if (el.payment_channel == "InternetBanking" || el.payment_channel == "MobileBanking" ) {


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

      // for( var i = 0; i < item.payment_channels.length ; i++ ){
        
      //   if(item.payment_channels[i].payment_channel="InternetBanking" && this.constant.getPlatform() == "web"){
      //     this.maxPayableAmt = item.payment_channels[i].max_limit
      //     this.minPayableAmt = item.payment_channels[i].min_limit
      //   }else if(item.payment_channels[i].payment_channel="MobileBanking" && this.constant.getPlatform() != "web"){
      //     this.maxPayableAmt = item.payment_channels[i].max_limit
      //     this.minPayableAmt = item.payment_channels[i].min_limit
      //   }

      // }
      


    }
  chosenPlan(item){
    console.log("item sanal" + JSON.stringify(item))
    var  billerdetailsList
    this.billDetails = item;
    this.authValueArray =[]
    this.extraAuthValueArray =[]
    if( !this.commonMethod.validateEmpty(this.DataService.mobilePrepaidDetails.callPullDetails.additional_validation_details)){
      this.extraAuthValueArray =[{
        "parameter_name": this.DataService.mobilePrepaidDetails.callPullDetails.additional_validation_details[0].parameter_name,
        "value": item.planid
       }]
    }
    console.log(" this.extraAuthValueArray" + JSON.stringify( this.extraAuthValueArray))
    this.DataService.mobilePrepaidDetails.validateData.pay_amt = item.amount
    this.DataService.mobilePrepaidDetails.validateData.extraAuthValueArray = this.extraAuthValueArray

    //this.validatePaymentDetails(this.DataService.mobilePrepaidDetails.validateData)
    
   // var formvalue = this.billPaymentForm.value
    // this.authenticators[0].parameter_name = this.consumerLabel;
    // this.authenticators[0].value = this.billPaymentForm.value.consumerNumber;
    if(this.authValueArray.length > 1){
      for(var i = 1; i < this.authValueArray.length; i++){
          if(this.authValueArray[i].parameter_name.includes("ID") || this.authValueArray[i].parameter_name.includes("id") || this.authValueArray[i].parameter_name.includes("Id")){
            this.authValueArray[i].value = this.billDetails.planId
          }
      }
    }
    this.authValueArray =  this.DataService.mobilePrepaidDetails.validateData.authenticators
      
     console.log("this.authValueArray :  " + JSON.stringify(this.authValueArray))
    // console.log("this.billPaymentForm.value.boardname," + this.billPaymentForm.value.boardname,)
     console.log("selectedBillerName," + this.selectedBillerName,)
     billerdetailsList = this.DataService.mobilePrepaidDetails.validateData
   

    console.log("billerdetailsList :" + JSON.stringify(billerdetailsList))
  //  if(this.billPaymentForm.valid){
     this.DataService.electricBillObj.billername = this.selectedBillerName
      // this.DataService.electricBillObj.custID = this.billPaymentForm.value.consumerNumber
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
          billerdetailsList.pay_amt =  item.amount
          // alert( billerdetailsList.pay_amt)
      
          this.validatePaymentDetails(billerdetailsList)
          
        }else{
          this.paymentType ="adhoc"
         
          this.billerdetailsDataPass = {
            'billerName' :this.selectedBillerName,
            'billamt': item.amount,
            'billCategory':this.billerCategory,
            'logourl' :this.logoUrl,
            'billerId' :billerdetailsList.billerId,
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
                'field' : "₹" +   item.amount
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
         
          this.goToPage('existingBillPayment') ;
          
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
          'billamt': item.amount,
          'billCategory':this.billerCategory,
          'logourl' :this.logoUrl,
          'billerId' :billerdetailsList.billerId,
          'consumerNo': billerdetailsList[0].authenticators.value,
          'validationid' :"",
          'dueDate': "",
          'paymentType': this.paymentType,
          'cou_conv_fee' : this.cou_conv_fee,
          'bou_conv_fee' : this.bou_conv_fee,
          "totalHandlingFee": this.totalHandlingCharge,
          "maxpayableAmt" : this.maxPayableAmt,
          "minpayableAmt" : this.minPayableAmt,
          "partialPay" : this.partialPay,
          'displayData':[
           
           
            {
              "label":  'Amount',
              'field' : "₹" +  item.amount,
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
    var param
    console.log("datadata" ,data)
    if(data.billerId == 'BSNLPRE' || data.billerId == 'JIOPRE'){
      param = this.bbpsService.ValidatePaymentParamJIOBSNL(data);
    }else{
      param = this.bbpsService.ValidatePaymentParam(data);
    }
      
   // ValidatePaymentParamJIOBSNL
    var billamt
   
   this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
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
            //  {
            //    "label":  'valid until',
            //    'field' : this.validatedillerRes.valid_until,
            //  },
           ]
         }
         
       }else{
       console.log("this.logoUrl : " + this.logoUrl)
        
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
      
       
     }
     
      
       console.log("this.billerdetailsDataPass ==>" + this.billerdetailsDataPass)
       this.DataService.billerdata = this.billerdetailsDataPass
       this.goToPage('existingBillPayment') ;
       }
       else if(resp.opstatus == "01"){
        var msg = ''
        if(JSON.parse(resp.bbpsResponse).responseCode == "422" || JSON.parse(resp.bbpsResponse).responseCode == '01'){
         msg = JSON.parse(resp.bbpsResponse).msg
         }else{
         msg = "Due to downtime we are unable to validate your details. ResponseCode:(" + JSON.parse(resp.bbpsResponse).responseCode + ")"
         }
        this.repsonseMsg = msg
        this.commonMethod.openPopup('.errorMSg')
        
         

       }
       else {
         var msg ="Due to downtime unable to Validate your details"
         this.repsonseMsg = msg
         this.commonMethod.openPopup('.errorMSg')
          
          
     }
   })
 }

 errorCallBack(msg, resp) {
   this.repsonseMsg = msg
   this.commonMethod.openPopup('.billerrorMsg')
 }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
  getplans(){
    this.plantype = []
    var param = this.browsePlanService.getplans(this.operatorsDetails)
    this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {  
        this.plandetails = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.rechargePlans
        // console.log(' this.operatorDetails' +  JSON.stringify(operatorData))
        //this.plandetails = JSON.parse(operatorData.responseParameter.result)
        console.log("DATA" + JSON.stringify(this.plandetails));

        this.plandetails.forEach(el => {

          if(this.plantype.indexOf(el.planCategoryName) == -1){
            this.plantype.push(el.planCategoryName)
          }
        })

        console.log("plantype" , this.plantype)

        this.ontabClick(this.plantype[0])     
        this.onFilterAmt( this.amtAscending ,'amount')
      }
      else {
        this.commonMethod.openPopup('.errorMSg')
        this.repsonseMsg = "Currently facing issue while fetching recharge plans."
      //  this.errorCallBack(data.subActionId , '');
        
      }


    })
  }

}
