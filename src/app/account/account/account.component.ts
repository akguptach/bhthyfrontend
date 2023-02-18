import { CustomFunctions } from './../../shared/customFunctions/customFunctions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FreelancerTypes, RoleTypes } from 'src/app/shared/ItemList/items';
import { Observable, observable } from 'rxjs';
import { CustomService } from 'src/app/service/custom.service';
import { AuthService } from './../../service/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  userInfo!: any;
  updateForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  cashWithdrawalForm!: FormGroup;
  submitted = false;
  isFreelancer!: boolean;
  roleTypes = RoleTypes;
  freelancerTypes = FreelancerTypes;
  userInfo$!: Observable<any>;
  services$!: Observable<any>;
  transactions$!: Observable<any>;
  monthTransferToAccount$!: Observable<any>;
  cashWithdrawal$!: Observable<any>;
  selectedFreeLancerType: any;
  selectedRole: any;
  selectedService: any;
  imageBase64!: string | ArrayBuffer | null;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    public customFunctions: CustomFunctions,
    private customService: CustomService,
    public authService: AuthService,
  ) { }

  ngDoCheck() {



  }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      location: ['', Validators.required],
      aboutMe: ['', Validators.required],
      HourlyRate: ['', Validators.required],
      zipCode: ['', Validators.required],
      Role: [],
      FreelancerType: [1],
      ServiceId: [],
      file: [''],
    });
    this.forgotPasswordForm = this.formBuilder.group({
      CurrentPassword: ['', [Validators.required]],
      NewPassword: ['', [Validators.required]],
      ConfirmNewPassword: ['', [Validators.required]]
    });
    this.cashWithdrawalForm = this.formBuilder.group({
      Amount: ['', [Validators.required]],
    });
    this.getUserProfile();
    this.services$ = this.customService.Get(`Service`);
    this.transactions$ = this.customService.Get(`Identity/GetTransactions/1`);
    this.monthTransferToAccount$ = this.customService.Get(`Identity/GetTransactions/2`);
    this.getCashWithdrawal(1);
  }
  getCashWithdrawal(status: any): void {
    this.cashWithdrawal$ = this.customService.Get(`WithdrawalRequest/FindByUser/${Number(status)}`);
  }
  getUserProfile(): void {
    this.userInfo$ = this.customService.Get(`Identity/GetUserProfile`);
    this.userInfo$.subscribe(user => {
      console.log('userInfo ', user);
      this.userInfo = user;
      this.selectedRole = user.roleId;
      this.selectedFreeLancerType = user.freelancerType;
      this.selectedService = user.serviceId;
      this.onSelectUserType(user.roleId);
      this.updateForm.patchValue({
        fullName: user.fullName,
        location: user.location,
        aboutMe: user.aboutMe,
        HourlyRate: this.isFreelancer === false ? '0' : user.hourlyRate,
        zipCode: user.zipCode,
        Role: user.roleId,
        FreelancerType: user.freelancerType
      })

    })
  }
  get form() {
    return this.forgotPasswordForm.controls;
  }
  changePassword(): void {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const user: any = {
      CurrentPassword: this.forgotPasswordForm.controls.CurrentPassword.value,
      NewPassword: this.forgotPasswordForm.controls.NewPassword.value
    };
    console.log(user);
    this.customService.post(user, 'Identity/change-password').subscribe(res => {
      console.log('res ', res);
      if (res.status === false) {
        this.customFunctions.showResponseMessage(res.description, false);
      } else {
        this.customFunctions.showResponseMessage(res.description, true);
        // this.router.navigate(['/']);
      }
    });
  }
  newWithdrawalRequest(): void {
    this.submitted = true;
    if (this.cashWithdrawalForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const data: any = {
      amount: this.cashWithdrawalForm.controls.Amount.value,
    };
    this.customService.post(data, 'WithdrawalRequest').subscribe(res => {
      console.log('res ', res);
      if (res.code > 300) {
        this.customFunctions.showResponseMessage(res.description, false);
      } else {
        this.customFunctions.showResponseMessage(res.description, true);
        this.getCashWithdrawal(1);
        // this.router.navigate(['/']);
      }
    });
  }
  onSelectUserType(type: any) {
    console.log('type ', type);
    if (type === 2 || type === 4) {
      this.isFreelancer = true;
    } else {
      this.isFreelancer = false;
      this.updateForm.get('HourlyRate').setValue('0');
      this.updateForm.get('ServiceId').setValue(20);
    }
  }
  get f() { return this.forgotPasswordForm.controls; }

  userslog() {

  }

  filesSelection(event: any) {

  }

  UpdateUser() {
    if (this.updateForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const userInfo: any = {
      FullName: this.updateForm.controls.fullName.value,
      AboutMe: this.updateForm.controls.aboutMe.value,
      ServiceId: this.updateForm.controls.ServiceId.value,
      RoleId: this.updateForm.controls.Role.value,
      FreelancerType: this.updateForm.controls.FreelancerType.value,
      ZipCode: this.updateForm.controls.zipCode.value,
      HourlyRate: this.updateForm.controls.HourlyRate.value,
      Location: this.updateForm.controls.location.value,
      image: this.imageBase64
    };
    console.log('userDate in edit ', userInfo);

    this.customService.put(userInfo, 'Identity/UpdateUser').subscribe(async res => {
      if (res) {
        this.customFunctions.showResponseMessage(res.description, res.code);

        if (res.code <= 300) {
          this.getUserProfile();
          this.router.navigate(['/projects/dashboard']);
        }
        // this.clientForm.reset();
      }
    });
  }
  // tslint:disable-next-line:typedef
  onSelectFile(event: any) {
    const file = event.target.files[0];
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);
    // this.fileType = ext;
    console.log('file size  ', file.size);
    if (file.size > 3254478) {
      console.log('file size larag ', file.size);
      alert('the max size of File mus be 1 MB');
      // this.customFunctions.showResponseMessage('the max size of File mus be 1 MB', 'حجم الملف اكبر من واحد ميقا بايت', false);
      return;
    }
    // const fileTypes = ['jpg', 'jpeg', 'png'];  // acceptable file types
    // const extension = file.fileName.split('.').pop().toLowerCase();  // file extension from input file
    // const isSuccess = fileTypes.indexOf(extension) > -1;  // is extension in acceptable types
    // this.fileType = extension;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // var b64 = reader.result.replace(/^data:.+;base64,/, '');
      reader.readAsDataURL(file);
      reader.onload = () => {
        //  let v : string = reader.result;
        // console.log( reader.result);
        this.imageBase64 = reader.result;
      };
      reader.onerror = error => reject(error);
    });
  }

  onChangepass() {


  }

  transactions() {

  }

  transactionsme() {

  }

  onOptionsSelected(value: string) {


  }

  cashwithdraw() {

  }

  moneytransferaccount() {

  }

  logOut() {
    this.authService.logout();
    // this.translate.setDefaultLang('en');
    window.location.href="/home";
    this.router.navigate(['/home']);
  }

}
