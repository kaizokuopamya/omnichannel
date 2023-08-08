import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { BbpsService } from 'src/app/services/bbps.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { DatePipe , Location} from '@angular/common';
import {MobilePrepaidServiceService} from './mobile-prepaid-service.service'
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../../../../services/local-storage.service';
import { AppConstants } from 'src/app/app.constant';
declare var $: any;
@Component({
  selector: 'app-mobile-prepaid',
  templateUrl: './mobile-prepaid.component.html',
  styleUrls: ['./mobile-prepaid.component.scss']
})
export class MobilePrepaidComponent implements OnInit  , OnDestroy{

  constructor(
    private router:Router, 
    public DataService: DataService,
    private bbpsService: BbpsService,
    private commonMethod : CommonMethods,
    private location : Location,
    private mobilePrepaidServiceService : MobilePrepaidServiceService,
    private http : HttpRestApiService,
    private storage : LocalStorageService,
    public constant : AppConstants,
  ) { }
  billerType:any;
  billPaymentBoardName = [
    { 'imagName' : 'assets/images/icons/airtel.png', 'boardName' : 'Airtel'},
    { 'imagName' : 'assets/images/icons/airtel.png', 'boardName' : 'Vodafone'},
  ]
  ifMobileValidated:boolean = false;
  boardValue = ''
  logoUrl:any;
  mobValErrorMsg
  selectedBillerId:any;
  selectdBillerIsBbps:any = "N"
  boardNameValue : any = ''
  selectedOptions={
    "operatorName" : '',
    "operatorId" : '',
    "circle" : '',
    "circleId" : '',
  }
  operatorDetails:any ={
    'biller_name': '',
    'circle_name': ''
  };
  boardNameToggle : boolean = false
  finalBillerList:any =[];
  cirlcleList:any= []
  operatorList:any = [
    {'id': "0", 'location':"All"},
    {'id': "1", 'location':"Andhra Pradesh"},
    {'id': "2", 'location':"Assam"},
    {'id': "3", 'location':"Bihar and Jharkhand"},
    {'id': "4", 'location':"Chennai"},
    {'id': "5", 'location':"Delhi NCR"},
    {'id': "6", 'location':"Gujarat"},
    {'id': "7", 'location':"Haryana"},
    {'id': "8", 'location':"Himachal Pradesh"},
    {'id': "9", 'location':"Jammu Kashmir"},
    {'id': "10", 'location':"Karnataka"},
    {'id': "11", 'location':"Kerala"},
    {'id': "12", 'location':"Kolkata"},
    {'id': "13", 'location':"Madhya Pradesh and Chhattisgarh"},
    {'id': "14", 'location':"Maharashtra and Goa"},
    {'id': "15", 'location':"Mumbai"},
    {'id': "16", 'location':"North East"},
    {'id': "17", 'location':"Odisha"},
    {'id': "18", 'location':"Punjab"},
    {'id': "19", 'location':"Rajasthan"},
    {'id': "20", 'location':"Tamilnadu"},
    {'id': "21", 'location':"UP East"},
    {'id': "22", 'location':"UP West and Uttarakhand"},
    {'id': "23", 'location':"West Bengal and Andaman Nicobar"}

  ]
  totalHandlingCharge ="0.00"
  cou_conv_fee = "0.00"
  bou_conv_fee = '0.00'
  authArray:any;
  hideList:boolean =true;
  filteredBillerList:any =[]
  mobilePrepaidForm : FormGroup 
  recentTranceList:any = [];
  isbillerbbps:any ="N"

  ngOnDestroy() {
    this.DataService.isbbpsPage = false
    this.DataService.searchProviderData =''
    this.DataService.bbpsMobileNumber = ''
  }
  ngOnInit(): void {
    this.buildForm() ;
    this.getAllBillerlist()
   
    this.filterRecenTranceAndPendingBills()
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboardMobile' : "retailRechargeBillPay"
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.DataService.isbbpsPage = true
    if( this.DataService.bbpsMobileNumber){
      this.mobilePrepaidForm.get('mobileNumber').setValue(this.DataService.bbpsMobileNumber.slice(-10));
      this.onNumberInput(this.DataService.bbpsMobileNumber.slice(-10))
    }

    this.getstatelist()
  }

  buildForm(){
    this.mobilePrepaidForm = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
      operator: new FormControl('', [Validators.required]),
      circle: new FormControl('', [Validators.required]),
     
    });
  }

  getstatelist() {
    var statelist 
    var param = this.mobilePrepaidServiceService.getStates()
    this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES, { showErrorPopup: false }).subscribe(data => {
      console.log("DATADATAAA" ,data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        statelist = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.circleList
        // console.log(' this.operatorDetails' +  JSON.stringify(operatorData))
        //this.plandetails = JSON.parse(operatorData.responseParameter.result)
        console.log("DATADATAAA" , JSON.parse(statelist));
        this.cirlcleList = JSON.parse(statelist)
       

      }
      else {
        //Sachin changes
        let response = JSON.parse(resp.bbpsResponse);
        var msg = response?.msg ? response?.msg : response?.responseCode ? response.responseCode : 'Due to downtime facing technical issue'
        //  var msg = .responseCode
       // this.repsonseMsg = msg;
        this.commonMethod.openPopup('.errorMSg')

        //  this.errorCallBack(data.subActionId , '');

      }


    })
  }
  circleAsperSelectedBiller(billerID){
   
    this.operatorList = []
    
   for(let i = 0; i < this.cirlcleList.length; i++){
   
    if(billerID == this.cirlcleList[i].billerId){
        this.operatorList.push(this.cirlcleList[i])

    }
   }
   


  }
  getAllBillerlist(){
    this.finalBillerList = []
    let billerParamList = this.bbpsService.getbillerListforCategory(this.DataService.billcategory);
    this.http.callBankingAPIService(billerParamList, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
     
          var billerList =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
           console.log("BillerList : " + JSON.stringify( billerList))
           for(var i= 0; i < billerList.length; i++){
            this.finalBillerList.push(JSON.parse(billerList[i].billerData))

           }

           console.log(" this.finalBillerList" + JSON.stringify( this.finalBillerList))
          
           this.filteredBillerList = this.finalBillerList
      }
      else {
        var msg ="Due to downtime Unable to retrieve Billers" 
        this.errorCallBack(msg, resp);
      }
    });


  }
  billHistoryDetails(item){
    this.DataService.billHistoryDetails = item
    this.router.navigateByUrl('/billDetails');

    console.log("billHistoryDetails>>>> " + JSON.stringify(item))
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
   
        
          this.logoUrl = '';
     
      
       
          this.selectdBillerIsBbps ='';
      
        
   
  
         // this.billPaymentForm.get('consumerNumber').updateValueAndValidity();  
          this.mobilePrepaidForm.get('operator').updateValueAndValidity();  
   
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
  validateForm(){
    if(this.mobilePrepaidForm.invalid){
      this.mobilePrepaidForm.get('mobileNumber').markAsTouched();


      return ;
     }
  }

  filterRecenTranceAndPendingBills(){
    console.log("this.DataService.finalRecentTransList" , this.DataService.finalRecentTransList)
    for(var i =0 ; i <  this.DataService.finalRecentTransList?.length ; i++){
    if(this.DataService.finalRecentTransList[i]?.biller_category == this.DataService.billcategory)
    this.recentTranceList.push(this.DataService.finalRecentTransList[i])
    }

  }


  onNumberInput(number){
    console.log(number)
    if(number.length == 10){
        var param = this.mobilePrepaidServiceService.getPrepaidOperator(number)
        this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
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
          //  alert(this.operatorDetails.circleid + "/" + this.operatorDetails.circle_name)
            this.circleAsperSelectedBiller(this.selectedOptions.operatorId)
            this.mobilePrepaidForm.get('operator').setValue(this.selectedOptions.operatorName);
            this.mobilePrepaidForm.get('circle').setValue(this.operatorDetails.circleid + "/" + this.operatorDetails.circle_name);
            console.log("length : " +this.finalBillerList.length)
            // const index = this.finalBillerList.map((object:any) => object.billerid).indexOf(this.operatorDetails.billerid);
            var index 
            for(var i =0; i < this.finalBillerList.length; i++ )  {
                if(this.finalBillerList[i].billerid ==this.operatorDetails.billerid ){
                  index = i
                }

            }
          
            this.logoUrl = this.finalBillerList[index].biller_logo
            this.isbillerbbps = this.finalBillerList[index].isbillerbbps
            this.DataService.isbbpsBiller = this.isbillerbbps;
            this.authArray =  this.finalBillerList[index].authenticators
        
            this.boardNameValue =  this.finalBillerList[index] ;
            this.billerType=  this.finalBillerList[index].biller_type
            console.log("index" + index)
            console.log("this.finalBillerList" , this.finalBillerList)

            
            if(!this.commonMethod.validateNullAndUndefined(this.finalBillerList[index].customer_conv_fee)){

           
           this.finalBillerList[index].customer_conv_fee.forEach(el => {
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
              this.totalHandlingCharge = (parseFloat(this.cou_conv_fee) + parseFloat( this.bou_conv_fee)).toFixed(2)
           })
          }else{
            this.totalHandlingCharge = "0.00"
          }
          }
          else if(bbpsresponse.status =="404"){
            this.commonMethod.openPopup('.mob-postpaid-error')
            this.ifMobileValidated = false;
            // this.mobValErrorMsg = 'MOB_VALID_ERROR'

            // Sachin changes
            this.mobValErrorMsg = bbpsresponse.msg;


          }else{
            this.ifMobileValidated = false;
            this.commonMethod.openPopup('.mob-postpaid-error')
            this.errorCallBack(data.subActionId , resp);
            this.mobValErrorMsg = 'ISSUE_FETCH_OPERATOR';
          }
        })
    }else{
      this.ifMobileValidated = false;
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

  errorCallBack(error , resp){

  }
  boardTypeSelection(item){
    console.log("itemitemitem" , item)
    this.selectedOptions.operatorId = item.billerid
    this.selectedOptions.operatorName = item.biller_name,
    this.logoUrl = item.biller_logo
    this.isbillerbbps = item.isbillerbbps
    this.DataService.isbbpsBiller = item.isbillerbbps;
    this.authArray = item.authenticators
    this.mobilePrepaidForm.get('operator').setValue(item.biller_name);
    this.boardNameValue = item ;
    this.billerType= item.biller_type
    this.circleAsperSelectedBiller(item.billerid)
  }


  onOperatorChange(value){
    var item = value.split('/')
    this.selectedOptions.operatorId = item[0]
    this.selectedOptions.operatorName = item[1]
    console.log(value)

  }


  oncirleChange(value){
    var item = value.split('/')
    this.selectedOptions.circleId = item[0]
    this.selectedOptions.circle = item[1]
    console.log(value)
  }
  // onSelectOption(e){
  //   if (e.stopPropagation) e.stopPropagation();
  //   this.boardNameToggle = !this.boardNameToggle
  //   if(this.boardNameToggle){
  //     $('#board-name').slideToggle();
  //     $('#board-name').parent().toggleClass('active')
  //   } else{
  //     $('#board-name').slideUp();
  //     $('#board-name').parent().removeClass('active')
  //   }

  // }
  onSelectOption(item){
    this.boardNameToggle = !this.boardNameToggle
    //  $('#board-name').slideUp();
      $('#board-name').parent().removeClass('active')
      this.hideList = true
      this.boardTypeSelection(item)
   //   this.filteredBillerList = this.finalBillerList

  }
  clickedOut($event){
    $('#board-name').slideUp();
    $('#board-name').parent().removeClass('active')
  }


  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  browsePlanSubmit(){
    var  authValueArray = []
     authValueArray = [{
      // "seq": this.autharray[i].seq,
      "parameter_name": this.authArray[0].parameter_name,
      "value": this.mobilePrepaidForm.value.mobileNumber,
      "encryption_required": this.authArray[i]?.encryption_required ? this.authArray[i].encryption_required: "N",
    
      }]
   
      if(this.authArray.length > 1){
        for(var i = 1; i < this.authArray.length; i++){
         
          if(this.authArray[i].parameter_name.includes("Circle") || this.authArray[i].parameter_name.includes("circle")){
              authValueArray.push({
              "parameter_name": this.authArray[i].parameter_name,
              "value" :  this.selectedOptions.circle,
              "encryption_required": this.authArray[i]?.encryption_required ? this.authArray[i].encryption_required: "N",
            })
          }
            if(this.authArray[i].parameter_name.includes("ID") || this.authArray[i].parameter_name.includes("id") || this.authArray[i].parameter_name.includes("Id")){
              authValueArray.push({
                "parameter_name": this.authArray[i].parameter_name,
                "value" : "",
                "encryption_required": this.authArray[i]?.encryption_required ? this.authArray[i].encryption_required: "N",
              })

            }
        }
      }
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
    this.operatorDetails.callPullDetails = this.boardNameValue
    this.DataService.mobilePrepaidDetails = this.operatorDetails
    console.log('operatorDetails ',this.operatorDetails);
    
    console.log(" this.DataService.mobilePrepaidDetails" ,  this.DataService.mobilePrepaidDetails)
    

    if(this.mobilePrepaidForm.valid){

      if(this.operatorDetails.biller_name != '' && this.operatorDetails.circle_name != '')
      this.goToPage('browsePlan')
    } else{
      this.validateForm()
    }
  }

  openMobBoardName(){
    this.commonMethod.openPopup('div.mob-postpaid');
}

closePopup(){
  this.commonMethod.closeAllPopup() ;
}


}
