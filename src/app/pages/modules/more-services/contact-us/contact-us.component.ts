import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { ContactUsService } from './contact-us.service';
declare var $ :any;
declare var showToastMessage: any;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  callbackForm: FormGroup;
  headerContact:any = [];
  contactCenter:any = [];
  visitedURL = "";
  headOffDepartment:any = [];
  upiHelpline: any;
  callbackdata;
  callbackRequestFlag:boolean = false;
  referenceNo;
  tollFreeNumber;
  blockATMDebitCard;
  requestCallback;
  emailID;
  website_link:any

  phoneBankingServicesNo;
  balanceEnquiryNo;
  debitFreezeAccountNo;
  response:any = [];
  

  constructor(
    public DataService:DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    private constant: AppConstants,
    public localStorage: LocalStorageService,
    private contactUsService: ContactUsService,
    private router: Router,
    public commonMethods: CommonMethods,
    private location: Location,
    private formValidation: FormValidationService,
    private ngZone: NgZone
  ) { }


  ngOnInit(): void {
    this.ngZone.run(() => {
      if(this.DataService.bezellessIphone) {
        $("#mainDiv").removeClass("pre-login");
      }
    });
    var param = this.contactUsService.getcontactUsParam();
    this.contactUsApiCall(param);
    this.buildForm();
    this.website_link =this.constant.key_WEBSITE_link;
    
  }
  
  buildForm(){
    this.callbackForm = new FormGroup({
      mobNumber: new FormControl('',[Validators.required, Validators.pattern(/^[6-9]\d{9}$/), Validators.minLength(10)]),
      language: new FormControl('',[Validators.required]),
      timeSlot: new FormControl('',[Validators.required]),

    })
  }
   /**
   * api call to load contact details
   */
  contactUsApiCall(param){
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_GETCONTACTUSLIST).subscribe(data => {
      console.log("CONTACT US API RESPONSE => ");
      console.log(data);
      var resp = data.responseParameter
      this.response = data.set
      console.log(this.response,'this.response')
      if (resp.opstatus == "00") {
        console.log("data.set.records" + data.set.records);
        data.set.records.forEach(el => {
          if(el.contactType == "Headers"){
            this.headerContact.push(el);
            console.log("HEADER ::::: ", this.headerContact)
          }else if(el.contactType == "Contact Center"){
            this.contactCenter.push(el);
          }else if(el.contactType == "Head Office Department"){
            this.headOffDepartment.push(el);
          } else if (el.contactType == "Visit URL") {
            this.visitedURL = el.phoneNumber;
          }
        });
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }
  openCallBAckPoupup(){
    this.callbackForm.reset();
    this.buildForm();
    this.commonMethods.openPopup('div.collectPhoneNo')
  }
  validatesForm() {
    if (this.callbackForm.invalid) {
      this.formValidation.markFormGroupTouched(this.callbackForm);
      return;
    }
  }
  requestCallbackService(){
    this.validatesForm();


    if(this.callbackForm.valid){
    this.commonMethods.closeAllPopup() ;
    var param = this.contactUsService.callbackParam(this.callbackForm.value);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_CALLUSBACK).subscribe(data => {
      console.log("CONTACT US API RESPONSE => ");
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        this.callbackRequestFlag = true;
        this.commonMethods.openPopup('div.collectPhoneNo');
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });    
  }
}
  openWebsite(){
    if (!this.DataService.isCordovaAvailable) window.open(this.constant.val_website_url);
    //else cordova.InAppBrowser.open("https://www.janatabankpune.com", '_blank', 'location=no');
  }

  /**
   * function to called on unsuccessfull responce
   * @subActionId
   * @resp
   */
  errorCallBack(subActionId, resp) {
    showToastMessage(resp.Result,"error");
  }

  faqNavigate(){
    this.router.navigateByUrl('/omniFaq');
  }
  /**
   * navigate to login page
   */
   cancelContact(){
    this.location.back();
  }

  openPopup(value){
    switch(value){
      case 'debitFreeze' :
          this.commonMethods.openPopup('div.debit-freeze-popup')
        break ;

      case 'debitCardBlock':
          this.commonMethods.openPopup('div.atm-card-block-popup')
        break ;
    }
  }

 closePopup(){
   this.commonMethods.closeAllPopup();
   setTimeout(() => { this.callbackRequestFlag = false;},400);
 }

 complaintRegister(){
  this.router.navigate([]).then(result => { window.open(this.constant. val_COMPLAINTLINK, '_blank'); });
 }

}