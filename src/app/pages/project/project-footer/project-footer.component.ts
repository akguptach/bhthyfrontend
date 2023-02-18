import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
// import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-project-footer',
  templateUrl: './project-footer.component.html',
  styleUrls: ['./project-footer.component.css']
})
export class ProjectFooterComponent implements OnInit {
  isMobile: boolean = false;
  isDesktop: boolean = false;
  deviceInfo = null;
  adminMob: any = {};
  adminEmail: any = {};
  user_response!: string | null;
  username!: string | null;
  isHasFullFooter!: boolean;
  constructor(private route: ActivatedRoute,
    public customFunction: CustomFunctions,
    public authService: AuthService,
  ) { }
  // private deviceService: DeviceDetectorService,
  ngOnInit() {
    this.epicFunction();
    this.route.data.subscribe(data => {
      this.isHasFullFooter = data.isHasFullFooter as boolean;
      console.log('isHasFullFooter ', data);
    });
    // this,this.getEmail();
  }

  ngDoCheck() {
    this.user_response = localStorage.getItem('user_response');
    this.username = localStorage.getItem('username');
  }

  epicFunction() {
    // this.deviceInfo = this.deviceService.getDeviceInfo();
    // this.isMobile = this.deviceService.isMobile();
    // this.isDesktop = this.deviceService.isDesktop();

  }

  getEmail() {
    // this.contentService.getAdminEmail().subscribe((res: any) => {
    //   this.adminMob = res.data.mobile_no;
    //   this.adminEmail = res.data.email_id;

    // });
  }
}
