import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {FirebaseHelper} from "../../Utilites/firebase-helper.service";
import firebase from "firebase/compat";
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";
import AuthError = firebase.auth.AuthError;
import FirebaseError = firebase.FirebaseError;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  @Output() pageNumber = new EventEmitter<number>(true);
  constructor(private router: Router,
              private firebaseHelper: FirebaseHelper,
              private toaster: ToasterHelper) {
  }

  ngOnInit(): void {

  }

  changePage(toPage: 2 | 3) {
    this.pageNumber.emit(toPage);
  }

  async handleLogin(google: boolean) {
    try {
      this.toaster.createToaster(toasterTypes.info, 'Logging in... ');
      if (!google)
        await this.firebaseHelper.login(this.email, this.password);
      else
        await this.firebaseHelper.googleLogin();
      this.toaster.createToaster(toasterTypes.success, 'Logged in successfully');
    } catch (e: AuthError | FirebaseError | any) {
      this.toaster.createToaster(toasterTypes.error, 'Invalid email/password');
    }
  }
}
