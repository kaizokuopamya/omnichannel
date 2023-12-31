import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { AppConstants } from '../../../../../app.constant';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import {RaiseComplainService} from './raise-complain.service';
import {BbpsService} from 'src/app/services/bbps.service'
import { LocalStorageService } from '../../../../../services/local-storage.service';
declare var $: any;
@Component({
  selector: 'app-raise-complaint',
  templateUrl: './raise-complaint.component.html',
  styleUrls: ['./raise-complaint.component.scss']
})
export class RaiseComplaintComponent implements OnInit , OnDestroy{

  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,
    private http : HttpRestApiService,
    public constant :AppConstants,
    private storage : LocalStorageService,
    private raiseComplainService : RaiseComplainService,
    private bbpsService: BbpsService) { }
    reasonSelection:any
    selectedComplaintType ='';
    searchByTypeModel = 'duration' ;
    participationTypeList:any
    transactionForm : FormGroup ;
    durationForm : FormGroup ;
    serviceForm : FormGroup ;
    complaintTypeList:any;
    billerCategory:any;
    stateList:any;
    finalBillerList:any;
    boardNameValue:any;
    selectedBillerName:any
    consumerLabel:any
    billSampleURL:any
    errorMsg:any;
    getComplaintReasonList:any;
    selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
    ngOnInit(): void {
      this.buildForm();
      this.DataService.getBreadcrumb('RAISE_COMPLAINT', this.router.url)
      // this.getComplaintType();
      // this.getParticipationType();
      // this.getBillerCategory()
      this.getcomplaintReason();
      this.DataService.isbbpsPage = true
    }
    ngOnDestroy() {
      this.DataService.isbbpsPage = false
      this.DataService.complaintbbpsrefNumber =''
    }
    buildForm(){
      // this.serviceForm = new FormGroup({
      //   participationType: new FormControl('', [Validators.required]),
      //   billerCategory: new FormControl('', [Validators.required]),
      //   billerLocation: new FormControl('', [Validators.required]),
      //   biller: new FormControl('', [Validators.required]),
      //   complaintReason: new FormControl('', [Validators.required]),
      //   complaintDescription: new FormControl('', [Validators.required]),
      // })

      // this.durationForm = new FormGroup({
      //   startDate: new FormControl('', [Validators.required]),
      //    endDate: new FormControl('', [Validators.required]),
      // });

      this.transactionForm = new FormGroup({
        mobNum:new FormControl (this.storage.getLocalStorage(this.constant.storage_mobileNo), [Validators.required]),
        compType:new FormControl ('Transaction'),
        refNumber : new FormControl (this.DataService.complaintbbpsrefNumber, [Validators.required]),
        complaintReason : new FormControl ('', [Validators.required]),
        complaintDescription : new FormControl ('', [Validators.required]),
      })
      if(this.DataService.complaintbbpsrefNumber){
        this.transactionForm.get('refNumber').setValue(this.DataService.complaintbbpsrefNumber);
      }
    }

    validateForm(){
          if (this.transactionForm.invalid) {
            this.transactionForm.get('refNumber').markAsTouched();
            this.transactionForm.get('complaintReason').markAsTouched();
            this.transactionForm.get('complaintDescription').markAsTouched();
            return;
          }
        
      }
      raiseComplaintSubmit(){
        // this.complaintTypeValidation() ;
          if(this.transactionForm.valid){
            console.log(this.transactionForm.value)
            this.DataService.complaintData = this.transactionForm.value
            this.goToPage('retailRaiseComplaintTransactionConfirmation')

          }else{
            this.validateForm () 
          }      
      }

      dummySelect(){
        this.commonMethod.openPopup('.complaint-select')

      }
      reasonSelectClick(){
        this.transactionForm.get('complaintReason').setValue(this.reasonSelection);
        this.commonMethod.closeAllPopup()
      }
      selectReason(item:any){
        this.reasonSelection =item
      }
    getcomplaintReason() {
      // alert(this.DataService.customerID)
      let param = this.raiseComplainService.getComplaintReason();
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
         console.log(JSON.parse(data.responseParameter.bbpsResponse));
        var resp = data.responseParameter;
        if (resp.opstatus == "00") {
           this.getComplaintReasonList = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.dispositionList
            console.log("this.getComplaintReasonParam "  + this.getComplaintReasonList)
          }
        else {
          
        }
      });
    }
    getBillerCategory() {
      let categoryListParam = this.bbpsService.getBillerCategories();
      this.http.callBankingAPIService(categoryListParam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
        console.log("sanal ==> " + data.responseParameter.bbpsResponse);
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
    onCategorySelect(category){
      this.selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
      this.finalBillerList =[]
      this.stateList = []
      this.serviceForm.get('billerLocation').reset();
      $('#board-name').slideUp();
      $('#board-name').parent().removeClass('active')
      let stateListParams = this.bbpsService.getLocationList(category);
      this.http.callBankingAPIService(stateListParams, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
        console.log(JSON.parse(data.responseParameter.bbpsResponse));
        var resp = data.responseParameter;
        if (resp.opstatus == "00") {
          console.log(data.responseParameter);
       
            this.stateList =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerLocationList
            console.log('State List: ', this.stateList);
        }
        else {
          this.errorCallBack(data.subActionId, resp);
        }
      });
    }
    onStateSelect(value){
      this.selectedBoard ={"biller_legal_name": 'Select Board' ,'billerid':'', 'biller_logo':''}
      this.finalBillerList =[]
      $('#board-name').slideUp();
      $('#board-name').parent().removeClass('active')
      console.log("selected state ===> " + value);
      // console.log( "response SANAL === >" +  this.httpBbpsApiCall(value))
      var param = this.bbpsService.getbillerlist(value , this.serviceForm.value.billerCategory)
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
    boardTypeSelection(item){
      this.onSelectOption()
      this.selectedBoard = item ;
      //this.registerBillerForm.setValue({boardname: item.billerId})
      this.serviceForm.get('biller').setValue(item.billerid);
      this.selectedBillerName = item.billerName
      $('#board-name').slideUp();
      $('#board-name').parent().removeClass('active')
      this.consumerLabel = item.authenticators[0].parameter_name
      // this.registerBillerForm.get('consumerNumber').setValidators([Validators.required, Validators.pattern(item.authenticators[0].regex)]);
      this.errorMsg =  item.authenticators[0].error_message
      this.billSampleURL = item.biller_bill_copy
      // this.serviceForm.get('consumerNumber').updateValueAndValidity();  
      this.serviceForm.get('biller').updateValueAndValidity();  
    }
  errorCallBack(r , e){

    }
    onSelectOption(){
        
      // if (e.stopPropagation) e.stopPropagation();
        $('#board-name').slideToggle();
        $('#board-name').parent().toggleClass('active')
   
  
    }


    goToPage(routeName) {
      this.router.navigateByUrl('/' + routeName);
    }


    
    goToPageCust(routeName) {
      this.router.navigateByUrl(routeName);
    }


    onComplaintTypeSelect(event) {
      this.selectedComplaintType = "";
      this.selectedComplaintType = event;

     
      
    }



   




  // complaintTypeValidation(){
  //   if(this.searchByTypeModel == 'duration' && this.selectedComplaintType == 'Transaction'){

  //     this.serviceForm.get('participationType').clearValidators();
  //     this.serviceForm.get('billerCategory').clearValidators();
  //     this.serviceForm.get('billerLocation').clearValidators();
  //     this.serviceForm.get('biller').clearValidators();
  //     this.serviceForm.get('complaintReason').clearValidators();
  //     this.serviceForm.get('complaintDescription').clearValidators();

  //     this.transactionForm.get('transactionNumber').clearValidators();
  //     this.transactionForm.get('complaintReason').clearValidators();
  //     this.transactionForm.get('complaintDescription').clearValidators();


  //     this.durationForm.get('startDate')?.setValidators([Validators.required]);
  //     this.durationForm.get('endDate')?.setValidators([Validators.required]);


  //     this.transactionForm.get('transactionNumber').updateValueAndValidity();
  //     this.transactionForm.get('complaintReason').updateValueAndValidity();
  //     this.transactionForm.get('complaintDescription').updateValueAndValidity();
  //     this.durationForm.get('startDate').updateValueAndValidity();
  //     this.durationForm.get('endDate').updateValueAndValidity();

  //     this.serviceForm.get('participationType').updateValueAndValidity();
  //     this.serviceForm.get('billerCategory').updateValueAndValidity();
  //     this.serviceForm.get('billerLocation').updateValueAndValidity();
  //     this.serviceForm.get('biller').updateValueAndValidity();
  //     this.serviceForm.get('complaintReason').updateValueAndValidity();
  //     this.serviceForm.get('complaintDescription').updateValueAndValidity();

  //   } else  if(this.searchByTypeModel == 'transaction' && this.selectedComplaintType == 'Transaction') {

  //     this.serviceForm.get('participationType').clearValidators();
  //     this.serviceForm.get('billerCategory').clearValidators();
  //     this.serviceForm.get('billerLocation').clearValidators();
  //     this.serviceForm.get('biller').clearValidators();
  //     this.serviceForm.get('complaintReason').clearValidators();
  //     this.serviceForm.get('complaintDescription').clearValidators();
  //     this.durationForm.get('startDate')?.clearValidators();
  //     this.durationForm.get('endDate')?.clearValidators();

  //     this.transactionForm.get('transactionNumber')?.setValidators([Validators.required]);
  //     this.transactionForm.get('complaintReason')?.setValidators([Validators.required]);
  //     this.transactionForm.get('complaintDescription')?.setValidators([Validators.required]);

  //     this.transactionForm.get('transactionNumber').updateValueAndValidity();
  //     this.transactionForm.get('complaintReason').updateValueAndValidity();
  //     this.transactionForm.get('complaintDescription').updateValueAndValidity();
  //     this.durationForm.get('startDate').updateValueAndValidity();
  //     this.durationForm.get('endDate').updateValueAndValidity();

  //     this.serviceForm.get('participationType').updateValueAndValidity();
  //     this.serviceForm.get('billerCategory').updateValueAndValidity();
  //     this.serviceForm.get('billerLocation').updateValueAndValidity();
  //     this.serviceForm.get('biller').updateValueAndValidity();
  //     this.serviceForm.get('complaintReason').updateValueAndValidity();
  //     this.serviceForm.get('complaintDescription').updateValueAndValidity();
    
  //   }else  if(this.selectedComplaintType == 'Service') { 
  //     this.serviceForm.get('participationType').setValidators([Validators.required]);
  //     this.serviceForm.get('billerCategory').setValidators([Validators.required]);
  //     this.serviceForm.get('billerLocation').setValidators([Validators.required]);
  //     this.serviceForm.get('biller').setValidators([Validators.required]);
  //     this.serviceForm.get('complaintReason').setValidators([Validators.required]);
  //     this.serviceForm.get('complaintDescription').setValidators([Validators.required]);
  //     this.durationForm.get('startDate')?.clearValidators();
  //     this.durationForm.get('endDate')?.clearValidators();
  //     this.transactionForm.get('transactionNumber').clearValidators();
  //     this.transactionForm.get('complaintReason').clearValidators();
  //     this.transactionForm.get('complaintDescription').clearValidators();

  //     this.transactionForm.get('transactionNumber').updateValueAndValidity();
  //     this.transactionForm.get('complaintReason').updateValueAndValidity();
  //     this.transactionForm.get('complaintDescription').updateValueAndValidity();
  //     this.durationForm.get('startDate').updateValueAndValidity();
  //     this.durationForm.get('endDate').updateValueAndValidity();
  //     this.serviceForm.get('participationType').updateValueAndValidity();
  //     this.serviceForm.get('billerCategory').updateValueAndValidity();
  //     this.serviceForm.get('billerLocation').updateValueAndValidity();
  //     this.serviceForm.get('biller').updateValueAndValidity();
  //     this.serviceForm.get('complaintReason').updateValueAndValidity();
  //     this.serviceForm.get('complaintDescription').updateValueAndValidity();
  //   }
  // }

 
 
}
