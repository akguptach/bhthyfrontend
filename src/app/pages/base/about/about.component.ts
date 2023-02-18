import { CustomFunctions } from './../../../shared/customFunctions/customFunctions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  webSiteContents$!: Observable<any>;
  constructor(
    private customService: CustomService,
    public customFunction: CustomFunctions,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.webSiteContents$ = this.customService.Get(`WebSiteContent`);
  }

}
