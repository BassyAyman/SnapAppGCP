import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string='';

  constructor(private router: Router, private messageService: MessageService) {
    //no login page if already logged in
    if (localStorage.getItem('username')) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (this.username.length > 0) {
      localStorage.setItem('username', this.username);
      this.messageService.setCurrentUser(this.username);
      this.router.navigate(['/home']);
    }
  }

}
