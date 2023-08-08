import { Component  , OnInit, Input} from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from "@angular/router";
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {
  @Input() routeName
  routeList:any =[]
  constructor( 
    public dataService: DataService, 
    private router: Router,
    public translate : TranslatePipe
    ){

  }
  
  ngOnInit() {
    let pagename = this.routeName
    this.dataService.getBreadcrumb(pagename , this.router.url)
  }
}
