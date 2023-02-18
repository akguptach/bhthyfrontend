import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './ForgetPassword.component.html',
  styleUrls: ['./ForgetPassword.component.css']
})
export class ForgetPasswordComponent implements OnInit {


  forgotPasswordForm!: FormGroup;
  forgotPassword: any = {};
  products$!: Observable<any>;
  constructor(private customService: CustomService,
    private router: ActivatedRoute,
    private _customFunctions: CustomFunctions,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }
  generateForgotPasswordToken(): void {
    if (this.forgotPasswordForm.invalid) {
      this._customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const user: any = {
      email: this.forgotPasswordForm.controls.Email.value
    };
    console.log(user);
    this.customService.post(user, 'Identity/GenerateForgotPasswordToken').subscribe(res => {
      if (res) {
        this._customFunctions.showResponseMessage(res.message, res.status);
        this.forgotPasswordForm.reset();
      }
    });
  }
}
