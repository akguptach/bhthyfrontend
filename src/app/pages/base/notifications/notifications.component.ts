import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';
import * as moment from 'moment';
// import moment, * as moments from "moment-timezone";
import { Moment } from "moment-timezone";
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications$!: Observable<any>;
  constructor(private customService: CustomService, private router: ActivatedRoute, public customFunctions: CustomFunctions) { }
  // _moment = momentz;
  ngOnInit(): void {
    this.customService.Get(`Identity/ReadReceiverMessages`).subscribe(ReadReceiverMessages => {
      console.log('ReadReceiverMessages ', ReadReceiverMessages);

    });
    // let tzOfTZ = momentz().tz("Europe/London").format('Z');
    moment.locale('en'); // set to english
    console.log('moment.locale() ', moment.locale());
    this.notifications$ = this.customService.Get(`Identity/GetNotifications`);
    this.readReceiverMessages();
  }
  readReceiverMessages(): void {

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
}
