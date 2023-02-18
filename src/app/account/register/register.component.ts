import { Observable } from 'rxjs';
import { CustomService } from './../../service/custom.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { FreelancerTypes, RoleTypes, AbrRoleTypes } from 'src/app/shared/ItemList/items';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { DOCUMENT } from '@angular/common';
import { AppConfig } from 'src/app/config/config';

// import { ConfirmPasswordValidator } from './confirm-password.validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  register$!: Observable<any>;
  registerForm!: FormGroup;
  submitted = false;
  userreg: any = {};
  errors: any = {};
  userId: any = {};
  email_id: any = {};
  error_msg!: string;
  isError: boolean = false;
  isFreelancer: boolean = false;
  countries$!: Observable<any>;
  services$!: Observable<any>;
  roleTypes = RoleTypes;
  abrroleTypes = AbrRoleTypes;
  freelancerTypes = FreelancerTypes;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type!: 'image' | 'audio';
  private serverUrl = `${this._appConfig.setting['PathAPI']}`;

  constructor(private customService: CustomService,
    @Inject(DOCUMENT) private document: Document,

    private formBuilder: FormBuilder,
    public _customFunctions: CustomFunctions,
    public customFunction: CustomFunctions,
    private _appConfig: AppConfig,

    // private reCaptchaV3Service: ReCaptchaV3Service,
    private router: Router) { }

  ngOnInit(): void {
    // this.reCaptchaV3Service.execute('6Lect8YgAAAAANkNNG6VDJdx6s5785GUAY3otaUb', 'homepage', (token) => {
    //   console.log('This is your token: ', token);
    // }, {
    //   useGlobalDomain: false
    // });
    this.countries$ = this.customService.Get(`Country`);
    this.services$ = this.customService.Get(`Service`);
    this.registerForm = this.createRegisterForm();
  }
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  createRegisterForm(): FormGroup {
    return this.formBuilder.group({
      FullName: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required, Validators.email])],
      PhoneNumber: ['', Validators.compose([Validators.required])],
      Password: ['', Validators.compose([Validators.required])],
      ConfirmPassword: ['', Validators.compose([Validators.required])],
      Role: [null, Validators.compose([Validators.required])],
      FreelancerType: [1],
      ServiceId: [''],
      CountryId: ['', Validators.compose([Validators.required])],
      PrivacyAndTerms: [null, Validators.compose([Validators.required])],
      recaptcha: [null, Validators.compose([Validators.required])]
    });
  }
  getRegisterFormInfo(): any {
    if (this.registerForm.invalid) {
      console.log('please Insert All Form Data ');
      this._customFunctions.showResponseMessage('please Insert All Form Data', false);
      return;
    }
    const userInfo: any = {
      fullName: this.registerForm.controls.FullName.value,
      serviceId: this.registerForm.controls.FreelancerType.value == 1? null: this.registerForm.controls.ServiceId.value,
      email: this.registerForm.controls.Email.value,
      phoneNumber: this.registerForm.controls.PhoneNumber.value,
      role: this.registerForm.controls.Role.value.name,
      roleId: this.registerForm.controls.Role.value.id,
      freelancerType: this.registerForm.controls.FreelancerType.value,
      password: this.registerForm.controls.Password.value,
    };

    console.log('userInfo ', userInfo);

    return userInfo;
  }
  async registerUser(): Promise<void> {
    this.submitted = true;
    const userInfo = this.getRegisterFormInfo();
    console.log('userInfo2 ', userInfo);
    await this.customService.post(userInfo, 'Identity/Register').subscribe(async res => {
      if (res) {
        if (res.code <= 300) {
          this._customFunctions.showResponseMessage(res.description, res.code);
          this.router.navigate(['/account/login']);
        } else {
          this._customFunctions.showResponseMessage(res.description, res.code);
        }

        // this.clientForm.reset();
      }
    });
    // await this.customService.post(userInfo, 'Identity/Register').subscribe(async res => {
    //   if (res) {
    //     this._customFunctions.showResponseMessage(res.description, res.code);
    //     // this.clientForm.reset();
    //   }
    // });
  }
  onSelectUserType(type: any) {
    console.log('type ', type);
    if (type.id === 2 || type.id === 4) {
      this.isFreelancer = true;
    } else {
      this.isFreelancer = false;
    }
  }
  handleSuccess(data: any) {
    console.log(data);
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
    this.document.location.href = `${this.serverUrl}ExternalLogin/external-login?provider=LinkedIn&returnUrl=/home`;
  }
}
