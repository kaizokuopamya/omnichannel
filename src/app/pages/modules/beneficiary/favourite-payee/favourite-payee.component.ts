import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { FavouritePayeeService } from './favourite-payee.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-favourite-payee',
  templateUrl: './favourite-payee.component.html',
  styleUrls: ['./favourite-payee.component.scss']
})
export class FavouritePayeeComponent {
  favroutelist: any = [];
  searchText: any = '';
  tempFavouriteList: any = [];
  config1:any;

  constructor(
    private router: Router,
    public dataService: DataService,
    private constant: AppConstants,
    private favouritePayeeService: FavouritePayeeService,
    private http: HttpRestApiService,
    private storage: LocalStorageService
  ){
      this.config1 ={id:"basicPaginate1", itemsPerPage:this.dataService.listCountObj.itemsPerPage, currentPage: this.dataService.listCountObj.currentPage};
    }

    ngOnInit(): void {
      this.favourite();
      this.dataService.beneficiaryType;
      console.log('formtypeeeeeeeeeeeeeeee', this.dataService.beneficiaryType);
    }

    pageChanged1(event){
      this.config1.currentPage= event;
    }

    goToPage(routeName) {
      this.router.navigateByUrl('/' + routeName);
    }

    favourite() {
      var param = this.favouritePayeeService.getFavouritePayee();
      console.log('get fav payee params: ', param);
      this.http
        .callBankingAPIService(
          param,
          this.storage.getLocalStorage(this.constant.storage_deviceId),
          this.constant.serviceNmae_GETFAVORITETRANSACTIONS
        )
        .subscribe((data) => {
          console.log(data);
  
          var resp = data.responseParameter;
          if (resp.opstatus == '00') {
            this.favroutelist = data.set['records'];
  
            console.log('get favourite list', this.favroutelist);
            this.tempFavouriteList = this.favroutelist;
            console.log('tempFavouriteList', this.tempFavouriteList);
          } else {
            // this.errorCallBack(data.subActionId, resp);
          }
        });
    }
  
    searchAccount(event) {
      console.log(event);
      if (this.searchText != '') {
        var payeeArray = this.tempFavouriteList;
        var filterArray = payeeArray.filter((x) =>
          x.benefName.toLowerCase().includes(this.searchText.toLowerCase())
        );
  
        this.favroutelist = [];
        this.favroutelist = filterArray;
      } else {
        this.favroutelist = [];
        this.favroutelist = this.tempFavouriteList;
      }
    }
  
    sendMoneyy(favourites) {
      this.dataService.managePayeeToFundTransferData = favourites;
      console.log(this.dataService.managePayeeToFundTransferData);
      this.router.navigate(['/sendMoney']);
    }

}
