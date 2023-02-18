import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { UserDetailsComponent } from './userDetails/userDetails.component';
import { ForgetPasswordComponent } from './forgetPassword/forgetPassword.component';
import { ResetPasswordComponent } from './resetPassword/resetPassword.component';
import { ConfirmEmailComponent } from './confirmEmail/confirmEmail.component';
import { ResendConfirmEmailComponent } from './resendConfirmEmail/resendConfirmEmail.component';
import { ExternalLoginComponent } from './externalLogin/externalLogin.component';
import { LinkedInLoginComponent } from '../linked-in-login/linked-in-login.component';
const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'linkedInLogin',
    component: LinkedInLoginComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent
  },
  {
    path: 'account',
    component: AccountComponent
  }
  ,
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'userDetails/:id',
    component: UserDetailsComponent
  },
  {
    path: 'forgetPassword',
    component: ForgetPasswordComponent
  }, {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
  ,
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent
  }, {
    path: 'resend-emailToken',
    component: ResendConfirmEmailComponent
  }
  , {
    path: 'externalLogin',
    component: ExternalLoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
