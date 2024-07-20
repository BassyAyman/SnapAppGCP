import {Component} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {MessageService} from "../../services/message.service";
import {Message} from "../../interfaces/message";
import {interval, Subject, switchMap, takeUntil} from "rxjs";
import {MediaServerResponse} from "../../interfaces/media-server-response";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ImageMessage} from "../../interfaces/image-message";
import {MatDialog} from "@angular/material/dialog";
import {DialogImageComponent} from "../dialog-image/dialog-image.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  user: string = ""; //user to chat with
  messages: Message[] = [];
  currentMessage: string = "";
  selectedFile: File | null = null;
  durationInMinutes: number = 10;

  private stop$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.user = this.route.snapshot.params['user'];
    this.retrieveMessages()

    this.router.events.pipe(
      takeUntil(this.stop$)
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.stop$.next();
      }
    });
  }

  retrieveMessages() {
    interval(1000)
      .pipe(
        takeUntil(this.stop$),
        switchMap(() => this.messageService.retrieveChatMessages(this.messageService.getCurrentUser(), this.user))
      )
      .subscribe((messages: Message[]) => {
        console.debug("messages: ", messages)
        //remove outdated images
        this.messages = messages.map(message => {
          if (!this.isImageMessage(message)) {
            return message;
          }
          const imageMessage: ImageMessage = message as ImageMessage;
          if (imageMessage.creationDate) {
            const creationDate = new Date(imageMessage.creationDate)
            //set imageStorageId to null if it is outdated
            if (creationDate.getTime() + imageMessage.durationInMinutes * 60 * 1000 < new Date().getTime()) {
              imageMessage.imageStorageId = "outdated";
              return imageMessage;
            }
          }
          return imageMessage;
        });
      });
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  isImageOutdated(message: Message): boolean {
    return (message as ImageMessage).imageStorageId === "outdated";
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
    }
  }

  displayImage(message: Message) {
    const imageMessage: ImageMessage = message as ImageMessage;
    if (!imageMessage.imageStorageId) {
      console.error("No imageStorageId found in message: ", message)
      return;
    }
    this.dialog.open(DialogImageComponent, {
      data: imageMessage
    });
  }

  sendMessage() {
    //can send only a picture
    if (this.selectedFile && this.durationInMinutes) {
      this.messageService.uploadImage(this.selectedFile).subscribe(
        (response: MediaServerResponse) => {
          console.log('Upload successful:', response);
          this.messageService.sendImageMessage({
              sender: this.messageService.getCurrentUser(),
              receiver: this.user,
              content: this.currentMessage,
              durationInMinutes: 10,
              creationDate: null,
              imageStorageId: response.data
            }
          ).subscribe(
            (response: any) => {
              console.log('Message sent successfully:', response);
              this.currentMessage = "";
              this.snackBar.open(`Message sent successfully`, "close", {
                duration: 2000
              });
            });
        },
        (error) => {
          console.log('Upload error:', error);
          this.snackBar.open("Upload error", "close", {
            duration: 2000
          });
        });
      return;
    }

    //can send only a text message if text is not empty
    if (this.currentMessage.length > 0 && this.durationInMinutes) {
      this.messageService.sendTextMessage({
        sender: this.messageService.getCurrentUser(),
        receiver: this.user,
        content: this.currentMessage,
        durationInMinutes: 10,
        creationDate: null
      }).subscribe((message: Message) => {
        console.log('Message sent successfully:', message);
        this.currentMessage = "";
      });
    }
  }

  isImageMessage(message: Message): boolean {
    return (message as ImageMessage).imageStorageId !== undefined;
  }

  isMyMessage(message: Message): boolean {
    return message.sender === this.messageService.getCurrentUser();
  }
}
