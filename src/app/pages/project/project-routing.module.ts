import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentComponent } from './payment/payment.component';
import { ProjectsComponent } from './projects/projects.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './addProject/addProject.component';
import { ProjectViewComponent } from './projectview/projectview.component';
import { ProjectOffersComponent } from './projectOffers/projectOffers.component';
import { MyProjectsComponent } from './myProjects/myProjects.component';
import { MyOffersComponent } from './myOffers/myOffers.component';
import { OfferChatComponent } from './offerChat/offerChat.component';
import { RatingOfferComponent } from './ratingOffer/ratingOffer.component';
import { ConfirmProjectCompleteComponent } from './confirmProjectComplete/confirmProjectComplete.component';
import { PaymentStatusComponent } from './paymentStatus/paymentStatus.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
const routes: Routes = [
  {
    path: 'addProject',
    component: AddProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editProject/:id',
    component: AddProjectComponent
  },
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: 'projectView/:id',
    component: ProjectViewComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Client', 'ExpertAndClient'],
    }
  },
  {
    path: 'projectOffers/:id',
    component: ProjectOffersComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Client', 'ExpertAndClient'],
    }
  },
  {
    path: 'paymentStatus/:id/:paymentStatus',
    component: PaymentStatusComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Client', 'ExpertAndClient'],
    }
  },
  {
    path: 'offers/:offerType',
    component: MyOffersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projectPage/:userType/:offerId',
    component: OfferChatComponent,
    canActivate: [AuthGuard]
    // data: {
    //   roles: ['Client', 'ExpertAndClient' , 'Admin'],
    // }
  },
  {
    path: 'completeProject/:offerId',
    component: RatingOfferComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Client', 'ExpertAndClient'],
    }
  },
  {
    path: 'confirmCompleteProject/:offerId',
    component: ConfirmProjectCompleteComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Expert', 'ExpertAndClient'],
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
