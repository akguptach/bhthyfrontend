import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { AccountRoutingModule } from './account-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnotifyModule } from 'ng-snotify';
import { ProfileComponent } from './profile/profile/profile.component';
import { SkillsComponent } from './profile/skills/skills.component';
import { FreeLancerWorksComponent } from './profile/freeLancerWorks/freeLancerWorks.component';
import { FreeLancerExperiencesComponent } from './profile/freeLancerExperience/freeLancerExperience.component';
import { AccountComponent } from './account/account.component';
import { UserDetailsComponent } from './userDetails/userDetails.component';
import { ForgetPasswordComponent } from './forgetPassword/forgetPassword.component';
import { ResetPasswordComponent } from './resetPassword/resetPassword.component';
import { ConfirmEmailComponent } from './confirmEmail/confirmEmail.component';
import { ResendConfirmEmailComponent } from './resendConfirmEmail/resendConfirmEmail.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { StarRatingModule } from 'angular-star-rating';
import { NgxStarsModule } from 'ngx-stars';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MomentModule } from 'ngx-moment';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { ExternalLoginComponent } from './externalLogin/externalLogin.component';
import {AccountFooterComponent } from './account-footer/account-footer.component';
// import { RecaptchaModule } from "ng-recaptcha";
@NgModule({
  declarations: [
    RegisterComponent, LoginComponent,
    ChangePasswordComponent, ProfileComponent, SkillsComponent,
    FreeLancerWorksComponent, FreeLancerExperiencesComponent,
    AccountComponent, UserDetailsComponent,
    ChangePasswordComponent, ProfileComponent, SkillsComponent,
    ResetPasswordComponent, ForgetPasswordComponent,
    ConfirmEmailComponent, ResendConfirmEmailComponent,
    AccountFooterComponent,
    ExternalLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxCaptchaModule,
    // RecaptchaModule,
    StarRatingModule.forRoot(),
    SnotifyModule, NgxStarRatingModule, MomentModule,
    ReactiveFormsModule, NgxStarsModule, NgxSpinnerModule,
    AccountRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class AccountModule { }
