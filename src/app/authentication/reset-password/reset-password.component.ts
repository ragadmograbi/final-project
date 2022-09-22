import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FirebaseHelper} from "../../Utilites/firebase-helper.service";
import firebase from "firebase/compat";
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";
import AuthError = firebase.auth.AuthError;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  @Output() pageNumber = new EventEmitter<number>(true);

  constructor(private firebaseHelper: FirebaseHelper, private toaster: ToasterHelper) { }

  ngOnInit(): void {
  }

  async handleResetPassword() {
    try {
      this.toaster.createToaster(toasterTypes.info, 'Sending email...');
      await this.firebaseHelper.emailResetPassword(this.email);
      this.toaster.createToaster(toasterTypes.success, 'Email sent successfully');
      this.changePage(1);
    } catch (e: AuthError | any) {
      this.toaster.createToaster(toasterTypes.error, e.code);
    }
  }

  changePage(toPage: 1 | 2) {
    this.pageNumber.emit(toPage);
  }
}
