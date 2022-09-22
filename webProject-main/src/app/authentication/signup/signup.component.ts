import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FirebaseHelper} from "../../Utilites/firebase-helper.service";
import firebase from "firebase/compat";
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";
import AuthError = firebase.auth.AuthError;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.css']
})
export class SignupComponent implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  strongPassword;
  mediumPassword;
  passwordStrength = 0;

  @Output() pageNumber = new EventEmitter<number>(true);

  constructor(private firebaseHelper: FirebaseHelper, private toaster: ToasterHelper) {
    this.strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    this.mediumPassword = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  }

  ngOnInit(): void {

  }
  changePage(toPage: 1 | 3) {
    this.pageNumber.emit(toPage);
  }

  async handleSignup() {
    try{
      if (this.password !== this.confirmPassword) {
        this.toaster.createToaster(toasterTypes.error, 'Passwords do not match');
        return;
      }
      this.toaster.createToaster(toasterTypes.info, 'Creating account');
      await this.firebaseHelper.emailSignup(this.email, this.password);
      this.toaster.createToaster(toasterTypes.success, 'Account been created');
    } catch (e: AuthError | any) {
      switch (e.code) {
        case 'auth/invalid-email': this.toaster.createToaster(toasterTypes.error, 'Invalid email'); break;
        case 'auth/weak-password': this.toaster.createToaster(toasterTypes.error, 'Week password'); break;
        case 'auth/email-already-in-use': this.toaster.createToaster(toasterTypes.error, 'Email already exist'); break;
        default: this.toaster.createToaster(toasterTypes.error, e.code); break;
      }
    }
  }

  passwordChange() {
    const progressbar = document.getElementById('passwordStrength');
    if(this.password === '') {
      this.passwordStrength = 0;
      return;
    }
    if (progressbar) {
      if(this.strongPassword.test(this.password)) {
        this.passwordStrength = 100;
        progressbar.className = `progress-bar bg-success`;
      } else if (this.mediumPassword.test(this.password)) {
        this.passwordStrength = 50;
        progressbar.className = `progress-bar bg-warning`;
      } else {
        this.passwordStrength = 25;
        progressbar.className = `progress-bar bg-danger`;
      }
    }
  }
}
