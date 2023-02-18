import { CustomFunctions } from './../../shared/customFunctions/customFunctions';
import { CustomService } from './../../service/custom.service';
import { Observable } from 'rxjs';
import { AuthService } from './../../service/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalRService } from 'src/app/service/signalR.service';
// import * as moment from 'moment';
// import { ContentService } from "../../content/content.service";
// import { ToastrService } from "ngx-toastr";
// import { DeviceDetectorService } from 'ngx-device-detector';
// import { TranslateService } from '@ngx-translate/core';
// import { ContentService } from 'src/app/service/content.service';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/service/language.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  id: any;
  userDetails: any;
  userSkills: any;
  userReview: any;
  userExperience: any;
  userWorks: any;
  certificationlist: any;
  data!: string;
  user_response: any = {};
  userInfo$!: Observable<any>;
  username: any = {};
  email_id: any = {};
  adminEmail: any = {};
  adminMob: any = {};
  isMobile: boolean = false;
  deviceInfo = null;
  notifications$!: Observable<any>;
  isDesktop: boolean = false;
  langs = 'en';
  notificationsCount = 0;
  listLang = [
    { textEn: 'English', textAr: 'الإنجليزية', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { textEn: 'Arabic', textAr: 'العربية', flag: 'assets/images/flags/ar2.png', lang: 'ar' },
    // { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    // { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    // { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    // { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];
  countryName!: any;
  flagvalue!: any;
  cookieValue!: any;
  valueset: any;
  // moment = moment;
  // translate: any;
  constructor(private router: Router,
    public authService: AuthService,
    private signalRService: SignalRService,
    private customService: CustomService,
    @Inject(DOCUMENT) private document: any,
    public customFunction: CustomFunctions,
    public cookiesService: CookieService,
    private route: ActivatedRoute,
    // private deviceService: DeviceDetectorService,
    public languageService: LanguageService
    // public languageService: TranslateService

  ) {
    //  translate.addLangs(['en', 'ar']);
    //  if(localStorage.getItem('locale')) {
    //  const browserLang  = translate.getBrowserLang();
    //  translate.use(browserLang.match(/en|ar/) ? browserLang : "en");
    //  }else{
    //    localStorage.setItem('locale','en');
    //    translate.setDefaultLang('en');
    //  }
    this.authService.isLoggedIn()
  }


  getUserDetails() {
    this.route.paramMap.subscribe(params => {
      this.customService.Get(`Identity/GetUserDetails/${params.get('id')}`).subscribe((userDetails: any) => {
        if (userDetails) {
          this.userDetails = userDetails.user;
          this.userSkills = userDetails.skills;
          this.userExperience = userDetails.experiences;
          this.userWorks = userDetails.works;
          this.userReview = userDetails.review;
          console.log('userReview ', this.userReview);
        } else {
        }
      });
    });
  }

  ngDoCheck() {
    // this.langs = localStorage.getItem('langs');
    // if(this.langs == 'en')
    // {
    //   this.translate.use(this.langs);
    // }else{
    //   this.translate.use(this.langs);
    // }
    this.user_response = localStorage.getItem('user_response');
    this.username = this.authService.getUserName();
  }
  ngOnInit() {

    //this.epicFunction();
    moment.locale('en'); // set to english
    console.log('moment.locale() ', moment.locale());
    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => this.customFunction.translateText(element.textAr, element.textEn));
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
    this.signalRService.onUpdateProjectOffer();
    this.notifications$ = this.customService.Get(`Identity/GetNotifications`);
    this.getUnReadMessages();
    moment.locale('en'); // set to english
    this.getUserDetails();
    this.userInfo$ = this.customService.Get(`Identity/GetUserProfile`);
  }
  setLanguage(text: string, lang: string, flag: string) {
    if (lang === 'ar') {
      document.dir = 'rtl';
    } else {
      document.dir = 'ltr';
    }
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
    const htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;
    // htmlTag.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('bhthyLang', lang);
    this.changeCssFile(lang);
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
  getUnReadMessages(): void {
    this.customService.Get(`Identity/GetUnReadNotifications`).subscribe(notifications => {
      console.log('GetUnReadNotifications ', notifications);
      this.notificationsCount = notifications.length;
    });
  }
  readReceiverMessages(): void {
    this.customService.Get(`Identity/ReadReceiverMessages`);
    // this.getUnReadMessages();
  }
  getNotificationUrl(notification: any): any {
    switch (notification.subject) {
      case 'NewBide':
        return `/projects/dashboard`;
      case 'NewInviteBide':
        return `/projects/dashboard`;
      case 'NominationExpert':
        return `/projects/dashboard`;
      case 'AcceptedExpert':
        return `/projects/dashboard`;
      case 'CompletedBYProjectOwner':
        return `/projects/dashboard`;
      case 'CompletedByExpert':
        return `/projects/dashboard`;
      default:
        return `/projects/dashboard`;
    }


  }
  getEmail() {
    // this.contentService.getAdminEmail().subscribe((res: any) => {
    //   this.adminMob = res.data.mobile_no;
    //   this.adminEmail = res.data.email_id;
    // });
  }
  goToProfile() {
    if (localStorage.getItem("id")) {
      this.router.navigate(['/auth/updateProfile/' + this.user_response.userId]);
    }
    else {
      this.router.navigate(['/auth/login']);
    }
  }

  logOut() {
    this.authService.logout();
    // this.translate.setDefaultLang('en');
    // window.location.href="/";
    this.router.navigate(['/']);
  }

  changeLang(language: string) {
    localStorage.setItem('locale', language);
    // this.translate.use(language);
    localStorage.setItem('langs', language);
    //window.location.reload();
    // console.log(this.translate.currentLang);
  }
  switchUser(userType: string) {
    localStorage.setItem('userType', userType);
  }
  userType(): any {
    if (localStorage.getItem('userType')) {
      return localStorage.getItem('userType')?.toString();
    } else {
      localStorage.setItem('userType', 'expert');
      return 'expert';
    }
  }
  isExpert(): boolean {
    if (this.authService.hasRole('ExpertAndClient')) {
      if (localStorage.getItem('userType')) {
        const userType = localStorage.getItem('userType')?.toString();
        if (userType === 'expert') {
          return true;
        } else {
          return false;
        }
      } else {
        localStorage.setItem('userType', 'expert');
        return true;
      }
    } else {
      return false;
    }
  }
}
