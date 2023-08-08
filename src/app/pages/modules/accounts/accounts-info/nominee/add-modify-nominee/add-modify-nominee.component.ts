import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe, Location } from '@angular/common'
import * as moment from 'moment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AddModifyNomineeService } from './add-modify-nominee.service';
import { DataService } from 'src/app/services/data.service';
import { DropDownMaster } from './add-modify-nominee.model';
import { CommonMethods } from 'src/app/services/common-methods';


@Component({
  selector: 'app-add-modify-nominee',
  templateUrl: './add-modify-nominee.component.html',
  styleUrls: ['./add-modify-nominee.component.scss']
})

export class AddModifyNomineeComponent implements OnInit {

  constructor(
    private router: Router,
    public DataService: DataService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    private nomineeDetailService: AddModifyNomineeService,
    private location: Location,
    private datePipe: DatePipe,
    private commonMethod: CommonMethods

  ) { }
  nomineeDetailsForm: FormGroup;
  stateList: any = [];
  stateNomineeList: any = [];
  cityList = [];
  gardianTypeList = [];
  relationShipList: any;
  nomineeData: any = [];
  nomineeAge: number = 18;
  currentDate: any = moment().toDate();
  accountNo: any;
  minorFlag: any;
  defaultDate: any;

  max = new Date();


  ngOnInit(): void {
    this.accountNo = this.DataService.nomineeType == 'ADD' ? this.DataService.selectedNomineeAccNo : this.location.getState()
    this.buildForm();
    this.getRelationShip();
    if (this.DataService.nomineeType == 'ADD') {
      this.setModifyState();
    }
  }

  onDateChange(event) {
    var diff = Math.floor(this.currentDate - event);
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    this.nomineeAge = Math.floor(months / 12);

    if (this.nomineeAge < 18) {
      this.minorFlag = 'Y'
      this.getGardianType();
    } else {
      this.minorFlag = 'N'

    }

    this.DataService.minorFlagNominee = this.minorFlag;
  }


  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  buildForm() {

    if (this.DataService.nomineeType == 'ADD') {
      this.nomineeDetailsForm = new FormGroup({
        nomineeName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z_ ]*$")]),
        nomineeRelationship: new FormControl('', [Validators.required]),
        dob: new FormControl('', [Validators.required]),
        guardianName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z_ ]*$")]),
        guardianRelationShip: new FormControl('', [Validators.required]),
        guardianAddress: new FormControl('', [Validators.required]),
        address1: new FormControl('', [Validators.required]),
        address2: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        pincode: new FormControl('', [Validators.required])

      });
    } else {
      this.nomineeDetailsForm = new FormGroup({
        nomineeName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z_ ]*$")]),
        nomineeRelationship: new FormControl('', [Validators.required]),
        communicationAddress: new FormControl(''),
        dob: new FormControl('', [Validators.required]),
        guardianName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z_ ]*$")]),
        guardianAddress: new FormControl('', [Validators.required]),
        guardianRelationShip: new FormControl('', [Validators.required]),
        address1: new FormControl('', [Validators.required]),
        address2: new FormControl(''),
        state: new FormControl(''),
        city: new FormControl(''),
        pincode: new FormControl('')
      });
      this.setNomineeDtl();
    }
  }

  ValidateForm() {
    this.guradianValidation();
    if (this.nomineeDetailsForm.invalid) {
      this.nomineeDetailsForm.get('nomineeName').markAsTouched();
      this.nomineeDetailsForm.get('nomineeRelationship').markAsTouched();
      this.nomineeDetailsForm.get('communicationAddress').markAsTouched();
      this.nomineeDetailsForm.get('dob').markAsTouched();
      this.nomineeDetailsForm.get('guardianName').markAsTouched();
      this.nomineeDetailsForm.get('guardianRelationShip').markAsTouched();
      this.nomineeDetailsForm.get('guardianAddress').markAsTouched();
      this.nomineeDetailsForm.get('address1').markAsTouched();
      // this.nomineeDetailsForm.get('address2').markAsTouched();
      // this.nomineeDetailsForm.get('state').markAsTouched();
      // this.nomineeDetailsForm.get('city').markAsTouched();
      // this.nomineeDetailsForm.get('pincode').markAsTouched();

      return;
    }
  }

  guradianValidation() {
    if (this.nomineeAge < 18) {
      this.nomineeDetailsForm.get('guardianName').setValidators([Validators.required, , Validators.pattern("[a-zA-Z_ ]*$")]);
      this.nomineeDetailsForm.get('guardianAddress').setValidators([Validators.required]);
      this.nomineeDetailsForm.get('guardianRelationShip').setValidators([Validators.required]);


      this.nomineeDetailsForm.get('guardianName').updateValueAndValidity();
      this.nomineeDetailsForm.get('guardianAddress').updateValueAndValidity();
      this.nomineeDetailsForm.get('guardianRelationShip').updateValueAndValidity();

    } else {
      this.nomineeDetailsForm.get('guardianName').clearValidators();
      this.nomineeDetailsForm.get('guardianAddress').clearValidators();
      this.nomineeDetailsForm.get('guardianRelationShip').clearValidators();


      this.nomineeDetailsForm.get('guardianName').updateValueAndValidity();
      this.nomineeDetailsForm.get('guardianAddress').updateValueAndValidity();
      this.nomineeDetailsForm.get('guardianRelationShip').updateValueAndValidity();
      this.nomineeDetailsForm.patchValue({
        guardianRelationShip: '',
      });
    }
  }



  errorCallBack(subActionId, resp) {
    /* Calling common information popup */
    this.DataService.information = resp.Result;
    this.DataService.informationLabel = 'INFORMATION';
    this.DataService.primaryBtnText = 'OK';
    this.commonMethod.openPopup('div.popup-bottom.show-common-info');
  }

  getCity(stateId) {
    this.cityList = [];
    let cityListParams = this.nomineeDetailService.getCityListParams(stateId);
    this.http.callBankingAPIService(cityListParams, this.constant.deviceID, this.constant.serviceName_GETCITIES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          this.cityList = data.set.records;
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  setNomineeDtl() {
    let tempNomineeData = this.location.getState()
    console.log("temp data : ", tempNomineeData)
    console.log("city:::", tempNomineeData['nominee'][0].cityCode,)
    this.nomineeDetailsForm.patchValue({
      nomineeName: tempNomineeData['nominee'][0].nomineeName,
      nomineeRelationship: tempNomineeData['nominee'][0].nomineeRelation,
      dob: (tempNomineeData['nominee'][0].nomineeDob).split('-').join('/'),
      guardianName: tempNomineeData['nominee'][0].guardianName,
      guardianAddress: tempNomineeData['nominee'][0].guardianAddress,
      address1: tempNomineeData['nominee'][0].nomineeAddress1,
      address2: tempNomineeData['nominee'][0].nomineeAddress2,
    })
    try {
      this.defaultDate = new Date(this.datePipe.transform(this.dateFormat(tempNomineeData['nominee'][0].nomineeDob), 'MM/dd/yyyy'))
    }
    catch (e) {
    }
    this.onDateChange(this.defaultDate);
    this.DataService.minorFlagNominee = this.minorFlag;
    this.setModifyState()
  }

  dateFormat(e) {
    let date = e.split("-")[0];
    let month = e.split("-")[1];
    let year = e.split("-")[2];
    var convertedDate = new Date(month + '-' + date + '-' + year);
    console.log('converted Date: ', convertedDate);
    return convertedDate;
  }

  getRelationShip() {
    var param = this.nomineeDetailService.getDropDownMasterParam(DropDownMaster.NOMINEE_TYPE);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_GETREFCODE).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        if (data.hasOwnProperty('listofDataset')) {
          this.relationShipList = data.listofDataset[0].records;
        }
      }
      else {
        this.relationShipList = [
          { "DESCRIPTION": "Father", "ref_code": "1" },
          { "DESCRIPTION": "Mother", "ref_code": "2" },
          { "DESCRIPTION": "Daughter", "ref_code": "3" },
          { "DESCRIPTION": "Son", "ref_code": "4" },
          { "DESCRIPTION": "Brother", "ref_code": "5" },
          { "DESCRIPTION": "Sister", "ref_code": "6" }
        ]
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getGardianType() {
    var param = this.nomineeDetailService.getDropDownMasterParam(DropDownMaster.GUARDIAN_TYPE);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_GETREFCODE).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        if (data.hasOwnProperty('listofDataset')) {
          this.gardianTypeList = data.listofDataset[0].records;
        }
      }
      else {
        this.gardianTypeList = [
          { "DESCRIPTION": "Father", "ref_code": "1" },
          { "DESCRIPTION": "Mother", "ref_code": "2" },
          { "DESCRIPTION": "grandFather", "ref_code": "3" },
          { "DESCRIPTION": "Uncle", "ref_code": "4" }
        ]
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }


  setModifyState() {
    let tempNomineeData
    let stateListParams = this.nomineeDetailService.getStateListParams();

    if (this.DataService.nomineeType != 'ADD') { //MODIFY 
      this.cityList = [];
      this.stateNomineeList = []
      tempNomineeData = this.location.getState()
    }

    this.http.callBankingAPIService(stateListParams, this.constant.deviceID, this.constant.serviceName_GETSTATES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          this.stateList = data.set.records;
          this.stateNomineeList = data.set.records;

          if (this.DataService.nomineeType != 'ADD') {
            this.nomineeDetailsForm.patchValue({
              state: this.stateList.find(obj => (obj.ID == tempNomineeData['nominee'][0].stateCode)).ID,
              city: this.getCity(this.cityList.find(obj => (obj.ID == tempNomineeData['nominee'][0].cityCode))),
            })
            this.getModifyCity(this.stateList.find(obj => (obj.ID == tempNomineeData['nominee'][0].stateCode)).ID)
          }

        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);

      }
    }, (error) => {
      console.log(error);
    });
  }

  getModifyCity(stateId) {
    let tempNomineeData = this.location.getState()
    this.cityList = [];
    let cityListParams = this.nomineeDetailService.getCityListParams(stateId);
    this.http.callBankingAPIService(cityListParams, this.constant.deviceID, this.constant.serviceName_GETCITIES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          this.cityList = data.set.records;
          this.nomineeDetailsForm.patchValue({
            // state : this.stateList.find(obj => (obj.ID == tempNomineeData['nominee'][0].stateCode)).ID,
            city: this.cityList.find(obj => (obj.ID == tempNomineeData['nominee'][0].cityCode)).ID,

          })
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  /***  SUBMITTING NOMINEE DETAILS ****/

  nomineeDetailsSubmit() {
    this.guradianValidation();
    if (this.nomineeDetailsForm.valid) {
      var nomineeDob = this.datePipe.transform(this.nomineeDetailsForm.value.dob, 'dd-MM-yyyy');

      if (this.DataService.nomineeType == 'ADD') {
        this.DataService.commonOtpServiceType = this.constant.val_ADDNOMINEEDATA //OTP TYPE
        if (this.minorFlag == 'N') {
          this.nomineeDetailsForm.value.guardianName = '';
          this.nomineeDetailsForm.value.guardianAddress = '';
        }
        var stateCode = this.stateList.filter(obj => obj.ID == this.nomineeDetailsForm.value.state)[0].code;
        var cityCode = this.cityList.filter(obj => obj.ID == this.nomineeDetailsForm.value.city)[0].code;
        this.DataService.request = this.nomineeDetailService.getUpdateNomineeService(this.DataService.userDetails.cifNumber, this.accountNo, this.nomineeDetailsForm.value, this.minorFlag, nomineeDob, stateCode, cityCode);
        //this.DataService.nomineeDetailsData.nomineeFlag = 'addNominee'

      } else {
        this.DataService.commonOtpServiceType = this.constant.val_MODIFYNOMINEEDATA //OTP TYPE
        this.DataService.request = this.nomineeDetailService.getUpdateNomineeService(this.DataService.userDetails.cifNumber, this.accountNo.account, this.nomineeDetailsForm.value, this.minorFlag, nomineeDob);
        this.DataService.minorFlagNominee = this.minorFlag
      }

      var nomineeDtl = this.relationShipList.find(i => i.ref_code == this.nomineeDetailsForm.value.nomineeRelationship);
      var stateDtl = this.stateList.find(obj => (obj.ID == this.nomineeDetailsForm.value.state));
      var cityDtl = this.cityList.find(obj => (obj.ID == this.nomineeDetailsForm.value.city));

      this.DataService.nomineeDetailsData = this.nomineeDetailsForm.value;
      this.DataService.endPoint = this.constant.serviceName_ADDNOMINEEDATA;
      this.DataService.nomineeReceiptObj.minorFlag = this.DataService.nomineeDetailsData.minorFlag
      this.DataService.nomineeReceiptObj.nomineeFlag = this.DataService.nomineeDetailsData.nomineeFlag

      this.DataService.authorizeHeader = "Nominee Details";
      this.DataService.screenType = 'nomineeDetails';

      this.DataService.screenDetails = {
        'NOMINE_NAME': this.DataService.nomineeReceiptObj.nomineeName = this.DataService.nomineeDetailsData.nomineeName,
        'RELATIONSHIP_WITH_NOMINEE': this.DataService.nomineeReceiptObj.nomineeRelationship = nomineeDtl.DESCRIPTION,
        'GUARDIAN_NAME': this.DataService.nomineeReceiptObj.guardianName = this.DataService.nomineeDetailsData.guardianName ? this.DataService.nomineeDetailsData.guardianName : '-',
        'GUARDIAN_ADDRESS': this.DataService.nomineeReceiptObj.guardianAddress = this.DataService.nomineeDetailsData.guardianAddress ? this.DataService.nomineeDetailsData.guardianAddress : '-',
        'DATE_OF_BIRTH': this.DataService.nomineeReceiptObj.dateOfBirth = nomineeDob,
        'ADDRESS_LINE_1': this.DataService.nomineeReceiptObj.address1 = this.DataService.nomineeDetailsData.address1,
        'ADDRESS_LINE_2': this.DataService.nomineeReceiptObj.address2 = this.DataService.nomineeDetailsData.address2,
        'STATE': this.DataService.nomineeReceiptObj.state = stateDtl.state,
        'CITY': this.DataService.nomineeReceiptObj.city = cityDtl.city,
      }
      this.router.navigateByUrl('/otpsession');

    } else {
      this.ValidateForm();
    }
  }


}
