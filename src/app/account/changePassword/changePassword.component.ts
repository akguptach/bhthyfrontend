import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.css']
})
export class ChangePasswordComponent implements OnInit {


  forgotPassword: any = {};
  products$!: Observable<any>;
  constructor(private customService: CustomService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(param => {
      if (param.has('categoryId')) {
        // this.products$ = this.customService.Get(`OnlineMenu/GetProductByCategory/${param.get('categoryId')}`);
      }
    });
  }

}
