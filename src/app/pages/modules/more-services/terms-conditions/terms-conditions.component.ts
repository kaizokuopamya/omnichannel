import { Component, Input, OnInit, Output } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditonsComponent {
  @Input() termsConditionType:string = '';
  termsConditionForm : FormGroup;
  website_link:any;
  constructor(
    private commonMethods : CommonMethods,
    public dataService : DataService,
    private constant: AppConstants,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    console.log("Rgistration Type :: ", this.termsConditionType)
    this.website_link =this.constant.key_WEBSITE_link;
  }

  buildForm(){
    if(this.termsConditionType != 'termsConditionRegistration'){
      this.termsConditionForm = new FormGroup({
        terms: new FormControl('', [Validators.required])
      })
    }else{
      this.termsConditionForm = new FormGroup({
        terms: new FormControl('')
      })
    }
  
  }

  openPopupTerms(){
    this.commonMethods.openPopup('div.terms-conditions-popup')
  }

  closeTerms(){
    this.commonMethods.termAccepted(this.termsConditionForm?.value.terms);
    this.commonMethods.closePopup('div.popup-bottom.lg-popup.terms-conditions-popup');   
  }

  

  validateForm(){
    if(this.termsConditionForm.invalid){
      this.termsConditionForm.get('terms').markAsTouched();
  }
}

submit(){
  if(this.termsConditionForm.valid){
    this.commonMethods.termAccepted(this.termsConditionForm.value.terms);
    this.commonMethods.closeAllPopup();
   
   }else{
     this.validateForm();
  }
}
}

