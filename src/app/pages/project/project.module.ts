import { ProjectBidsComponent } from './projectBids/projectBids.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectComponent } from './addProject/addProject.component';
import { SnotifyModule } from 'ng-snotify';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectViewComponent } from './projectview/projectview.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProjectOffersComponent } from './projectOffers/projectOffers.component';
import { MyProjectsComponent } from './myProjects/myProjects.component';
import { MyOffersComponent } from './myOffers/myOffers.component';
import { OfferChatComponent } from './offerChat/offerChat.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { RatingOfferComponent } from './ratingOffer/ratingOffer.component';
import { ConfirmProjectCompleteComponent } from './confirmProjectComplete/confirmProjectComplete.component';
import { MomentModule } from 'ngx-moment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentStatusComponent } from './paymentStatus/paymentStatus.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { ProjectFooterComponent } from './project-footer/project-footer.component';
@NgModule({
  declarations: [
    AddProjectComponent,
    ProjectsComponent,
    ProjectViewComponent,
    ProjectOffersComponent,
    MyProjectsComponent,
    MyOffersComponent,
    OfferChatComponent,
    RatingOfferComponent,
    ConfirmProjectCompleteComponent,
    DashboardComponent,
    ProjectBidsComponent,
    PaymentStatusComponent,
    PaymentComponent,
    ProjectFooterComponent
  ],
  imports: [
    CommonModule, SnotifyModule,
    ReactiveFormsModule, FormsModule,
    ProjectRoutingModule, NgxStarRatingModule,
    ProjectRoutingModule,
    MomentModule, NgxSpinnerModule,
    NgSelectModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    
  ]
})
export class ProjectModule { }
