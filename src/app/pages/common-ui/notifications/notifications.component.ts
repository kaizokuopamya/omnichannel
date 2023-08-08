import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { AppConstants } from '../../../app.constant';
import { Router } from '@angular/router';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { NotificationService } from '../../common-ui/notifications/notifications.service';
import { CommonMethods } from '../../../services/common-methods';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { PluginService } from 'src/app/services/plugin-service';
import jspdf from 'jspdf';
import 'jspdf-autotable';

declare var window: any;
declare var showToastMessage: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Input() events:any = '';
  notificationList: any = [];
  sessionDecryptKey: any;
  rows: any = [];
  constructor(
    private router: Router,
    public dataService: DataService,
    private constant: AppConstants,
    private http : HttpRestApiService,
    private localStorage : LocalStorageService,
    private notificationServicemob : NotificationService,
    private commonMethods: CommonMethods,
    private encryptDecryptService: EncryptDecryptService,
  ) { }
  
  commonPageComponent: any;

  ngOnInit(): void {
    this.dataService.currentMessage.subscribe(message => (this.commonPageComponent = message))
    this.getNotification();
  }

  readNotification(id)
  {
    // var param = this.notificationServicemob.getNotificationReadParam(id);
    // let deviceID = this.localStorage.getLocalStorage(this.constant.storage_deviceId);
    // this.http.callBankingAPIService(param, deviceID, this.constant.serviceName_NOTIFICATIONSTATUSUPDATE).subscribe(data => {
    //   console.log(data);

    //   var resp = data.responseParameter

    //   if (resp.opstatus == "00") {
       
    //   }
    // });
  }

  getNotification() {
    if (this.dataService.isCordovaAvailable) {
      this.router.navigateByUrl('/commonNotification')
    } else {
      var param = this.notificationServicemob.getNotificationParam();
      let deviceID = this.localStorage.getLocalStorage(this.constant.storage_deviceId);
      this.getNotificationApiCall(param, deviceID)
    }

  }

  getNotificationApiCall(param, deviceID) {
    this.http.callBankingAPIService(param, deviceID, this.constant.serviceName_NOTIFICATIONS).subscribe(data => {
      console.log(data);

      var resp = data.responseParameter

      console.log("Notification List===== header", this.notificationList);
      if (resp.opstatus == "00") {
        this.notificationList = data.set.records;
        this.dataService.notificationArray = data.set.records;
        console.log(data.responseParameter);
        // Added by sk
        console.log('Notification List Count' + data.responseParameter.totalListCount)
        this.dataService.notificationBadge = data.responseParameter.totalListCount;
        this.notificationList = data.set.records;
        this.dataService.sendNotification(this.notificationList.toString());
        var sessionKey = this.encryptDecryptService.decryptText(this.sessionDecryptKey, resp.Session);
        console.log('sessionKey', sessionKey);
      }
    });
  }
  share(notification) {
    var details = this.getSelectedValues(notification);
    if (this.constant.getPlatform() != "web") {
      window.plugins.socialsharing.share(details);
    }
    else {
      window.open('mailto:?subject=Account Details&body=' + details);
    }
  }
  goTodownload() {
    showToastMessage("Coming Soon", 'error');
  }

  goToPage(routeName) {
    console.log(this.router.url)
    if (this.router.url != '/nliLanding') {
      this.dataService.routefrom = 'dashboard';
      this.router.navigateByUrl(routeName);
    }
    else {

    }

  }

  shareNotification() {
    showToastMessage("Coming Soon", 'error');
  }

  /**
   * Get selected values from notification details
   */
  getSelectedValues(notification) {
    let selectedFields = "";
    selectedFields += 'Header' + " : " + notification.header + ", ";
    selectedFields += 'Remark' + " : " + notification.remarks + ", ";
    selectedFields += 'Date' + " : " + notification.TransactionDate + ", ";
    console.log(selectedFields)
    return selectedFields.replace(/,\s*$/, "");
  }


  goToFilter() {
    showToastMessage("Coming Soon", 'error');
  }

  filter() {
    showToastMessage("Coming Soon", 'error');
  }

  
  notification() {
    this.router.navigateByUrl("/omniNotification");
  }


  /**
  *
  * @param print
  */


  goToDashboard() {
    this.router.navigateByUrl('/dashboardMobile')
  }


}

