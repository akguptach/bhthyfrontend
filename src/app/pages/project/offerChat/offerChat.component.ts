import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CustomFunctions } from 'src/app/shared/customFunctions/customFunctions';
import { CustomService } from 'src/app/service/custom.service';
import * as moment from 'moment';
import { Component, OnInit ,AfterViewInit,ElementRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SignalRService } from 'src/app/service/signalR.service';
import { ProjectOfferStatus } from 'src/app/shared/ItemList/Enum';
@Component({
  selector: 'app-offer-chat',
  templateUrl: './offerChat.component.html',
  styleUrls: ['./offerChat.component.scss']
})
export class OfferChatComponent implements OnInit, AfterViewInit {
  chatRoomForm!: FormGroup;
  projectFileForm!: FormGroup;
  projectMilestoneForm!: FormGroup;
  projectFiles$!: Observable<any>;
  projectMilestones$!: Observable<any>;
  projectInvoice$ !: Observable<any>;
  projectTransactions$ !: Observable<any>;
  showModal!: boolean;
  offerInfo: any;
  myOffers: Array<any> = [];
  offersMessages: Array<any> = [];
  submitted = false;
  skip = 0;
  take = 10;
  routeUrl = 'GetByFreeLancer';
  offerId: any;
  userId: any;
  projectOfferId!: string | null;
  imageBase64!: string | ArrayBuffer | null;
  fileType: any;
  userType: any = '';
  projectDetails: any;
  projectOfferStatus = ProjectOfferStatus;
  @ViewChild('scrollMe', {static: false}) myScrollContainer: ElementRef;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public signalRService: SignalRService,
    private customFunctions: CustomFunctions,
    private authService: AuthService,
    private customService: CustomService
  ) { }

  ngOnInit() {
    moment.locale('en'); // set to english
    this.userId = this.authService.getUserId();
    this.chatRoomForm = this.formBuilder.group({
      Message: ['', Validators.required],
      file: [null],
    });
    this.projectFileForm = this.creatProjectFileForm();
    this.projectMilestoneForm = this.creatProjectMilestoneForm();
    moment.locale('en');
    this.route.paramMap.subscribe(param => {
      this.userType = param.get('userType')?.toString();
      if (param.has('offerId')) {
        this.offerId = param.get('offerId');
        this.projectOfferId = param.get('offerId');
        this.getProjectOffer();
        this.customService.Get(`ProjectOffer/GetChatRoomMessage/${this.offerId}`).subscribe(res => {
          this.offersMessages = res;
          console.log('offersMessages ', res);
        });
        this.getProjectFiles();
        this.getProjectMilestones();
        this.getProjectInvoice();
      }
    })
    const groupId = this.offerId;
    const message = {
      message: 'hello  ',
      OfferId: this.offerId
    };
    this.signalRService.connect();
    this.signalRService.joinToGroup(groupId);
    this.signalRService.onJoinToGroup();
    this.signalRService.typingInGroup(groupId);
    this.signalRService.onTyping();
    // this.signalRService.sendMessage(message);
    // this.signalRService.leaveGroup(groupId);
    // this.signalRService.onLeaveGroup();
    // this.signalRService.receiveMessageInGroup(this.offersMessages);
	//this.scrollToBottom();
  }
  getProjectOffer(): void {

    this.customService.Get(`ProjectOffer/GetDetails/${this.offerId}`).subscribe(res => {
      this.offerInfo = res.offer;
      this.projectDetails = res.projectDetails;
    });
  }
  getProjectFiles(): void {
    this.projectFiles$ = this.customService.Get(`ProjectFile/GetByProjectOffer/${this.projectOfferId}`)
  }
  getProjectMilestones(): void {
    this.projectMilestones$ = this.customService.Get(`ProjectMilestone/GetByProjectOffer/${this.projectOfferId}`)
  }
  getProjectInvoice(): void {
    this.projectInvoice$ = this.customService.Get(`ProjectMilestone/GetInvoice/${this.projectOfferId}`)
    this.projectTransactions$ = this.customService.Get(`ProjectMilestone/GetTransactions/${this.projectOfferId}`)
  }
  creatProjectFileForm(): FormGroup {
    return this.formBuilder.group({
      Name: ['', Validators.required],
      File: ['', Validators.required],
    });
  }
  creatProjectMilestoneForm(): FormGroup {
    return this.formBuilder.group({
      Name: ['', Validators.required],
      Amount: ['', Validators.required],
    });
  }
  updateOfferStatus(id: string, status: number, message: string): void {
    this.customFunctions.customConfirm(`Are You Sure To ${message}`, () => {
      this.customService.put(null, `ProjectOffer/UpdateStatus/${id}/${status}`).subscribe(res => {
        this.customFunctions.showResponseMessage(res.description, res.code)
        if (res.code <= 300) {
          this.getProjectOffer();
        }
      });
    })
  }
  sendMessage() {
    this.submitted = true;
    if (this.chatRoomForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct ', false);
      return;
    }
    const data = {
      message: this.chatRoomForm.controls.Message.value,
      offerId: this.offerId,
      attachmentType: 1,
    }
    console.log('data ', data);
    this.signalRService.sendMessage(data);
    this.chatRoomForm.reset();
    this.signalRService.receiveMessageInGroup(this.offersMessages);
    // this.customService.post(data, 'Project/FindProjectByUser').subscribe(res => {
    //   if (res) {
    //   }
    // });
  }
  ngAfterViewInit(): void {        
        this.scrollToBottom();        
  } 
  scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
  async addNewProjectFile(): Promise<any> {
    this.submitted = true;
    if (this.projectFileForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const projectFile: any = {
      name: this.projectFileForm.controls.Name.value,
      projectId: this.offerInfo.projectId,
      projectOfferId: this.offerInfo.id,
      file_Path: this.imageBase64,
      fileType: this.fileType
    };
    console.log('projectFile  ', projectFile);
    await this.customService.post(projectFile, 'ProjectFile').subscribe(async res => {
      if (res) {
        this.getProjectFiles();
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.projectFileForm.reset();
      }
    });
  }
  async addNewProjectMilestone(): Promise<any> {
    this.submitted = true;
    if (this.projectMilestoneForm.invalid) {
      this.customFunctions.showResponseMessage('Please validate All Filed is Correct   ', false);
      return;
    }
    const projectMilestone: any = {
      name: this.projectMilestoneForm.controls.Name.value,
      amount: this.projectMilestoneForm.controls.Amount.value,
      projectId: this.offerInfo.projectId,
      projectOfferId: this.offerInfo.id
    };
    console.log('projectMilestone  ', projectMilestone);
    await this.customService.post(projectMilestone, 'ProjectMilestone').subscribe(async res => {
      if (res) {
        this.getProjectMilestones();
        this.customFunctions.showResponseMessage(res.description, res.code);
        this.projectMilestoneForm.reset();
      }
    });
  }
  updateMilestoneStatus(id: string, status: number, message: string): void {
    this.customFunctions.customConfirm(`Are you Sure To ${message} This Milestone`, () => {
      this.customService.put(null, `ProjectMilestone/UpdateStatus/${id}/${status}`).subscribe(res => {
        this.customFunctions.showResponseMessage(res.description, res.code)
        if (res.code <= 300) {
          this.getProjectMilestones();
          this.getProjectInvoice();
        }
      });
    })
  }
  updateProjectFileStatus(id: string, status: number): void {
    this.customFunctions.customConfirm('Are you Sure To Accept Project File', () => {
      this.customService.put(null, `ProjectFile/UpdateStatus/${id}/${status}`).subscribe(res => {
        this.customFunctions.showResponseMessage(res.description, res.code)
        if (res.code <= 300) {
          this.getProjectMilestones();
          this.getProjectInvoice();
        }
      });
    })
  }
  onSelectFile(event: any) {
    const file = event.target.files[0];
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);
    this.fileType = ext;
    console.log('file size  ', file.size);
    if (file.size > 3254478) {
      console.log('file size larag ', file.size);
      alert('the max size of File mus be 1 MB');
      // this.customFunctions.showResponseMessage('the max size of File mus be 1 MB', 'حجم الملف اكبر من واحد ميقا بايت', false);
      return;
    }
    // const fileTypes = ['jpg', 'jpeg', 'png'];  // acceptable file types
    // const extension = file.fileName.split('.').pop().toLowerCase();  // file extension from input file
    // const isSuccess = fileTypes.indexOf(extension) > -1;  // is extension in acceptable types
    // this.fileType = extension;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // var b64 = reader.result.replace(/^data:.+;base64,/, '');
      reader.readAsDataURL(file);
      reader.onload = () => {
        //  let v : string = reader.result;
        // console.log( reader.result);
        this.imageBase64 = reader.result;
      };
      reader.onerror = error => reject(error);
    });
  }
}
