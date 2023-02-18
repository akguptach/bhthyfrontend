import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './resendConfirmEmail.component.html',
  styleUrls: ['./resendConfirmEmail.component.css']
})
export class ResendConfirmEmailComponent implements OnInit {
  resendConfirmEmailForm!: FormGroup;
  forgotPassword: any = {};
  products$!: Observable<any>;
  constructor(private customService: CustomService,
    private _customFunctions: CustomFunctions,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.resendConfirmEmailForm = this._formBuilder.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }
  ResendConfirmEmailToken(): void {
    if (this.resendConfirmEmailForm.invalid) {
      this._customFunctions.showResponseMessage('Please validate All Filed is Correct', false);
      return;
    }
    const user: any = {
      email: this.resendConfirmEmailForm.controls.Email.value
    };
    console.log(user);
    this.customService.post(user, 'Identity/ResendConfirmEmailToken').subscribe(res => {
      if (res) {
        this._customFunctions.showResponseMessage(res.message, res.status);
        this.resendConfirmEmailForm.reset();
      }
    });
  }
}
