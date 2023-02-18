import { AuthService } from 'src/app/service/auth.service';
import { CustomService } from 'src/app/service/custom.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectOfferStatus } from 'src/app/shared/ItemList/Enum';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss",]
})
export class PaymentComponent implements OnInit {
  selectedNav = 1;
  isDraft = true;
  isOpeningForBiding = false;
  isBidingClosedExpired = false;
  isWinnerSelected = false;
  isUnderDevelopment = false;
  isBidUnderDevelopment = false;
  isWaitingForReview = false;
  isExcludedBids = false;
  isNominationBids = false;
  isInviteBids = false;
  isSendingBids = false;
  isPending = false;
  isWaitConfirmComplete = false;
  isCompletedByProjectOwner = false;
  isCompletedProject = false;
  isCompletedBids = false;
  isInviteByAdmin = false;
  bidCounts: any;
  projectDashboard: any;
  projectOfferStatus = ProjectOfferStatus;
  constructor(
    private router: Router,
    private customService: CustomService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private customFunctions: CustomFunctions
  ) { }

  ngDoCheck() {
  }

  ngOnInit() {
    this.customService.Get(`ProjectOffer/GetDashBoard`).subscribe(res => {
      this.projectDashboard = res;
      console.log('projectDashboard ', res);

    })
  }
  receiveBidsCount(p: any) {
    this.bidCounts = p;
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
  setSelectedNav(index: number): void {
    this.selectedNav = index;
    switch (index) {
      case 1:
        this.isDraft = true;
        break;
      case 2:
        this.isOpeningForBiding = true;
        break;
      case 3:
        this.isBidingClosedExpired = true;
        break;
      case 4:
        this.isWinnerSelected = true;
        break;
      case 5:
        this.isUnderDevelopment = true;
        break;
      case 6:
        this.isBidUnderDevelopment = true;
        break;
      case 7:
        this.isWaitingForReview = true;
        break;
      case 8:
        this.isExcludedBids = true;
        break;
      case 9:
        this.isNominationBids = true;
        break;
      case 10:
        this.isInviteBids = true;
        break;
      case 11:
        this.isSendingBids = true;
        break;
      case 12:
        this.isPending = true;
        break;
      case 13:
        this.isWaitConfirmComplete = true;
        break;
      case 14:
        this.isCompletedByProjectOwner = true;
        break;
      case 15:
        this.isCompletedProject = true;
        break;
      case 16:
        this.isCompletedBids = true;
        break;
      case 17:
        this.isInviteByAdmin = true;
        break;
      default:
        break;
    }
  }
}
