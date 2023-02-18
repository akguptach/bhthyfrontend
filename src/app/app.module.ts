import { BaseModule } from './pages/base/base.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { FooterComponent } from './layout/footer/footer.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AccountModule } from './account/account.module';
import { MomentModule } from 'ngx-moment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { LinkedInLoginComponent } from './linked-in-login/linked-in-login.component';
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    LinkedInLoginComponent,
    // FooterComponent
  ],
  imports: [
    BrowserModule,
    BaseModule,
    AccountModule,
    SnotifyModule,
    MomentModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    // ToastrModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxGoogleAnalyticsModule.forRoot('G-14YEQELKQY'),
    NgxGoogleAnalyticsRouterModule
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults }, SnotifyService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
