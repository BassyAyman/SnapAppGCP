import {Component} from '@angular/core';
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {Message} from "../../interfaces/message";
import {DialogImageComponent} from "../dialog-image/dialog-image.component";
import {MatDialog} from "@angular/material/dialog";
import {MediaServerResponse} from "../../interfaces/media-server-response";
import {ImageMessage} from "../../interfaces/image-message";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentUser: string = '';
  allUsers: string[] = [];
  usersWithStories: string[] = [];
  selectedUserStories: Message[] = [];
  private selectedFile: any;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private messageService: MessageService, private router: Router) {
    this.currentUser = this.messageService.getCurrentUser();
    this.messageService.retrieveUsers().subscribe(
      users => this.allUsers = users
    )
    /** user with stories */
    this.messageService.retrieveAllStorySenders().subscribe(
      users => this.usersWithStories = users
    );
  }

  loadUserStories(username: string) {
    this.messageService.retrieveStoriesBySender(username).subscribe(
      stories => {
        this.selectedUserStories = stories;
        stories.forEach(story => {
          this.openImageDialog(story);
        });
      },
      error => {
        console.error('Error retrieving stories:', error);
      }
    );
  }

  openImageDialog(story: Message) {
    const dialogRef = this.dialog.open(DialogImageComponent, {
      data: story
    });
  }


  setSelectedUser(user: string) {
    this.currentUser = user;
  }

  logout() {
    localStorage.removeItem('username');
    this.messageService.setCurrentUser('');
    this.router.navigate(['/login']);
  }

  addImageToStory() {
    if (this.selectedFile) {
      this.messageService.uploadImageStory(this.selectedFile).subscribe(
        (response: MediaServerResponse) => {
          console.log('Upload successful:', response);

          const imageMessage: ImageMessage = {
            sender: this.messageService.getCurrentUser(),
            receiver: 'story',
            content: 'Story Image',
            durationInMinutes: 60 * 24,
            creationDate: new Date(),
            imageStorageId: response.data
          };

          this.messageService.sendImageMessage(imageMessage).subscribe(
            () => {
              this.snackBar.open(`Image added to story successfully`, "close", {
                duration: 2000
              });

              this.selectedFile = null;
            },
            error => {
              console.error('Error adding image to story:', error);
              this.snackBar.open(`Error adding image to story`, "close", {
                duration: 2000
              });
            }
          );

        },
        (error) => {
          console.log('Upload error:', error);
          this.snackBar.open("Upload error", "close", {
            duration: 2000
          });
        }
      );
    } else {
      this.snackBar.open("Please select an image first", "close", {
        duration: 2000
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.addImageToStory();
    }
  }
}
