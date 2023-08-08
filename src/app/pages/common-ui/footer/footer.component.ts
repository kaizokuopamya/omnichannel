import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FooterData } from 'src/app/model/footer.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() footerData:FooterData[] = [];
  @Input() showBrandingFooter:boolean = true;
  constructor(private _router: Router,public dataService:DataService) { }

  ngOnInit(): void {
  }

  goToPage(routeName){
    this._router.navigateByUrl(routeName);
  }

}
