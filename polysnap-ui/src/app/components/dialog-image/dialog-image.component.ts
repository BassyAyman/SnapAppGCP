import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../../services/message.service";
import {Message} from "../../interfaces/message";
import {ImageMessage} from "../../interfaces/image-message";

@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.css'],
})
export class DialogImageComponent {
  imageData: any;
  timeAgo: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImageMessage,
    public dialogRef: MatDialogRef<DialogImageComponent>,
    private messageService: MessageService) {}

  ngOnInit() {
    this.getImage();
    if (this.data.creationDate) {
      this.calculateTimeAgo(this.data.creationDate);
    }
  }

  getImage() {
    if (this.data.imageStorageId === undefined) {
      console.error('No id provided, cannot download image.');
      return;
    }
    this.messageService.downloadImage(String(this.data.imageStorageId)).subscribe((data) => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageData = reader.result;
      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
    });
  }

  calculateTimeAgo(creationDate: Date) {
    const now = new Date();
    const storyDate = new Date(creationDate);
    const diffInSeconds = Math.floor((now.getTime() - storyDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      this.timeAgo = `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      this.timeAgo = `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      this.timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      this.timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
