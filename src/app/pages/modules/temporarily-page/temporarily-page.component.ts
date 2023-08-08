import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-temporarily-page',
  templateUrl: './temporarily-page.component.html',
  styleUrls: ['./temporarily-page.component.scss']
})
export class TemporarilyPageComponent implements OnInit {
  buttonName = '';
  
  constructor( 
    private router: Router, 
    public dataService: DataService,  
) { }

ngOnInit(): void {
  this.dataService.headerType = "preloginHeader"
  this.dataService.gotpage ="";
  this.buttonName = this.dataService.timeoutMsg == 'Currently facing some technical issue please try again in sometime.' ? 'Try Again' : 'Login Again';
}

goToPage(routeName){
  this.router.navigateByUrl('/'+routeName);
}
}
