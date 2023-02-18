import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomService } from 'src/app/service/custom.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-confirmEmail',
  templateUrl: './confirmEmail.component.html',
  styleUrls: ['./confirmEmail.component.css']
})
export class ConfirmEmailComponent implements OnInit {
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
          this.confirmEmail();
        } // popular
      }
      );

  }
  confirmEmail(): void {

    const user: any = {
      userId: this.userId,
      token: this.token
    };
    console.log(user);
    this.customService.post(user, 'Identity/ConfirmEmail').subscribe(res => {
      console.log('res ', res);
      if (Number(res.code) > 300) {
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
