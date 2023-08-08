import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ManagePayeeService } from './manage-payee.service';
import { AppConstants } from 'src/app/app.constant';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { Location } from '@angular/common';


@Component({
  selector: 'app-manage-payee',
  templateUrl: './manage-payee.component.html',
  styleUrls: ['./manage-payee.component.scss'],
})
export class ManagePayeeComponent {
  bankSelection: any = 'within';
  clicked:any;
  config1: any;
  config2: any;
  config3: any;
  config4: any;
  config5: any;
  config6: any;
  itemsPerPage: any;
  currentPage: any;
  totalItems: any;
  deletedPayee: any;
  elementToDelete: any;
  favoritePayeeResult: any;

  withinBankPendingPayeeDetails: any = [];
  withinBankPayeeDetailsList: any = [];
  outsideBankPendingPayeeDetails: any = [];
  outsideBankPayeeDetailsList: any = [];
  mmidBankPendingPayeeDetails: any = [];
  mmidBankPayeeDetailsList: any = [];
  searchText: any = '';
  tempMMIDPayeeList: any = [];
  tempWITHINPayeeList: any = [];
  tempOUTSIDEPayeeList: any = [];
  ownBenificiaryList: any = [];
  otherBenificiaryList: any = [];
  internationalBenificiaryList: any = [];
  initialConfig = {
    id:'',
    itemsPerPage: this.dataService.listCountObj.itemsPerPage,
    currentPage: this.dataService.listCountObj.currentPage,
  };

  constructor(
    private router: Router,
    public dataService: DataService,
    private managePayeeService:ManagePayeeService,
    private constant: AppConstants,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private commonMethods: CommonMethods,
    private location: Location
  ){
    this.config1 = JSON.parse(JSON.stringify(this.initialConfig));
    this.config2 = JSON.parse(JSON.stringify(this.initialConfig));
    this.config3 = JSON.parse(JSON.stringify(this.initialConfig));
    this.config4 = JSON.parse(JSON.stringify(this.initialConfig));
    this.config5 = JSON.parse(JSON.stringify(this.initialConfig));
    this.config6 = JSON.parse(JSON.stringify(this.initialConfig));
  }


  ngOnInit(): void {
    this.dataService.bankTypeCode = '1';
    this.dataService.otpSessionPreviousPage = this.router.url;
    this.bankSelection = this.dataService.paymentType
    var prevUrl = this.constant.getPlatform() == "web" ? 'dashboard' : 'dashboardMobile';

  }

  ngAfterViewInit() {
    this.getBeneficiaryList();
  }


  /**
   * This function is invoked to get benificiary List
   */
  getBeneficiaryList() {
    var param = this.managePayeeService.benificiaryListParam();
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_BENIFICIARYLIST
      )
      .subscribe((data) => {
        console.log(data);
        var resp= data.responseParameter;
        if (resp.opstatus == '00') {
        let payeeDetailsListData = data.set['records'];
        console.log('Temp Manage beneficiary Data :: ', payeeDetailsListData);
        this.dataService.beneficiaryList.payeeAccNumber = payeeDetailsListData.ID;
        // Payee List Data Collection
        this.getBeneficiaryListData(payeeDetailsListData);

        } else {
          //this.errorCallBack(data.subActionId, resp);
        }
      });
  }

  getBeneficiaryListData(payeeDetailsListData) {
    this.withinBankPendingPayeeDetails = [];
    this.withinBankPayeeDetailsList = [];
    this.outsideBankPendingPayeeDetails = [];
    this.outsideBankPayeeDetailsList = [];
    this.mmidBankPendingPayeeDetails = [];
    this.mmidBankPayeeDetailsList = [];

    for (let i = 0; i < payeeDetailsListData.length; i++) {
      //Within Bank
      if (payeeDetailsListData[i]['statusId'] == '8' && payeeDetailsListData[i]['beneficiaryType'] == 'INTRA') {
        this.withinBankPendingPayeeDetails.push(payeeDetailsListData[i]); 
      }
      if (payeeDetailsListData[i]['statusId'] == '3' && payeeDetailsListData[i]['beneficiaryType'] == 'INTRA') {
        this.withinBankPayeeDetailsList.push(payeeDetailsListData[i])
      }
      //Outside Bank
      if (payeeDetailsListData[i]['statusId'] == '8' && payeeDetailsListData[i]['beneficiaryType'] == 'INTERBANK') {
        this.outsideBankPendingPayeeDetails.push(payeeDetailsListData[i])
      }
      if (payeeDetailsListData[i]['statusId'] == '3' && payeeDetailsListData[i]['beneficiaryType'] == 'INTERBANK') {
        this.outsideBankPayeeDetailsList.push(payeeDetailsListData[i])
      }
      //mmid Bank
      if (payeeDetailsListData[i]['statusId'] == '8' && payeeDetailsListData[i]['beneficiaryType'] == 'MMID') {
        this.mmidBankPendingPayeeDetails.push(payeeDetailsListData[i])
      }
      if (payeeDetailsListData[i]['statusId'] == '3' && payeeDetailsListData[i]['beneficiaryType'] == 'MMID') {
        this.mmidBankPayeeDetailsList.push(payeeDetailsListData[i])
      }
    }
    this.tempMMIDPayeeList = this.mmidBankPayeeDetailsList;
    this.tempWITHINPayeeList = this.withinBankPayeeDetailsList;
    this.tempOUTSIDEPayeeList = this.outsideBankPayeeDetailsList;


    // this.searchFilter();
  }

  changeBank(param) {
    this.bankSelection = param;
    this.searchText = '';

    this.mmidBankPayeeDetailsList = this.tempMMIDPayeeList;
    this.withinBankPayeeDetailsList = this.tempWITHINPayeeList;
    this.outsideBankPayeeDetailsList = this.tempOUTSIDEPayeeList;
  }

  deletePayee(element) {
    //$('#confirmationModal').modal('hide');
    this.elementToDelete = element;
    console.log('user:', element.ID);
    this.dataService.paymentType = this.bankSelection
    var param = this.managePayeeService.deletePayeeParam(element);
    this.dataService.endPoint = this.constant.serviceName_DELETEBENEFICIARY;
    this.dataService.screenType="deletePayee"
    this.dataService.request = param;
    this.commonMethods.openPopup('div.popup-bottom.confirm');
  }

  pageChanged(event, configNum) {
    switch (configNum) {
      case 1:
        this.config1.currentPage = event;
        break;
      case 2:
        this.config2.currentPage = event;
        break;
      case 3:
        this.config3.currentPage = event;
        break;
      case 4:
        this.config4.currentPage = event;
        break;
      case 5:
        this.config5.currentPage = event;
        break;
      case 6:
        this.config6.currentPage = event;
        break;
    }
  }

  searchAccount(event) {
    switch (this.bankSelection) {
      case 'mmid':
        if (this.searchText != '') {
          var payeeArray = this.tempMMIDPayeeList;
          var filterArray = payeeArray.filter((x) => x.benefName.toLowerCase().includes(this.searchText.toLowerCase()));
          this.mmidBankPayeeDetailsList = [];
          this.mmidBankPayeeDetailsList = filterArray;
        } else {
          this.mmidBankPayeeDetailsList = [];
          this.mmidBankPayeeDetailsList = this.tempMMIDPayeeList;
        }
        break;
      case 'within':
        if (this.searchText != '') {
          var payeeArray = this.tempWITHINPayeeList;
          var filterArray = payeeArray.filter((x) => x.benefName.toLowerCase().includes(this.searchText.toLowerCase()));
          this.withinBankPayeeDetailsList = [];
          this.withinBankPayeeDetailsList = filterArray;
        } else {
          this.withinBankPayeeDetailsList = [];
          this.withinBankPayeeDetailsList = this.tempWITHINPayeeList;
        }
        break;
      case 'outside':
        if (this.searchText != '') {
          var payeeArray = this.tempOUTSIDEPayeeList;
          var filterArray = payeeArray.filter((x) =>x.benefName.toLowerCase().includes(this.searchText.toLowerCase()));
          this.outsideBankPayeeDetailsList = [];
          this.outsideBankPayeeDetailsList = filterArray;
        } else {
          this.outsideBankPayeeDetailsList = [];
          this.outsideBankPayeeDetailsList = this.tempOUTSIDEPayeeList;
        }
        break;
    }
  }

  addPayee(addpayeselected) {
    console.log('selecteddddddddddddy==================', addpayeselected);
    this.dataService.managePayeeToAddpayee = addpayeselected;
    console.log(this.dataService.paymentType);
    this.dataService.isEditPayee = false;
    this.dataService.previousPageUrl = 'managePayee';
    this.dataService.isAddPayeeFrompage = "/managePayee";
    this.router.navigate(['/addPayee']);
  }

   /**
   * function to called when edit payee button click event
   * @payee user details to edit payee
   */
   editPayee(payee,addpayeselected){
    this.dataService.payeeDtl = payee;
    this.dataService.managePayeeToAddpayee = addpayeselected;
    console.log(addpayeselected);
    this.commonMethods.openPopup('div.popup-bottom.si-warning');
    console.log(payee);
  }

  sendMoneyy(payeeList) {
    console.log('sendMoneyyyy==================', JSON.stringify(payeeList));
    this.dataService.managePayeeToFundTransferData = payeeList;
    this.dataService.managePayeeToSend.selected = this.bankSelection;
    this.router.navigate(['/sendMoney']);
  }

  addFavourite(payeeList) {
    console.log('selected payeeList: ', payeeList);
    if (payeeList.isFavoriteTransaction == 'N') {
      var param = this.managePayeeService.AddfavouritePayee(payeeList.ID,this.bankSelection);
      this.http
        .callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceNmae_ADDFAVORITETRANSACTIONS
        )
        .subscribe((data) => {
          console.log(data);
          var resp = data.responseParameter;
          // showToastMessage(resp.Result,"Success");
          if (resp.opstatus == '00') {
            //showToastMessage(resp.Result, 'success');
            this.favoritePayeeResult = 'Payee added in favorite list';
            this.commonMethods.openPopup('div.popup-bottom.pop');
            this.getBeneficiaryList();
          } else {
            //this.errorCallBack(data.subActionId, resp);
          }
        });
    } else {
      this.deleteFavourite(payeeList);
    }
  }

  deleteFavourite(payeeList) {
    console.log('favorite PayeeList===========', payeeList);
    var param = this.managePayeeService.DeletefavouritePayee(payeeList.ID,this.bankSelection);
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceNmae_DELETEFAVORITETRANSACTIONS)
      .subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.favoritePayeeResult = 'Payee removed from favorite list';
          this.commonMethods.openPopup('div.popup-bottom.pop');
          //showToastMessage(resp.Result, 'success');
          this.getBeneficiaryList();
        } else {
          //this.errorCallBack(data.subActionId, resp);
        }
      });
  }

  confirmEditPayee(){
    this.dataService.isEditPayee = true; 
    this.dataService.isAddPayeeFrompage = "/managePayee";
    this.dataService.previousPageUrl = 'managePayee';
    this.router.navigate(['/addPayee']);
  }


  closePopup(popup) {
    this.commonMethods.closePopup(popup);
  }

  goToFavourite() {
    this.router.navigate(['/favourite']);
  }

  deleteSelPayee(param) {
    this.dataService.resetTransactionObj();
    this.dataService.commonOtpServiceType = this.constant.val_DELETEPAYEE;
    this.router.navigate(['/otpsession']);
  }
}
