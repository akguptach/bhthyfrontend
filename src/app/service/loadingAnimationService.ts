import { Injectable, Renderer2 } from '@angular/core';
import { LoaderService } from './LoaderService ';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class LoadingAnimationService {
  constructor(
    private spinner: NgxSpinnerService, private loaderService: LoaderService) { }


  loadingAnimation(): void {
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.spinner.show();
      } else {
         this.spinner.hide();
      }
    });
  }
}
