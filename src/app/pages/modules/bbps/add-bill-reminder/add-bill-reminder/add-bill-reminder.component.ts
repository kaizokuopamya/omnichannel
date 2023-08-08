import { Component, OnInit ,OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../../../../app.constant';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CustomCurrencyPipe } from '../../../../../pipes/custom-currency.pipe';
import {BbpsService} from 'src/app/services/bbps.service'
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import {  Location } from '@angular/common';
import { CommonMethods } from '../../../../../services/common-methods';
import { FormValidationService } from '../../../../../services/form-validation.service';

declare var $: any;
@Component({
  selector: 'app-add-bill-reminder',
  templateUrl: './add-bill-reminder.component.html',
  styleUrls: ['./add-bill-reminder.component.scss']
})
export class AddBillReminderComponent implements OnInit  , OnDestroy{

  constructor(private router:Router,
    public DataService: DataService , 
    private constant: AppConstants,
    public location: Location,
    private customCurrencyPipe: CustomCurrencyPipe,
    private bbpsService: BbpsService,
    private storage: LocalStorageService,
    private http: HttpRestApiService,
    public commonMethods: CommonMethods,
    private formValidation: FormValidationService,) { }
    selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
  addBillReminderForm : FormGroup
  autharray:any = []
  consumerLabel:any;
  billerid:any;
  billerCategory:any;
  stateList:any;
  billerLogo:any;
  selectedBillerId:any;
  selectedBillerName:any;
  billSampleURL:any;
  ccNumber:any;
  logoUrl:any;
  selectedCategory:any;
  filteredBillerList:any;
  finalBillerList:any= [];
  inputAmt:any;
  errorMsg:any;
  platformtype:any;
  authValueArray:any;
  submitClicked:boolean =false;
  months = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
  billertype
  hideList:boolean = true;
  ngOnInit(): void {
    
    this.buildForm() ;
    this.getBillerCategory(); if (this.constant.getPlatform() == "web") {
      this.platformtype = 'InternetBanking'
    }else{
      this.platformtype = 'MobileBanking'
     
    }
  
    if(this.DataService.isComingfromRecept){
      console.log("this.DataService.billPaymentResponedJson" + JSON.stringify(this.DataService.billPaymentResponedJson))
      this.getAllBillerlist(this.DataService.billPaymentResponedJson.responseParameter.result.biller_category)
     
      this.autharray =  this.DataService.billPaymentResponedJson.responseParameter.result.authenticators
      console.log("aaaaa : " + JSON.stringify(this.autharray))
      this.addBillReminderForm.get('billerCategory').setValue(this.DataService.billPaymentResponedJson.responseParameter.result.biller_category);
      this.addBillReminderForm.get('boardname').setValue(this.DataService.billPaymentResponedJson.responseParameter.result.biller_name);
      this.addBillReminderForm.controls['billerCategory'].updateValueAndValidity();
      this.addBillReminderForm.controls['boardname'].updateValueAndValidity()
      this.logoUrl = this.DataService.SelectedBiller.biller_logo
      for(var i=0; i<=  this.autharray.length; i ++){
        this.addBillReminderForm.get('consumerNumber' + (i + 1)).setValue( this.autharray[i].value);
        this.addBillReminderForm.controls['consumerNumber' + (i + 1)].updateValueAndValidity()
      }
      
      
 
    }
  }

  buildForm(){
    this.addBillReminderForm = new FormGroup({
      billerCategory: new FormControl('', [Validators.required]),
      boardname: new FormControl('', [Validators.required]),
      dummy: new FormControl(''),
      amt: new FormControl(''),
      billerMonth: new FormControl('', [Validators.required]),
      nickName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z ]*$")]),
      terms : new FormControl('', [Validators.required])
    });

  }
  validateForm(){
    if(this.addBillReminderForm.invalid){
      // this.billPaymentForm.get('state').markAsTouched();
      this.addBillReminderForm.get('billerCategory').markAsTouched();
      this.addBillReminderForm.get('nickName').markAsTouched();
      this.addBillReminderForm.get('terms').markAsTouched();
      this.addBillReminderForm.get('boardname').markAsTouched();
      this.addBillReminderForm.get('amt').markAsTouched();

      for(let i =0; i < this.autharray.length ; i++){
        this.addBillReminderForm.get('consumerNumber'+ (i +1 )).markAsTouched();
      }
      return
    }
  }
  ngOnDestroy(){
    this.DataService.isbbpsPage = false
    this.DataService.isComingfromRecept = false
  }
  addBillReminderSubmit(){
    console.log("this.addBillReminderForm.value" + JSON.stringify(this.addBillReminderForm.value))
    if(this.addBillReminderForm.valid){
 
      this.submitClicked = true;
      console.log("this.addBillReminderForm" + JSON.stringify(this.addBillReminderForm.value))
      for(var i =0 ; i < this.autharray.length ; i++){
        this.autharray[i].value =  this.addBillReminderForm.value["consumerNumber" + (i + 1)]

      }
      var addBillObject ={
        "authArray" :  this.autharray,
        "billDetails": this.addBillReminderForm.value,
        "billerLogo": this.logoUrl,
        "billerId": this.billerid,
        "billertype": this.billertype
      }
      console.log( "this.autharray"+  JSON.stringify( this.autharray))

      this.DataService.addBillReminderData = addBillObject
     this.goToPage('retailAddBillReminderConfirmation') ;
    }
    else{
 
      this.validateForm() ;
    }
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  } 

  onSelectOption(item){
    // this.boardNameToggle = !this.boardNameToggle
      // $('#board-name').slideUp();
      this.hideList = true
       $('#board-name').parent().removeClass('active')
       this.boardTypeSelection(item)
        this.filteredBillerList = []
    //   this.filteredBillerList = this.finalBillerList
 
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
      ///  this.errorCallBack(data.subActionId, resp);
      }
    });
  }


  regengerateForm(){
    let form:any = {
      billerCategory: new FormControl(this.addBillReminderForm.value.billerCategory, [Validators.required]),
      dummy: new FormControl(''),
      amt : new FormControl(''),
      boardname: new FormControl('', [Validators.required]),
      nickName: new FormControl('', [Validators.required]),
      terms: new FormControl('', [Validators.required]),
      billerMonth: new FormControl('', [Validators.required]),
     
    }

    for(let i = 0 ; i < this.autharray.length ; i++){
      form["consumerNumber" + (i +1 ) ] = new FormControl('')
    }
    return  new FormGroup(form)
  }


  boardTypeSelection(item){
    console.log("item" + JSON.stringify(item))
   // this.onSelectOption()
    this.selectedBoard = item ;
    //this.registerBillerForm.setValue({boardname: item.billerId})
    this.addBillReminderForm.get('boardname').setValue(item.biller_name);
    this.selectedBillerName = item.biller_name
    this.addBillReminderForm = this.regengerateForm()
    this.billerid = item.billerid
    this.logoUrl = item.biller_logo;
    this.billertype = item.biller_type
    if(item.authenticators.map((object:any) => object.optional).indexOf("N") == -1){
      this.autharray.push(item.authenticators[0]) 
   
    }else{
      this.autharray = item.authenticators;
    }
    this.addBillReminderForm = this.regengerateForm()
    this.addBillReminderForm.get('boardname').setValue(item.biller_name);
    for(var i =0 ; i < this.autharray.length ; i ++){
     
      
      this.addBillReminderForm.get('consumerNumber' +  this.autharray[i].seq ).setValidators([Validators.required, Validators.pattern(this.autharray[i].regex)]);
      this.addBillReminderForm.get('consumerNumber' +  this.autharray[i].seq).updateValueAndValidity();  
     
    }
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

    
    this.billerLogo = item.biller_logo;
    // for(var i =0 ; i < 6 ; i ++){
    //   this.addBillReminderForm.get('consumerNumber' +  item.authenticators[i].seq ).clearValidators();
    //   this.addBillReminderForm.get('consumerNumber' +  item.authenticators[i].seq).updateValueAndValidity();  
    // }
    // for(var i =0 ; i < item.authenticators.length ; i ++){
    //   console.log('consumerNumber' +  item.authenticators[i].seq )
      
    //   this.addBillReminderForm.get('consumerNumber' +  item.authenticators[i].seq ).setValidators([Validators.required, Validators.pattern(item.authenticators[i].regex)]);
    //   this.addBillReminderForm.get('consumerNumber' +  item.authenticators[i].seq).updateValueAndValidity();  
    // }

    if(item.biller_type != "BILLER"){
    
      this.addBillReminderForm.get('amt' ).setValidators([Validators.required]);
      this.addBillReminderForm.get('amt').updateValueAndValidity(); 
    }else{
    
      this.addBillReminderForm.get('amt' ).clearValidators();
      this.addBillReminderForm.get('amt').setValue('0.00');
      this.addBillReminderForm.get('amt').updateValueAndValidity(); 
    }
    this.billSampleURL = item.biller_bill_copy

    this.addBillReminderForm.get('boardname').updateValueAndValidity();  
  }

  onCategorySelect(category){
    this.selectedCategory= category
    this.selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
    this.finalBillerList =[]
    this.stateList = []
    this.autharray =[]
    this.logoUrl = '';
    this.billSampleURL = '';
    this.addBillReminderForm.get('boardname').reset();
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
  errorCallBack(c,a){


  }

  onamtchange(amt){
    this.addBillReminderForm.get('amt').setValue(amt);
    this.formatCurrency(amt)
  }

  creditcardInput(numb){
    console.log("numb" + numb)
    this.addBillReminderForm.get('consumerNumber1').setValue(numb);
    this.ccNumber = numb.match(/.{1,4}/g)
    this.addBillReminderForm.get('dummy').setValue(this.ccNumber.join(' ')); 

    console.log("this.ccNumber" + this.ccNumber)
  }

  formatCurrency(amt){
   
    console.log("amt" + amt)
    let amts = this.customCurrencyPipe.transform(amt, 'decimal').replace(/[^.0-9]+/g, '');
    console.log(amts)
    this.inputAmt = amts
    this.formValidation.formatCurrencybbps(amt, this.addBillReminderForm);
  }
  filterBiller(value){
    
  
     console.log(value)
      if(value.length > 0){
        // $('#board-name').show();
        this.hideList = false
        this.filteredBillerList = this.finalBillerList.filter(function (el) {
       //   console.log(el.biller_legal_name.toLowerCase()  + " " +  value.toLowerCase())
  
           if(el.biller_name.toLowerCase().includes(value.toLowerCase())){
            return el
           }
                
        });
        console.log(" this.filteredBillerList " +  this.filteredBillerList )
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
