import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { Location, DatePipe } from '@angular/common';
import * as moment from 'moment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ViewNomineeDetailsService } from './view-nominee-details.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-view-nominee-details',
  templateUrl: './view-nominee-details.component.html',
  styleUrls: ['./view-nominee-details.component.scss']
})
export class ViewNomineeDetailsComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    private viewNomineeService: ViewNomineeDetailsService,
    private location: Location,
    private datePipe: DatePipe,
    public dataService: DataService
  ) { }

  accountData: any;
  nomineeList: any = [];
  date: any;
  relationname: any;
  nomineeAddress1: any;
  nomineeAddress2: any;
  stateValue: any;
  cityValue: any;
  stateList: any;
  city: any;
  stateCode: any = '';
  cityCode: any = '';
  nomineeCityList = [];
  currentDate: any = moment().toDate();
  nomineeAge: number = 18;
  minorFlag: any;


  ngOnInit(): void {

    this.accountData = this.location.getState()
    if (this.accountData) {
      this.accountData = {}
      this.accountData.account = this.dataService.selectedNomineeAccNo
    }
    console.log("Account Data :: ", this.accountData)
    this.getNomineeDetails();
    console.log("Nominee List :: ", this.nomineeList)

  }

  updateNominee() {
    this.router.navigateByUrl('/' + 'updateNominee', { state: { nominee: this.nomineeList, account: this.accountData.account } });
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  onDateChange(event) {
    var diff = Math.floor(this.currentDate - event);
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    this.nomineeAge = Math.floor(months / 12);

    if (this.nomineeAge < 18) {
      this.minorFlag = 'Y'
    } else {
      this.minorFlag = 'N'
    }
    this.dataService.minorFlagNominee = this.minorFlag;
  }

  //Nominee function  
  getNomineeDetails() {
    var param = this.viewNomineeService.getNomineeData(this.accountData.account, this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_InquiryNomineeValidation).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.nomineeList = data.set['records'];
        if (this.nomineeList.nomineeDob != '' && this.nomineeList.nomineeDob != undefined) {
          this.onDateChange(this.datePipe.transform((this.nomineeList[0].nomineeDob).replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"), 'dd/MM/yyyy'));
        } else {
          this.dataService.minorFlagNominee = 'N'
        }
        this.date = this.datePipe.transform((this.nomineeList[0].nomineeDob).replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"), 'dd/MM/yyyy')
        this.relationname = resp.nomineeRelationship
        this.nomineeAddress1 = this.nomineeList[0].nomineeAddress1;
        this.nomineeAddress2 = this.nomineeList[0].nomineeAddress2;
        this.stateValue = resp.stateCode
        this.cityValue = resp.cityCode
        this.getState(this.stateValue)
      }

    }, (error) => {
      console.log(error);
    });
  }


  getState(id) {
    let stateListParams = this.viewNomineeService.getStateListParams();
    this.http.callBankingAPIService(stateListParams, this.constant.deviceID, this.constant.serviceName_GETSTATES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          var objIndex = data.set.records.findIndex(
            (obj) => obj.ID == id
          );
          this.stateValue = data.set.records[objIndex].state
          this.getCity(id)

        }
      }

    }, (error) => {
      console.log(error);
    });
  }

  getCity(stateId) {

    let cityListParams = this.viewNomineeService.getCityListParams(stateId);
    this.http.callBankingAPIService(cityListParams, this.constant.deviceID, this.constant.serviceName_GETCITIES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          var objIndex = data.set.records.findIndex(
            (obj) => obj.ID == this.cityValue
          );
          this.cityValue = data.set.records[objIndex].city
        }
      }

    }, (error) => {
      console.log(error);
    });
  }


}

