import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-resetPassword',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  userId!: string;
  token!: string;
  private _unsubscribeAll!: Subject<any>;
  constructor(private customService: CustomService,
    private _customFunctions: CustomFunctions,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        if (params) {
          this.userId = params.userId;
          this.token = params.token;
        } // popular
      }
      );
    this.resetPasswordForm = this._formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.resetPasswordForm.controls.password.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.resetPasswordForm.controls.passwordConfirm.updateValueAndValidity();
      });
  }
  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this._customFunctions.showResponseMessage('please Insert All Form Data', false);
      return;
    }
    const user: any = {
      userId: this.userId,
      token: this.token,
      NewPassword: this.resetPasswordForm.controls.password.value
    };
    console.log(user);
    this.customService.post(user, 'Identity/reset-password').subscribe(res => {
      console.log('res ', res);
      if (Number(res.status) > 300) {
        this._customFunctions.showResponseMessage(res.message, false);
      } else {
        this._customFunctions.showResponseMessage(res.message, true);
        this.router.navigate(['/account/login']);
      }
    });
  }

}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};
