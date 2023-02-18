
import { SignalRService } from './service/signalR.service';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingAnimationService } from './service/loadingAnimationService';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'onlineMenuFrontEnd';
  loadingDataImg: boolean = false;

  constructor(
    public signalRService: SignalRService,
    @Inject(DOCUMENT) private document: any,private loaderService: LoadingAnimationService,
    private translateService: TranslateService, private router: Router, private activatedRoute: ActivatedRoute,
  ) {

    /** START : Code to Track Page View using gtag.js */
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   console.log(event.urlAfterRedirects)
    //   gtag('event', 'page_view', {
    //     page_path: event.urlAfterRedirects
    //   })
    // })

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-14YEQELKQY', { 'page_path': event.urlAfterRedirects });
      }
    })
    /** END : Code to Track Page View  using gtag.js */


  }

  ngOnInit() {
    // this.loaderService.loadingAnimation();

    // const linkAddress = dir === 'ltr' ?
    //   "/assets/styles/bootstrap.css"
    //   : "/assets/styles/bootstrap.rtl.css";
    // (originalLink as HTMLLinkElement).href = linkAddress;
    // document.dir = 'rtl';

    this.signalRService.connect();
    this.signalRService.onUpdateProjectOffer();

  }

  ngAfterViewInit() {
    this.checkLanguage();
    console.log("ngAfterViewInit");
  }



  checkLanguage(): void {
    const attrName = 'dir-change'
    const originalLink = document.querySelector(`[${attrName}]`);
    const lang = localStorage.getItem('bhthyLang');

    if (lang) {
      this.document.documentElement.lang = lang;
      if (lang === 'ar') {
        this.translateService.use('ar');
        this.changeCssFile('ar');
        document.dir = 'rtl';
      } else {
        this.translateService.use('en');
        this.changeCssFile('en');
        document.dir = 'ltr';
      }
      this.translateService.use(lang);
      this.changeCssFile(lang);
    } else {
      this.translateService.use('en');
      this.changeCssFile('en');
      document.dir = 'ltr';
    }
    if (lang === 'ar') {
      document.dir = 'rtl';
    } else {
      document.dir = 'ltr';
    }

  }
  changeCssFile(lang: string) {
    const headTag = this.document.getElementsByTagName(
      'head'
    )[0] as HTMLHeadElement;
    const existingLink = this.document.getElementById(
      'langCss'
    ) as HTMLLinkElement;

    const bundleName = lang === 'en' ? 'englishStyle.css' : 'arabicStyle.css';

    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      const newLink = this.document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.id = 'langCss';
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }
}
