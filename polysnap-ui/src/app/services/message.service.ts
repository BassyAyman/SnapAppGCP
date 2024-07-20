import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Message} from "../interfaces/message";
import {ImageMessage} from "../interfaces/image-message";
import {MediaServerResponse} from "../interfaces/media-server-response";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private currentUser: string;

  constructor(private http: HttpClient) {
    this.currentUser = localStorage.getItem('username') || "NOT_LOGGED_IN";
  }

  setCurrentUser(username: string) {
    this.currentUser = username;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  retrieveUsers() {
    return this.http.get<string[]>(environment.receiveMsgApiUrl + '/users', {
      headers: new HttpHeaders({'Auth': environment.messageServerToken})
    });
  }

  /**
   * Retrieve stories by sender (username).
   * @param sender The username whose stories you want to retrieve.
   */
  retrieveStoriesBySender(sender: string): Observable<ImageMessage[]> {
    return this.http.get<ImageMessage[]>(`${environment.receiveMsgApiUrl}/stories/${sender}`, {
      headers: new HttpHeaders({'Auth': environment.messageServerToken})
    });
  }

  /**
   * To get the list of all users who have stories.
   */
  retrieveAllStorySenders(): Observable<string[]> {
    return this.http.get<string[]>(environment.receiveMsgApiUrl + '/stories', {
      headers: new HttpHeaders({'Auth': environment.messageServerToken})
    });
  }

  /** SOLUTION WITHOUT BACKEND ENDPOINT FOR retrieveAllStorySenders()
   *   retrieveAllStorySenders(): Observable<string[]> {
   *     return this.retrieveAllStorySenders().pipe(
   *       map(stories => stories.map(story => story.sender)),
   *       map(senders => Array.from(new Set(senders)))
   *     );
   *   }
   * @param message
   */


  sendTextMessage(message: Message) {
    return this.http.post<Message>(environment.sendMsgApiUrl + "/text", message, {
      headers: new HttpHeaders({'Auth': environment.messageServerToken})
    });
  }

  /**
   * Need to call uploadImage() first to get the mediaId
   * @param imageMessage
   */
  sendImageMessage(imageMessage: ImageMessage) {
    return this.http.post(environment.sendMsgApiUrl + "/image", imageMessage, {
      headers: new HttpHeaders({'Auth': environment.messageServerToken})
    });
  }

  downloadImage(id: string) {
    return this.http.get(environment.receiveImgApiUrl + `/downloadImage?mediaID=${id}`, {responseType: 'blob'});
  }

  uploadImage(imgFile: File): Observable<MediaServerResponse> {
    const formData = new FormData();
    formData.append('file', imgFile);
    return this.http.post<MediaServerResponse>(environment.sendImgApiUrl + "/uploads", formData);
  }

  uploadImageStory(imgFile: File): Observable<MediaServerResponse> {
    const formData = new FormData();
    formData.append('file', imgFile);
    return this.http.post<MediaServerResponse>(environment.sendImgApiUrl + "/uploadStory", formData);
  }

  retrieveChatMessages(user1: string, user2: string): Observable<Message[]> {
    return this.http.get<Message[]>(environment.receiveMsgApiUrl + `/chat?user1=${user1}&user2=${user2}`, {
      headers: new HttpHeaders({'Auth': environment.messageServerToken})
    });
  }
}
