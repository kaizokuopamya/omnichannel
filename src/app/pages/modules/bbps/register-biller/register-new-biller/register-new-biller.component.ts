import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../../../../app.constant';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CustomCurrencyPipe } from '../../../../../pipes/custom-currency.pipe';
import {BbpsService} from 'src/app/services/bbps.service'
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import {RegisterNewBillerService} from './register-new-biller.service'
import { CommonMethods } from '../../../../../services/common-methods';
import { FormValidationService } from '../../../../../services/form-validation.service';
declare var $: any;
@Component({
  selector: 'app-register-new-biller',
  templateUrl: './register-new-biller.component.html',
  styleUrls: ['./register-new-biller.component.scss']
})
export class RegisterNewBillerComponent implements OnInit , OnDestroy {

  constructor( private router:Router,
     public DataService: DataService , 
     private constant: AppConstants,
     private customCurrencyPipe: CustomCurrencyPipe,
     private bbpsService: BbpsService,
     private storage: LocalStorageService,
     private http: HttpRestApiService,
     public commonMethods: CommonMethods,
     private formValidation: FormValidationService,
     private registerNewBillerService: RegisterNewBillerService) { }
      billerCategory:any
      registerBillerForm : FormGroup
      billerlist
      consumerLabel:any = ''
      billerid:any;
      ccNumber:any;
      selectedBillerId:any;
      billerLogo:any;
      submitClicked:boolean =false;
      finalBillerList:any =[]
      selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
      platformtype =""
      boardNameValue:any;
      autharray:any = [];
      filteredBillerList:any =[];
      authValueArray:any =[]
      selectedBillerName: ''
      stateList:any =[]
      inputAmt:any
      errorMsg:any
      billSampleURL:any
      selectedCategory:any
      logoUrl:any
      hideList:boolean = true
  ngOnInit(): void {
    this.buildForm() ;
    this.DataService.isbbpsPage = true
    if (this.constant.getPlatform() == "web") {
      this.platformtype = 'InternetBanking'
    }else{
      this.platformtype = 'MobileBanking'
    }
   this.getBillerCategory()
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
    this.DataService.isComingfromRecept = false
   
  }

  goToPage(routeName){
   
    this.router.navigateByUrl('/'+  routeName);
   
  } 

  buildForm(){
    this.registerBillerForm = new FormGroup({
      billerCategory: new FormControl('', [Validators.required]),
      boardname: new FormControl(''),
      dummy: new FormControl(''),
      shortName: new FormControl('', [Validators.required,  Validators.pattern("^[a-zA-Z0-9_ ]*$")]),
    });
  
  }
  validateForm(){
    if(this.registerBillerForm.invalid){
      this.registerBillerForm.get('billerCategory').markAsTouched();
      this.registerBillerForm.get('billerLocation').markAsTouched();
      this.registerBillerForm.get('boardname').markAsTouched();
      this.registerBillerForm.get('shortName').markAsTouched();

      for(let i =0; i < this.autharray.length ; i++){
        this.registerBillerForm.get('consumerNumber'+ (i +1 )).markAsTouched();
      }
      return;
     }
  }

  registerBillerSubmit(){
    this.submitClicked = true
    if(this.registerBillerForm.valid){
    
      console.log(this.registerBillerForm.value)
      this.createNewBiler(this.registerBillerForm.value)
    }
    else{
      this.validateForm() ;
    }
  }

  onCategorySelect(category){
    this.selectedCategory= category
    this.selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
    this.finalBillerList =[]
    this.stateList = []
    this.autharray =[]
    this.logoUrl = '';
    this.registerBillerForm.get('boardname').setValue('');
    this.registerBillerForm.get('shortName').setValue('');
    this.registerBillerForm.get('shortName').reset();
    this.registerBillerForm.get('boardname').updateValueAndValidity();
    // this.registerBillerForm.get('billerLocation').reset();
    // $('#board-name').slideUp();
    // $('#board-name').parent().removeClass('active')
    // if(category == "Electricity" )  {
    //   let stateListParams = this.bbpsService.getLocationList(category);
    //   this.http.callBankingAPIService(stateListParams, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
    //     console.log(JSON.parse(data.responseParameter.bbpsResponse));
    //     var resp = data.responseParameter;
    //     if (resp.opstatus == "00") {
    //       console.log(data.responseParameter);
       
    //         this.stateList =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerLocationList
    //         console.log('State List: ', this.stateList);
  
  
  
    //     }
    //     else {
    //       this.errorCallBack(data.subActionId, resp);
    //     }
    //   });
    //   this.registerBillerForm.get('billerLocation').setValidators([Validators.required]);
    //   this.registerBillerForm.get('billerLocation').updateValueAndValidity(); 
      
    // }else{
    //   this.getAllBillerlist(category)
    //   this.registerBillerForm.get('billerLocation').clearValidators();
    //   this.registerBillerForm.get('billerLocation').updateValueAndValidity(); 

    // }

    this.getAllBillerlist(category)
 
  }


  getAllBillerlist(category){
    this.finalBillerList = []
    let billerParamList = this.bbpsService.getbillerListforCategory(category);
    this.http.callBankingAPIService(billerParamList, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
          var billerList =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
          console.log("BillerList : " + JSON.stringify( billerList))
          for(var i= 0; i < billerList.length; i++){
            this.finalBillerList.push(JSON.parse(billerList[i].billerData))
           }
           this.filteredBillerList = this.finalBillerList
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }


  onStateSelect(value){
    this.selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
    this.finalBillerList =[]
    this.autharray =[]
   // $('#board-name').slideUp();
    $('#board-name').parent().removeClass('active')
    console.log("selected state ===> " + value);
    // console.log( "response SANAL === >" +  this.httpBbpsApiCall(value))
    var param = this.bbpsService.getbillerlist(value , this.registerBillerForm.value.billerCategory)
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
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
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }


  onSelectOption(item){
     
      this.boardTypeSelection(item)
       this.hideList = true
     this.filteredBillerList = []

  }


  boardTypeSelection(item){
    console.log("item" + JSON.stringify(item))
   // this.onSelectOption()
   for(var i=0; i <   this.autharray.length; i++){
    this.registerBillerForm.removeControl("consumerNumber" + (i + 1));
   }
    this.selectedBoard = item ;
    //this.registerBillerForm.setValue({boardname: item.billerId})
    this.selectedBillerId =item.billerid
    this.selectedBillerName = item.biller_name
    this.billerid = item.billerid
    this.autharray =item.authenticators
    this.logoUrl = item.biller_logo;
    this.registerBillerForm.get('boardname').setValue(item.biller_name);
    // this.registerBillerForm = this.regengerateForm()
    for(var i=0; i <   this.autharray.length; i++){
      var validation = []
      if(this.autharray[i].optional =="N"){
        validation.push(Validators.required)
      }
        validation.push(Validators.pattern(this.autharray[i].regex))
       this.registerBillerForm.addControl("consumerNumber" + (i + 1), new FormControl('',  validation));
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


    this.billerLogo = item.biller_logo;
  
    this.errorMsg =  item.authenticators[0].error_message
    this.billSampleURL = item.biller_bill_copy

    this.registerBillerForm.get('boardname').updateValueAndValidity();  
  }
  errorCallBack(c,a){


  }
  getBillerCategory() {
    let categoryListParam = this.bbpsService.getBillerCategories();
    this.http.callBankingAPIService(categoryListParam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log("sanal ==> " + JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
          this.billerCategory =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.categoryList
         // this.existingBillerDetails = JSON.parse(this.existingBillerDetails)
         console.log('  this.existingBillerDetails ===> ' +   this.billerCategory)
      }
      else {
   
      }
    });
  }
  
  createNewBiler(formValue) {
    for(var i =0 ; i < this.autharray.length ; i++){
      this.authValueArray.push({
            "seq": this.autharray[i].seq,
            "parameter_name": this.autharray[i].parameter_name,
            "value": formValue["consumerNumber" + (i + 1)],
            "encryption_required": this.autharray[i].encryption_required,
          
      })
    }
    console.log("formValue : " + JSON.stringify(formValue))
    console.log("authValueArray : " + JSON.stringify( this.authValueArray))
    this.DataService.newBillerArray= {
      'auth' : this.authValueArray,
      'billerName' :this.selectedBillerName,
      'billerLogo' :this.billerLogo,
      'billerId' : this.billerid,
      'shortName': formValue.shortName,
      'platform' : this.platformtype,
      'formValues' : formValue
    }
    console.log(" this.DataService.newBillerArray : " +  JSON.stringify(this.DataService.newBillerArray))
    var requiredData = JSON.stringify(this.authValueArray)
    let newBillerParam = this.registerNewBillerService.registerNewBiller(requiredData ,  this.platformtype , formValue);
    this.router.navigateByUrl('/retailRegisterBillerConfirmation');
   
    // this.http.callBankingAPIService(newBillerParam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
    //   console.log("sanal ==> " + JSON.parse(data.responseParameter.bbpsResponse));
    //   var resp = data.responseParameter;
    //   if (resp.opstatus == "00") {
    //     console.log(data.responseParameter);
        
    //       this.billerCategory =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.categoryList
    //      // this.existingBillerDetails = JSON.parse(this.existingBillerDetails)
    //      console.log('  this.existingBillerDetails ===> ' +   this.billerCategory)
    //      this.commonMethods.openPopup('.successpopup')
    //      this.registerBillerForm.reset();

    //   }
    //   else {
    //   ///  this.errorCallBack(data.subActionId, resp);
    //   }
    // });
  }
   onamtchange(amt){
    this.registerBillerForm.get('amt').setValue(amt);
    this.formatCurrency(amt)
  }

  creditcardInput(numb){
    console.log("numb" + numb)
    this.registerBillerForm.get('consumerNumber1').setValue(numb);
    this.ccNumber = numb.match(/.{1,4}/g)
    this.registerBillerForm.get('dummy').setValue(this.ccNumber.join(' ')); 

    console.log("this.ccNumber" + this.ccNumber)
  }

  formatCurrency(amt){
   
    console.log("amt" + amt)
    let amts = this.customCurrencyPipe.transform(amt, 'decimal').replace(/[^.0-9]+/g, '');
    console.log(amts)
    this.inputAmt = amts
    this.formValidation.formatCurrencybbps(amt, this.registerBillerForm);
  }
  filterBiller(value){
    
  
     console.log(value)
      if(value.length > 0){
       
        this.hideList = false
        this.filteredBillerList = this.finalBillerList.filter(function (el) {
       //   console.log(el.biller_legal_name.toLowerCase()  + " " +  value.toLowerCase())
  
           if(el.biller_name.toLowerCase().includes(value.toLowerCase())){
            return el
           }
                
        });
        console.log(" this.filteredBillerList " +  this.filteredBillerList )
        for(var i = 0 ; i<  this.filteredBillerList.length;  i++){
          console.log("SANAKL SANAL")
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

        //   this.billerCategory ='';
       
      

  
         // this.billPaymentForm.get('consumerNumber').updateValueAndValidity();  
  
        }
        }
      }else{
        this.filteredBillerList = this.finalBillerList
        // $('#board-name').hide();
        this.logoUrl = '';
      
       
      }
  
     
  
    }
    toggleCategoriesSelection(event: Event){
      event.stopPropagation();
        console.log("event" + JSON.stringify(event))
        if(event.isTrusted){
          this.hideList = false
          this.filteredBillerList = this.finalBillerList
          $('#board-name').parent().addClass('active')
        }
    }
    hidebillerlist(event){
      console.log("IN")
      this.hideList = true
    //  this.filteredBillerList = []

         // $('#board-name').parent().removeClass('active')
    }
}
