import { FaqComponent } from './faq/faq.component';
import { TermsComponent } from './terms/terms.component';
import { RefundComponent } from './refund/refund.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { HireExpertComponent } from './hireExpert/hireExpert.component';
import { ContactComponent } from './contact/contact.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      isHasFullFooter: true
    }
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'aboutUs',
    component: AboutComponent,
    data: {
      isHasFullFooter: true
    }
  },
  {
    path: 'contactUs',
    component: ContactComponent,
    data: {
      isHasFullFooter: true
    }
  }
  ,
  {
    path: 'hireExpert',
    component: HireExpertComponent,
    data: {
      isHasFullFooter: false
    }
  }
  ,
  {
    path: 'faq',
    component: FaqComponent
  }
  ,
  {
    path: 'refund',
    component: RefundComponent
  }
  ,
  {
    path: 'privacy',
    component: PrivacyComponent
  }
  ,
  {
    path: 'terms',
    component: TermsComponent
  }

  ,
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
