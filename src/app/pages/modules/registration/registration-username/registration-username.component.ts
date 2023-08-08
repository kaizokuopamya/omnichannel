import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { RegistrationUsernameService } from './registration-username.service';
import {DataService} from 'src/app/services/data.service';

@Component({
  selector: 'app-registration-username',
  templateUrl: './registration-username.component.html',
  styleUrls: ['./registration-username.component.scss']
})
export class RegistrationUsernameComponent {
  @Output() nextEvent2 = new EventEmitter<number>();
  public formErrorsstep3 = {
    username: '',
    password: '',
    confPassword: ''
  };

  registrationFormstep3: FormGroup;
  isuserNameVerfied: any;
  userAvailabilityChecked:boolean = false; 
  notclickedflag:boolean = false
  isuseravailable:boolean = false;
  custNumber: any 

  
  constructor(
    public dataService: DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    private formValidation: FormValidationService,
    private regVerifyService: RegistrationUsernameService,
    private constant:AppConstants,
    private commonMethod:CommonMethods,
    private storage : LocalStorageService) { }

    ngOnInit(): void {
      this.initialization();
    }
  
    /** Initialization process */
    initialization() {
      console.log(this.dataService.registrationData)
      this.buildForm();
      this.bindForm();
    }
  
  
    bindForm(){
      this.registrationFormstep3.patchValue({
        username: this.dataService.regFeildData.username,
        password: this.dataService.regFeildData.password,
        confPassword: this.dataService.regFeildData.confPassword
      });
    }
  
    /**
     * Function for building the reactive forms
     */
    buildForm() {
      this.registrationFormstep3 = new FormGroup({
        username: new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(20)]),
        password: new FormControl('', [Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),Validators.minLength(8),Validators.maxLength(20)]),
        confPassword: new FormControl('', [Validators.required,Validators.minLength(8)]),
      },{
        validators: [this.password.bind(this)]
      });
  
      this.registrationFormstep3.valueChanges.subscribe((data) => {
        this.formErrorsstep3 = this.formValidation.validateForm(this.registrationFormstep3, this.formErrorsstep3, true);
      });
  
  
    }
    
    validatesForm() {
      if (this.registrationFormstep3.invalid) {
        this.formValidation.markFormGroupTouched(this.registrationFormstep3);
        return;
      }
    }



    submitStep3() {
      this.validatesForm();
      if (this.registrationFormstep3.valid) {
       
          if(this.userAvailabilityChecked){
            this.updateUserDetails(this.registrationFormstep3.value);
          }
        else{
          this.notclickedflag = true
        }
        //this.nextEvent2.next(3);
      } else {
        this.formErrorsstep3 = this.formValidation.validateForm(this.registrationFormstep3, this.formErrorsstep3, true);
      }
    }

    cancelbtn(){
    
      // this.prevEvent.next(3);
    }
  
     /**
     * Validation if password & confirm password doesn't match
     * @param formGroup 
     */
    password(formGroup: FormGroup) {
      const { value: password } = formGroup.get('password');
      const { value: confPassword } = formGroup.get('confPassword');
      return password === confPassword ? null : { passwordNotMatch: true };
    }


    /**
   * This function is invoked to update the user details for login
   * @param formdata 
   * @param channelType 
   */
  updateUserDetails(formdata) {
    //update login details request
    let paramReq = this.regVerifyService.getUpdateLoginDetailsParam(formdata);
    let extraParams = {showErrorPopup :true};
    this.http.callBankingAPIService(paramReq, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_UPDATELOGINDETAILS_reg,extraParams).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        this.dataService.regFeildData.username = this.registrationFormstep3.value.username,
        this.dataService.regFeildData.password = this.registrationFormstep3.value.password,
        this.dataService.regFeildData.confPassword = this.registrationFormstep3.value.confPassword
        console.log(data.responseParameter);
        // this.router.navigateByUrl('/registrationSecurityQuestion');
        this.nextEvent2.next(3);
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    },(error)=>{
      console.log(error);
    });
  }

    /**
 * function to called on unsuccessfull responce
 * @subActionId
 * @resp
 */
    errorCallBack(subActionId, resp) {
      if (resp.opstatus == "02" || resp.opstatus == "03") {
     
      }
        this.dataService.information = resp.Result;
        this.dataService.informationLabel = 'INFORMATION';
        this.dataService.primaryBtnText = 'OK';
        this.commonMethod.openPopup('div.popup-bottom.show-common-info');
    }


    onUserChange(value){
  
      this.isuserNameVerfied=false;
      this.isuseravailable = false
    this.userAvailabilityChecked = false;
    }

    checkAvailability(){
      let paramReq = this.regVerifyService.getCheckAvaiablityParam(this.registrationFormstep3.value.username.toLowerCase())
    
      this.userAvailabilityChecked = false;
      this.notclickedflag = false;
      let extraParams = {showErrorPopup :true};
      this.http.callBankingAPIService(paramReq, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CHECKOMNIUSERNAME_reg,extraParams).subscribe(data => {
        console.log(data);
        var resp = data.responseParameter
        console.log(data.responseParameter);
        if (resp.opstatus == "00") {
          this.userAvailabilityChecked = true
          this.isuserNameVerfied = true;
          this.isuseravailable = false
        }
        else {
          if(!this.isuserNameVerfied){
            this.isuseravailable = true;
          }else{
            this.isuseravailable = false;
         
          }
        }
      },(error)=>{
        console.log(error);
      });
    }

    usernamepolicy(){
      this.commonMethod.openPopup("div.username-popup")
    }
  
    passwordpolicy(){
      this.commonMethod.openPopup("div.password-popup")
    }


}
