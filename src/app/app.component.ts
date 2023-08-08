import { Component } from '@angular/core';
import { AppConstants } from './app.constant';
import { HttpRestApiService } from './services/http-rest-api.service';
import { DataService } from './services/data.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core'; 
import { Router,NavigationEnd , NavigationStart ,Route} from '@angular/router';
declare var device: any;
declare var showToastMessage: any;
declare var navigator: any;
declare var $: any;
declare var IRoot: any;
declare var cordova: any;
declare var hideMpinModel: any;
declare var window: any;
declare var LocalFileSystem: any;
declare var sms;
declare var appProtectExample: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  routeArray:any=[];

  constructor(public constant:AppConstants,
    private http: HttpRestApiService,
    public dataService: DataService,private router: Router,
    private idle: Idle){
      this.getAllPreLoginPath('', this.router.config);
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          if(e.url != "/"){
           if( this.routeArray.map((object:any) => object).indexOf(e.url) == -1){
              if(this.constant.getPlatform() == 'web'){
                this.dataService.currentRoute = "postLogin"
              }else{
                this.dataService.currentRoute = e.url == "/dashboard"?"postLogin":"innerHeader"
              }
           }else{
            this.dataService.currentRoute = "preLogin"
           }
          }
        }
      });
  }
  getAllPreLoginPath(parent: String, config: Route[] | any) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      if(config[i].path == 'languageChange'){
        this.routeArray.push( "/" + config[i].path)
      } 
      if(config[i].hasOwnProperty('data')){
      
        if(config[i].data?.name != "AuthGuard" ){
          for(var j =0; j < config[i].children.length; j++ ){
            this.routeArray.push( "/" + config[i].children[j].path)
          }
        }
      }
      if (route.children) {
        const currentPath = route.path ? parent + '/' + route.path : parent;
        this.getAllPreLoginPath(currentPath, route.children);
      }
    }
  
  }

  ngOnInit() {
    this.getIP();
    this.getCountryCodeByLatLong();
  }


  getIP() {
    this.http.getIPAddress().subscribe((res: any) => {
      console.log("IP Address Details", res);
      if (res?.hasOwnProperty("ip")) {
        let spliteIp = res.ip.split(",");
        this.dataService.ipAddress = spliteIp[0];
        console.log("this.clientIp inside ip ", this.dataService.ipAddress)
      } else {
        this.dataService.ipAddress = '';
        console.log("this.clientIp blank ", this.dataService.ipAddress)
      }
    },
      (error) => {
        console.log(error);
      });
  }

  getCountryCodeByLatLong() {
    this.dataService.getCurrentLatLong(true).subscribe(
      (data) => {
        if (data) {
          console.log('address', data)
        }
      })
  }

  getDeviceDetails() {
    //this.dataService.uuid = this.plugin.getDeviceUUID();
    //this.dataService.devicemodel = this.plugin.getDeviceModel();
    //this.dataService.osversion = this.plugin.getDeviceOsversion();
    //this.dataService.imei = this.plugin.getDeviceIMEI();
    //this.dataService.platform = device.platform;
    this.constant.val_mobPlatform = this.dataService.platform ? this.dataService.platform : "";
    console.log('this.constant.val_mobPlatform' + this.constant.val_mobPlatform);
    if (this.dataService.platform.toLowerCase() == this.constant.val_android) {
      this.constant.val_mobileAppVersion = this.constant.val_mobileAppVersion_android;
    } else if (this.dataService.platform.toLowerCase() == this.constant.val_ios) {
      this.constant.val_mobileAppVersion = this.constant.val_mobileAppVersion_ios;
      //this.addFooterCssForIphone();
    } else {
      this.constant.val_mobileAppVersion = this.constant.val_mobileAppVersion;
    }
    console.log("My Device Details =>");
    console.log("IMEI = ", this.dataService.imei, "UUID = ", this.dataService.uuid, "Platform = ", this.dataService.platform, "Model = ", this.dataService.devicemodel, "OS Version = ", this.dataService.osversion);
  }

  


}
