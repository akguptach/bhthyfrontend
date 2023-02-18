import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import { AuthService } from 'src/app/service/auth.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
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
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private customFunctions: CustomFunctions
  ) { }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }
  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      PhoneNumber: [null, [Validators.required]],
      Password: [null, [Validators.required]]
    });
  }
  async login(): Promise<any> {
    if (this.loginForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const data: any = {
      phoneNumber: this.loginForm.controls.PhoneNumber.value,
      password: this.loginForm.controls.Password.value
    };
    this.authService.loginUser(data).subscribe(res => {
      if (res.status === true) {
        this.customFunctions.showResponseMessage('login Successfully ', true);
        this.router.navigate(['/']);
      } else {
        this.customFunctions.showResponseMessage(res.description, false);
      }
    })

  }
}
