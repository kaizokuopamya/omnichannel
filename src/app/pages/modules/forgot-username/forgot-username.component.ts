import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { ForgotUsernameService } from './forgot-username.service';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernameComponent implements OnInit {
  sessionDecryptKey: any;
  todayDate: any;
  forgotUsernameForm: FormGroup;

  constructor(private router: Router,
    public dataService : DataService,
    public loader: pageLoaderService,
    public commonMethod: CommonMethods,
    private http: HttpRestApiService,
    private forgotUserNameService:ForgotUsernameService,
    private encryptDecryptService: EncryptDecryptService,
    public datePipe: DatePipe,
    private location : Location,
    private constant: AppConstants,) { }


  ngOnInit(): void {
    this.buildForm();
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    var route = this.constant.getPlatform()== 'web'? "login" : "loginMobile";
     history.pushState({}, route, this.location.prepareExternalUrl(route));
     history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
  }
  submitForm(){
    console.log("Formdata=========",this.forgotUsernameForm.value)

    if(this.forgotUsernameForm.valid){
      this.forgotUserName();
    }
    else {
      this.validateForm()
    }
  }
  validateForm() {
    if (this.forgotUsernameForm.invalid) {
      this.forgotUsernameForm.get('customerID').markAsTouched();
      this.forgotUsernameForm.get('mobile').markAsTouched();
      this.forgotUsernameForm.get('dob').markAsTouched();
      return;
    }
  }

  buildForm() {
      this.forgotUsernameForm = new FormGroup({
        customerID: new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$"), Validators.minLength(4)]),
        mobile : new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
        dob: new FormControl('', [Validators.required]),
      });
  }
  
  goToLogin(){
    if(this.constant.getPlatform()=="web"){
      this.router.navigateByUrl('/login');
    }
    else{
      this.location.back();
    }
  }

  forgotUserName()
  {
    var param=this.forgotUserNameService.getForgotUserName(this.forgotUsernameForm.value)
    let deviceID = this.constant.deviceID;
    this.forgotUserNameApiCall(param,deviceID)
  }

  forgotUserNameApiCall(param,deviceID)
  {
    let extraParams = {showErrorPopup :true};
    this.http.callBankingAPIService(param,deviceID,this.constant.serviceName_FORGOTUSERNAME,extraParams).subscribe(data=>{
    console.log(data);
    var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.dataService.refId = data.RRN;
        this.dataService.successFull="Username Sent Successfully";
        this.dataService.successMsg ="Your username has been sent to your registered mobile number";
        var sessionKey = this.encryptDecryptService.decryptText(this.sessionDecryptKey, resp.Session);
        console.log('sessionKey', sessionKey);
        this.router.navigateByUrl('/successPage');
      }
    },(error)=>{
      console.log(error);
      
     });
  }

  backToPrevPage(){
    this.location.back() ;
  }

}
