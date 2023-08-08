import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { Location } from '@angular/common';
import { ForgotPasswordService } from './forgot-password.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  sessionDecryptKey: any;
  isFromForgotMPIN = false;
  
  forgotpassword: FormGroup;

  constructor(private router: Router,
    private dataService: DataService,
    public translate: TranslatePipe,
    private constant: AppConstants,
    private http: HttpRestApiService,
    private encryptDecryptService: EncryptDecryptService,
    public location: Location,
    private forgotPasswordService :ForgotPasswordService,
  ) { }


  ngOnInit(): void {
    this.isFromForgotMPIN = this.dataService.fromForgotMPIN;
    var route = this.constant.getPlatform() == 'web' ? "login" : "loginMobile"
    history.pushState({}, route, this.location.prepareExternalUrl(route));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.buildForm();
  }
  submitForm() {
    console.log("Formdata=========", this.forgotpassword.value)

    this.validateForm();
    if (this.forgotpassword.valid) {
      this.dataService.forgotPassUsername = this.forgotpassword.value.username.toLowerCase();
      console.log('forgot password username: ', this.dataService.forgotPassUsername);
      this.forgotPassword();
    }
  }
  buildForm() {
    this.forgotpassword = new FormGroup({
      username: new FormControl('', [Validators.required]),
      custId: new FormControl('', [Validators.required, Validators.pattern(/^(?!0{9})[0-9][0-9]{8}$/)]),
      accNo: new FormControl('', [Validators.required, Validators.pattern(/^(?!0{14})[0-9][0-9]{13}$/)]),
    });
  }
  validateForm() {
    if (this.forgotpassword.invalid) {
      this.forgotpassword.get('username').markAsTouched();
      return;
    }
  }
  goToLogin() {
    if (this.constant.getPlatform() == "web") {
      this.router.navigateByUrl("/login")
    }
    else {
      this.location.back();
    }
  }
  forgotPassword() {
      var param = this.forgotPasswordService.getForgotPassowrd(this.forgotpassword.value);
      this.dataService.userDetails = {'cifNumber':this.forgotpassword.value.custId};
      let deviceID = this.constant.deviceID;
      this.forgotPasswordApiCall(param, deviceID);
  }

  forgotPasswordApiCall(param, deviceID) {
    let extraParams = {showErrorPopup :true};
    this.http.callBankingAPIService(param, deviceID, this.constant.serviceName_FORGOTPASSWORD,extraParams).subscribe(data => {
      console.log(data);
      // var resp = data.responseParameter
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
       var sessionKey = this.encryptDecryptService.decryptText(this.sessionDecryptKey,resp.Session)
        console.log('sessionKey', sessionKey);
        if (this.isFromForgotMPIN) {
          this.dataService.forgotPassUsername = this.forgotpassword.value.username.toLowerCase();
          this.router.navigateByUrl('/forgotMpinMob')
        } else {
          this.dataService.forgotPassDtl = this.forgotpassword.value;
          this.router.navigateByUrl('/forgotPasswordAuth');
        }
      }
    },(error)=>{
      console.log(error);});
  }
  backToPrevPage() {
    this.location.back();
  }
}


