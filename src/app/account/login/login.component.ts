import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import { AuthService } from 'src/app/service/auth.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { LoginTypes } from 'src/app/shared/ItemList/items';
import { DOCUMENT } from '@angular/common';
import { AppConfig } from 'src/app/config/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userlogin: any = {};
  loginForm!: FormGroup;
  errors: any = {};
  error_msg: string | undefined;
  isError: boolean = false;
  current_route!: string;
  previousUrl!: string;
  ishideEmail: boolean = false;
  ishideOtp: boolean = true;
  forgotPassword: any = {};
  newPassword: any = {};
  @Input() showProgress: boolean = false;
  productDetails$!: Observable<any>;
  loginTypes = LoginTypes;
  private serverUrl = `${this._appConfig.setting['PathAPI']}`;
  // 77cr1ggs9ptu1r
  // MAOlzxkT4nKjIIO2
   
  

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private customService: CustomService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _appConfig: AppConfig,
    public customFunctions: CustomFunctions
  ) { }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }
  faceBookLogin(): void {
    this.document.location.href = `${this.serverUrl}ExternalLogin/external-login?provider=Facebook&returnUrl=/home`;
    // this.customService.post({}, `ExternalLogin/external-login?provider=Facebook&returnUrl=/home`)
    //   .subscribe(res => {
    //     console.log('faceBookLogin ', res);
    //   },
    //     (error) => {                              //Error callback
    //       console.error('error caught in component', error)

    //       //throw error;   //You can also throw the error to a global error handler
    //     }

    //   )
  }
  googleLogin(): void {
    this.document.location.href = `${this.serverUrl}ExternalLogin/external-login?provider=Google&returnUrl=https://bhthy.com/#/`;
    // this.customService.post({}, `ExternalLogin/external-login?provider=Google&returnUrl=/home`)
    //   .subscribe(res => {
    //     console.log('googleLogin ', res);
    //   },
    //     (error) => {                              //Error callback
    //       console.error('error caught in component', error)

    //       //throw error;   //You can also throw the error to a global error handler
    //     }
    //   )

    
  }
  linkedInLogin(): void {
 
    // this.document.location.href = `${this.serverUrl}ExternalLogin/external-login?provider=LinkedIn&returnUrl=https://bhthy.com/#/`;
  }
  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      PhoneNumber: [null, [Validators.required]],
      Password: [null, [Validators.required]],
      LoginType: [1, [Validators.required]]
    });
  }
  async login(): Promise<any> {
    if (this.loginForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const data: any = {
      userName: this.loginForm.controls.PhoneNumber.value,
      password: this.loginForm.controls.Password.value,
      loginType: this.loginForm.controls.LoginType.value
    };
    console.log('user login data', data);

    this.authService.loginUser(data, 'login').subscribe(res => {
      if (res.status === true) {
        this.customFunctions.showResponseMessage('login Successfully ', true);
        this.router.navigate(['/']);
      } else {
        this.customFunctions.showResponseMessage(res.description, false);
      }
    })

  }
}
