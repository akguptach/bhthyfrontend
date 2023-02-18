
import { Injectable } from '@angular/core';
import * as Signal_R from '@microsoft/signalr';
import { IHttpConnectionOptions } from '@microsoft/signalr';
import { AppConfig } from '../config/config';
import { CustomFunctions } from '../shared/customFunctions/customFunctions';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public static signalRIsConnected = false;
  private serverurl = `${this.appConfig.setting.PathAPI}MessageHub`;
  public signalRConnection!: signalR.HubConnection; // SignalR Hub Client's Connection Object

  constructor(
    private authService: AuthService,
    private appConfig: AppConfig,
    private customFunction: CustomFunctions
  ) { }

  async connect(): Promise<void> {
    const options2: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return this.authService.getJwtToken();
      }
    };
    if (SignalRService.signalRIsConnected === false) {
      this.signalRConnection = await new Signal_R.HubConnectionBuilder()
        .withUrl(this.serverurl, options2)
        .build();
      // 2.Initialize signalRConnection
      if (this.signalRConnection) {

        await this.signalRConnection
          .start()
          // tslint:disable-next-line:max-line-length
          // When new ContectingClient Connects to the Hub we will invoke JoinChannel function on the Hub,passing to it a Name of the Client and Channel ID
          .then(() => {
            SignalRService.signalRIsConnected = true; console.log('connected ');
          })
          .catch(err => console.log('Error while starting signalRConnection: ' + err));
        this.signalRConnection.on('connecting', (connecting: string) => {
          console.log('connecting ', connecting);
          // this.customFunction.showResponseMessage('connecting', 'connecting' , 'success' , 'end');
          // tslint:disable-next-line:max-line-length
          // this._snackBar.open( 'notificationRequest' , '×', { panelClass: ['mat-snakbar-success'] , horizontalPosition: 'end' , verticalPosition: 'top' , duration: 60000000 });
        });


      }
    }
  }
  onAddNewRequest(arrList: Array<any>): void {
    if (this.signalRConnection) {
      this.signalRConnection.on('NewRequest', (data: any) => {
        console.log('NewRequest', data);
        // push get Data To Array To Show The Notification In Toolbar Notification
        arrList.push(data);
        this.customFunction.showResponseMessage(data.message, data.message);
      });
    }
  }
  onAdviserRegister(arrList: Array<any>): void {
    if (this.signalRConnection) {
      this.signalRConnection.on('NewAdviser', (data: any) => {
        console.log('NewAdviser', data);
        // push get Data To Array To Show The Notification In Toolbar Notification
        arrList.push(data);
        this.customFunction.showResponseMessage(data.message, data.message);
      });
    }
  }
  joinToGroup(chatRoomId: string): void {
    if (this.signalRConnection) {
      this.signalRConnection.invoke('JoinGroup', chatRoomId).then(() => {
        console.log('join to  group done');

      }).catch(err => console.log('Error while join to group signalRConnection: ' + err));
    } else {
      this.connect().then(() => {
        this.signalRConnection.invoke('JoinGroup', chatRoomId).then(() => {
          console.log('join to  group done');
        }).catch(err => console.log('Error while join to group signalRConnection: ' + err));
      });
    }
  }
  typingInGroup(chatRoomId: string): void {
    if (this.signalRConnection) {
      this.signalRConnection.invoke('JoinGroup', chatRoomId).then(() => {
        console.log('typingInGroup done');

      }).catch(err => console.log('Error while typingInGroup to group signalRConnection: ' + err));
    }
  }
  leaveGroup(chatRoomId: string): void {
    if (this.signalRConnection) {
      this.signalRConnection.invoke('LeaveGroup', chatRoomId).then(() => {
        console.log('LeaveGroup  group done');

      }).catch(err => console.log('Error while leave group signalRConnection: ' + err));
    }
  }
  sendMessage(message: any): void {
    if (this.signalRConnection) {
      this.signalRConnection.invoke('SendMessageToGroup', message).then(() => {
        console.log('SendMessageToGroup   done');

      }).catch(err => console.log('Error while  SendMessageToGroup: ' + err));
    } else {
      this.connect().then(() => {
        this.signalRConnection.invoke('SendMessageToGroup', message).then(() => {
          console.log('SendMessageToGroup   done');
        }).catch(err => console.log('Error while  SendMessageToGroup: ' + err));
      });
    }
  }
  onJoinToGroup(): any {
    this.signalRConnection.on('JoinToGropeMessage', (message: string, userId) => {
      console.log('JoinToGropeMessage user ', userId, 'message', message);
      if (userId !== this.authService.getUserId()) {
        // tslint:disable-next-line:max-line-length
        // this._snackBar.open( message, '×', { panelClass: 'success', verticalPosition: 'top' , horizontalPosition: 'start' , duration: 3000 });
        return message;
      } else {
        return null;
      }
    });
  }
  receiveMessageInGroup(messagesList: Array<any>): any {
    this.signalRConnection.on('ReceiveMessageInGroup', (message: any) => {
      console.log('receiveMessageInGroup user ', message);
      if (!messagesList.find(m => m.id === message.id)) {
        messagesList.push(message)
      }
      return message;
    });
  }
  onLeaveGroup(): any {
    this.signalRConnection.on('UserLeaveGroup', (message: string, userId) => {
      console.log(' UserLeaveGroup user ', message, userId);
      if (userId !== this.authService.getUserId()) {
        // tslint:disable-next-line:max-line-length
        // this._snackBar.open( message, '×', { panelClass: 'success', verticalPosition: 'top' , horizontalPosition: 'start' , duration: 3000 });
        return message;
      } else {
        return null;
      }
    });
  }
  onTyping(): any {
    this.signalRConnection.on('TypingMessage', (message: any, userId) => {
      console.log('TypingMessage user ', message, userId);
      // if (userId !== this.authService.getUserId()) {
      //   return message;
      // }
    });
  }
  onUpdateProjectOffer(): any {
    this.signalRConnection.on('UpdateProjectOffer', (data: any) => {
      console.log('UpdateProjectOffer user ', data);
      this.customFunction.showResponseMessage(data.message, true);
      // if (userId !== this.authService.getUserId()) {
      //   return message;
      // }
    });
  }
  readMessage(messageId: number): void {
    if (this.signalRConnection) {
      console.log(' messageId  ', messageId);
      this.signalRConnection.invoke('IsRead', messageId).then(() => {

        this.signalRConnection.on('IsRead', (Id) => {
          console.log(' IsRead  ', Id);
          // this.customFunction.showResponseMessage('IsRead' , 'IsRead');
          // tslint:disable-next-line:max-line-length
          // this._snackBar.open( 'read meesage', '×', { panelClass: 'success', verticalPosition: 'top' , horizontalPosition: 'start' , duration: 3000 });
        });
      }).catch(err => console.log('Error while read Message : ' + err));
    }
  }

}
