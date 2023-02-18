import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SnotifyService, SnotifyPosition, SnotifyToastConfig } from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CustomFunctions {
  // tslint:disable-next-line:variable-name
  protected _onDestroy = new Subject<void>();
  style = 'material';
  title = 'Snotify title!';
  body = 'Lorem ipsum dolor sit amet!';
  timeout = 3000;
  position: SnotifyPosition = SnotifyPosition.centerTop;
  progressBar = true;
  closeClick = true;
  newTop = true;
  filterDuplicates = false;
  backdrop = -1;
  dockMax = 8;
  blockMax = 6;
  pauseHover = true;
  titleMaxLength = 15;
  bodyMaxLength = 80;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private snotify: SnotifyService) { }

  public IsRTL(): boolean {
    if (this.translate.currentLang === 'ar') {
      return true;
    } else {
      return false;
    }
  }
  public formatDate(date: string) {
    if (date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) { month = '0' + month; }
      if (day.length < 2) { day = '0' + day; }
      return [year, month, day].join('-');
    } else {
      return null;
    }

  }
  public translateText(TextAr: string, textEn: string): string {
    if (this.translate.currentLang === 'ar') {
      return TextAr;
    } else {
      return textEn;
    }
  }


  public customConfirm(title: string, callback: () => void): void {
    Swal.fire({
      title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: ' Confirm Process',
      cancelButtonText: 'back'
    }).then(async (result) => {
      if (result.value) {
        callback();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          '   Back Done ',
          'error'
        );
      }
    });
  }

  getConfig(): SnotifyToastConfig {
    this.snotify.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax,
        // @ts-ignore
        filterDuplicates: this.filterDuplicates
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }

  onSuccess(): void {
    this.snotify.success(this.body, this.title, this.getConfig());
  }
  onInfo(): void {
    this.snotify.info(this.body, this.title, this.getConfig());
  }
  onError(): void {
    this.snotify.error(this.body, this.title, this.getConfig());
  }
  onWarning(): void {
    this.snotify.warning(this.body, this.title, this.getConfig());
  }
  public showResponseMessage(msg: string, status: any = null): void {
    let Title = 'Success';
    let TitleError = 'Error';


    if (status > 300 || status === false) {
      this.snotify.error(msg, TitleError, this.getConfig());
    } else if (status === 'warning' || status === 'warn') {
      this.snotify.warning(msg, TitleError, this.getConfig());
    } else if (status === 'info') {
      this.snotify.info(msg, Title, this.getConfig());
    } else {
      this.snotify.success(msg, Title, this.getConfig());
      const { timeout, ...config } = this.getConfig(); // Omit timeout
      // this.snotify.async(msg, successAction, config);

    }
  }


  public reloadComponent(): void {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  public formatDate2(date: any): any {

    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

}
