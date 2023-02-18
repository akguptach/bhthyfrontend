import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';

@Component({
  selector: 'app-fa',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  constructor(
    public customFunction: CustomFunctions,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.router.paramMap.subscribe(param => {
    //   if (param.has('categoryId')) {
    //     this.products$ = this.customService.Get(`OnlineMenu/GetProductByCategory/${param.get('categoryId')}`);
    //   }
    // });
  }

}
