import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { ForgotPasswordSetPasswordService } from './forgot-password-set-password.service';
import { Location } from '@angular/common';

declare var showToastMessage: any;

@Component({
  selector: 'app-forgot-password-set-password',
  templateUrl: './forgot-password-set-password.component.html',
  styleUrls: ['./forgot-password-set-password.component.scss']
})
export class ForgotPasswordSetPasswordComponent implements OnInit {
  setPasswordForm:FormGroup;
  sessionDecryptKey: any;
  

  constructor(private router: Router,
    private commonMethods: CommonMethods,
    private dataService: DataService,
    public  translate: TranslatePipe,
    private constant: AppConstants,
    private http: HttpRestApiService,
    private forgotPasswordSetPasswordService:ForgotPasswordSetPasswordService,
    public location : Location,
    ) { }

  ngOnInit(): void {
    var route = this.constant.getPlatform()== 'web'? "login" : "loginMobile"
    this. buildForm();
    history.pushState({}, this.dataService.previousPageUrl, this.location.prepareExternalUrl(this.dataService.previousPageUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));

  }

  buildForm() {
    this.setPasswordForm = new FormGroup({

      setPassword: new FormControl('', [Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),Validators.minLength(8),Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required,Validators.minLength(8)]),
    },{
      validators: [this.password.bind(this)]
    });

  }
  submitForm(){
    console.log("Formdata=========",this.setPasswordForm.value)
    if(this.setPasswordForm.valid) {
        if(this.setPasswordForm.value.setPassword == this.setPasswordForm.value.confirmPassword) {
          this.setPassword();
        } else {
          showToastMessage('New and Confirm Password does not match', 'error');
        }
    } else {
      this.validateForm()
    }
  }

  validateForm() {
    if (this.setPasswordForm.invalid) {

      this.setPasswordForm.get('setPassword').markAsTouched();
      this.setPasswordForm.get('confirmPassword').markAsTouched();
      return;
    }
  }
  prevtab(){
    this.router.navigateByUrl('/ForgotPassword');
  }

  setPassword() {
    var param=this.forgotPasswordSetPasswordService.getSetForgoatPassword(this.setPasswordForm.value)
    //let deviceID = "9";
    let deviceID = this.constant.deviceID
    this.setPasswordApiCall(param,deviceID)
  }

  setPasswordApiCall(param,deviceID) {
    let extraParams = {showErrorPopup :true};
    this.http.callBankingAPIService(param,deviceID,this.constant.serviceName_UPDATELOGINDETAILS_reg,extraParams).subscribe(data=>{
    console.log(data);
    var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.dataService.refId = resp.RRN;
        this.dataService.successFull="Password Update Completed";
         this.dataService.successMsg =resp.Result;
        this.router.navigateByUrl('/successPage');
      }
    },(error)=>{
      console.log(error); });
  }

  goToLogin() {
    if(this.constant.getPlatform()== 'web'){
      this.router.navigateByUrl('/login');
    }
    else{
      this.location.back();
    }
  }

  passwordpolicy(){
    this.commonMethods.openPopup("div.password-popup")
  }
  closePopups(){
    this.commonMethods.closePopup("div.password-popup")
  
  }

  backToPrevPage(){
    this.location.back() ;
}

/**
   * Validation if password & confirm password doesn't match
   * @param formGroup 
   */
 password(formGroup: FormGroup) {
  const { value: setPassword } = formGroup.get('setPassword');
  const { value: confirmPassword } = formGroup.get('confirmPassword');
  return setPassword === confirmPassword ? null : { passwordNotMatch: true };
}

}


