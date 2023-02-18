import { AuthService } from './../../service/auth.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-payment-status',
  templateUrl: './externalLogin.component.html',
  styleUrls: ['./externalLogin.component.scss']
})
export class ExternalLoginComponent implements OnInit {

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private customFunctions: CustomFunctions,
    private customService: CustomService) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        if (params) {
          const userName = params.userName;
          if (userName) {
            this.login(userName);
          } else {
            this.router.navigate(['/account/login']);
          }
        } else {
          this.router.navigate(['/account/login']);
        }
      }
      );
  }
  login(userName: string): any {
    const data: any = {
      userName
    };
    console.log('user ExternalLogin data', data);
    this.authService.loginUser(data, 'ExternalLogin').subscribe(res => {
      if (res.status == true) {
        this.customFunctions.showResponseMessage('External login Successfully ', true);
        this.router.navigate(['/']);
      } else {
        this.customFunctions.showResponseMessage(res.description, false);
        this.router.navigate(['/account/login']);
      }
    })

  }


}
