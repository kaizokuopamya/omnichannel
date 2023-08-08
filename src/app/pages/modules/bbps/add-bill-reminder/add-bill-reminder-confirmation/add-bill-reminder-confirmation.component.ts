import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { AppConstants } from 'src/app/app.constant';
import {AddBillReminderConfirmationService} from './add-bill-reminder-confirmation.service'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {  Location } from '@angular/common';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
@Component({
  selector: 'app-add-bill-reminder-confirmation',
  templateUrl: './add-bill-reminder-confirmation.component.html',
  styleUrls: ['./add-bill-reminder-confirmation.component.scss']
})
export class AddBillReminderConfirmationComponent implements OnInit {

  constructor( private router:Router, 
    private http: HttpRestApiService, 
    public DataService: DataService , 
    public location: Location,
    private constant:AppConstants,
    private storage :LocalStorageService,
    private addBillReminderConfirmationService : AddBillReminderConfirmationService) { }


  ngOnInit(): void {
 
  }

  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
  onConformationClick(){

    let param = this.addBillReminderConfirmationService.addBillReminderparam(this.DataService.addBillReminderData)
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSADDREMINDER,{showErrorPopup:false} ).subscribe(data => {
      // console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data;
      console.log("AddBillerSERVIVE " +  JSON.stringify(resp))
      this.DataService.addbillerConfirmation = resp
      this.goToPage("retailAddBillReminderSuccess")
    })
  }
}
