import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LinkedInLoginComponent } from './linked-in-login/linked-in-login.component';
const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },

  {
    path: '',
    loadChildren: () => import(`./pages/base/base.module`).then(
      module => module.BaseModule
    )
  }, {
    path: 'account',
    loadChildren: () => import(`./account/account.module`).then(
      module => module.AccountModule
    )
  },
  // {
  //   path: 'linkedInLogin',
  //   component:LinkedInLoginComponent
  // },
  {
    path: 'projects',
    loadChildren: () => import(`./pages/project/project.module`).then(
      module => module.ProjectModule
    )
  },
  // {
  //   path: '**',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QuicklinkModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy',
      preloadingStrategy: QuicklinkStrategy
    })
    // RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
})
export class AppRoutingModule { }
