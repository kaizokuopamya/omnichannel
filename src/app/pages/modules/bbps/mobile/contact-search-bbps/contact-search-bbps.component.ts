import { Location } from '@angular/common';
import { AfterViewInit, Component, NgZone, OnInit , OnDestroy } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { AppConstants } from 'src/app/app.constant';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { PluginService } from 'src/app/services/plugin-service';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from '../../../../../services/data.service';
declare var cordova: any;
declare var $;

@Component({
  selector: 'app-contact-search-bbps',
  templateUrl: './contact-search-bbps.component.html',
  styleUrls: ['./contact-search-bbps.component.scss']
})
export class ContactSearchBbpsComponent implements OnInit , OnDestroy{

  headerdata = {
    'headerType': 'TitleClose',
    'titleName': 'Contact',
    'footertype': 'none'
  }
  searchContacts = '';
  contactUserName = '';
  mobileContacts = [];
  batchUpdatedContacts = [];
  batches = [];
  batchIndex = 0;
  contactMobileNo = '';
  isReferFriend = false;
  constructor(private router: Router,
    public DataService: DataService,
    private loader: pageLoaderService,
    private pluginService: PluginService,
    private location: Location,
    private localStorage: LocalStorageService,
    private ngZone: NgZone,
    private http: HttpRestApiService,
    public constant: AppConstants,
    private storage: LocalStorageService,
    private translate: TranslatePipe,
 
    private commonMethod: CommonMethods) { }

  ngOnInit(): void {

    this.DataService.getBreadcrumb('contactList' , this.router.url)
    this.DataService.isbbpsPage = true
    console.log(" DataService.addBillReminderData " + JSON.stringify(this.DataService.addBillReminderData))
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : this.DataService.breadcrumblist[this.DataService.breadcrumblist.length - 2].routeName
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.fetchContacts();
    })
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
  fetchContacts(){
    if (this.DataService.mobileContacts.length == 0 && this.DataService.isCordovaAvailable) {
      this.getContactsList();
    }
    this.isReferFriend = this.DataService.previousPageUrl == 'referFriend' ? true : false;
    if (this.DataService.isCordovaAvailable) {
      if (this.DataService.isContactSyncCompleted && this.DataService.isContactsSyncEnabled) {
        this.DataService.mobileContacts = this.DataService.updatedContacts;
        this.DataService.isContactsSyncEnabled = true;
      } else {
        this.DataService.isContactsSyncEnabled = false;
      }
      this.DataService.upiContactsList = this.commonMethod.getAscendingContactList(this.DataService.mobileContacts);
    } else {

      this.DataService.upiContactsList = this.commonMethod.getAscendingContactList(this.DataService.mobileContacts);
      this.DataService.mobileContactsClone = this.DataService.mobileContacts;
    }
  }
  goToSettings() {
    this.location.back();
    cordova.plugins.diagnostic.switchToSettings(function () {
      console.log("Successfully switched to Settings app");
    }, function (error) {
      console.error("The following error occurred: " + error);
    });
  }
  getContactsList() {
    this.commonMethod.closePopup('div.popup-bottom.contact-permission');
    this.pluginService.checkContactPermission().subscribe(authorized => {
      if (authorized == "0") {
        if(this.DataService.platform.toLowerCase() == this.constant.val_android) {
          this.pluginService.getDeviceContactsAndroid().subscribe(contacts => {
            this.ngZone.run(() => {
              this.DataService.mobileContacts = contacts.allContacts;
              this.DataService.mobileContactsClone = contacts.allContacts;
              this.DataService.upiContactsList = this.commonMethod.getAscendingContactList(this.DataService.mobileContacts);
              if (this.localStorage.hasKeyLocalStorage('isContactSynced') && this.localStorage.getLocalStorage('isContactSynced') == "Y") {
                this.DataService.isContactsSyncEnabled = true;
                this.batchUpdateContacts(this.DataService.mobileContacts);
              }
            });
          });
        } else if (this.DataService.platform.toLowerCase() == this.constant.val_ios) {
          this.pluginService.getDeviceContactsIos().subscribe(contacts => {
            this.ngZone.run(() => {
              this.DataService.mobileContacts = contacts.allContacts;
              this.DataService.mobileContactsClone = contacts.allContacts;
              this.DataService.upiContactsList = this.commonMethod.getAscendingContactList(this.DataService.mobileContacts);
              if (this.localStorage.hasKeyLocalStorage('isContactSynced') && this.localStorage.getLocalStorage('isContactSynced') == "Y") {
                this.DataService.isContactsSyncEnabled = true;
                this.batchUpdateContacts(this.DataService.mobileContacts);
              }
            });
          });
        } else {
          console.log("Unknown platform...");
        }

        
      } else if (authorized == "1") {
        this.commonMethod.openPopup('div.popup-bottom.contact-permission-deniedAlways');
      } else if (authorized == "2") {
        this.commonMethod.openPopup('div.popup-bottom.contact-permission');
      } else {
        console.log("Not Authorized..");
        this.commonMethod.openPopup('div.popup-bottom.contact-permission-not-granted');
      }
    });
  }

  selectContact(contact) {
      this.DataService.bbpsMobileNumber = contact.mobileNo;
      this.goToPage('mobilePrepaid');
    
  }


  batchUpdateContacts(contacts: any[], batchSize = 500) {
    this.commonMethod.closePopup('div.popup-bottom.contactsSync-popup');
    this.batches = [];
    this.batchIndex = 0
    this.batchUpdatedContacts = [];
    let offset = 0;
    while (offset < contacts.length) {
      this.batches.push(
        contacts.slice(offset, offset + batchSize)
      );
      offset += batchSize;
    }
    // return forkJoin(
    //   this.batches.map((batch, index) =>  this.synContactListApiCall(batch, index))
    // );
   
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false

  }

  openPopup(popupName) {
    this.ngZone.run(() => {
      if (this.DataService.isContactsSyncEnabled && !this.DataService.isContactSyncCompleted) {
        this.commonMethod.openPopup('div.popup-bottom.' + popupName)
      } else if (this.DataService.isContactSyncCompleted && this.DataService.isContactsSyncEnabled) {
        this.DataService.upiContactsList = this.commonMethod.getAscendingContactList(this.DataService.updatedContacts);
      } else {
        this.DataService.mobileContacts = this.DataService.mobileContactsClone;
        this.DataService.upiContactsList = this.commonMethod.getAscendingContactList(this.DataService.mobileContacts);
      }
    });
  }

  closePopup(popupName) {
    this.commonMethod.closePopup('div.popup-bottom.' + popupName)
    if (popupName == 'contactsSync-popup') {
      this.DataService.isContactsSyncEnabled = !this.DataService.isContactsSyncEnabled;
    } else if (popupName == 'contact-permission' || popupName == 'contact-permission-deniedAlways') {
      this.location.back();
    }
  }

  
 

  showPopup(popupName, contact) {
    this.commonMethod.openPopup('div.popup-bottom.' + popupName);
    this.contactUserName = contact.custName;
    this.contactMobileNo = contact.mobileNo;
  }



  showNotGrantedModel() {
    $('#notgrantedsmspermodel').modal('show');
  }


  hideNotGrantedModal() {
    $('#notgrantedsmspermodel').modal('hide');
  }


  gotoSetting() {
    this.hideNotGrantedModal();
    this.pluginService.gotoSetting().subscribe((status) => {
      console.log("gotoSetting=====>", status);
    }, (err) => {
      console.log("gotoSetting error", err);
    });
  }

  ngDestroy(){
    
  }

}
