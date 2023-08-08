import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { AppConstants } from 'src/app/app.constant';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import {DeleteBillReminderConfirmationService} from './delete-bill-reminder-confirmation.service'
@Component({
  selector: 'app-delete-bill-reminder-confirmation',
  templateUrl: './delete-bill-reminder-confirmation.component.html',
  styleUrls: ['./delete-bill-reminder-confirmation.component.scss']
})
export class DeleteBillReminderConfirmationComponent implements OnInit {

  constructor(
    private router: Router, private http: HttpRestApiService, 
    public DataService: DataService,
    public commonMethod: CommonMethods,    private constant:AppConstants,
    private storage :LocalStorageService,
    private deleteBillReminderConfirmationService :DeleteBillReminderConfirmationService) { }

  ngOnInit(): void {
  
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
  onConfirmDeleteClick(){
    let param = this.deleteBillReminderConfirmationService.deleteBillReminderparam(this.DataService.billReminderValues)
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSDELETEREMINDER).subscribe(data => {
      // console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data;
      console.log("AddBillerSERVIVE " +  JSON.stringify(resp))
      this.DataService.deletebillerConfirmation = resp
      this.goToPage("deleteBillReminderSuccess")
    })
  }

}
