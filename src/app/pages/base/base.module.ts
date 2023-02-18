import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BaseRoutingModule } from './base-routing.module';
import { ContactComponent } from './contact/contact.component';
import { SnotifyModule } from 'ng-snotify';
import { HireExpertComponent } from './hireExpert/hireExpert.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationsComponent } from './notifications/notifications.component';
import { MomentModule } from 'ngx-moment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { RefundComponent } from './refund/refund.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent,
    HireExpertComponent,
    FaqComponent,
    PrivacyComponent,
    TermsComponent,
    RefundComponent,
    NotificationsComponent,
    FooterComponent
  ],
  imports: [
    CommonModule, SnotifyModule,
    FormsModule, ReactiveFormsModule,
    BaseRoutingModule,
    NgSelectModule, NgxSpinnerModule,
    MomentModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class BaseModule { }
