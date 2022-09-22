import {Component, OnInit} from '@angular/core';
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";
import {FirebaseHelper} from "../../Utilites/firebase-helper.service";
import firebase from "firebase/compat";
import AuthError = firebase.auth.AuthError;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  phoneNumber: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordStrength: number = 0;
  strongPassword;
  mediumPassword;
  constructor(private toaster: ToasterHelper, private firebase: FirebaseHelper) {
    this.strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    this.mediumPassword = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  }

  ngOnInit(): void {
  }

  async changePassword() {
    if (this.oldPassword === '') {
      this.toaster.createToaster(toasterTypes.error, 'Must enter old password');
      return;
    }
    if (this.newPassword === '') {
      this.toaster.createToaster(toasterTypes.error, 'Must enter new password');
      return;
    }
    if (this.confirmPassword === '') {
      this.toaster.createToaster(toasterTypes.error, 'Must enter confirm password');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toaster.createToaster(toasterTypes.error, 'Passwords do not match');
      return;
    }
    try {
      this.toaster.createToaster(toasterTypes.info, 'Changing password please wait...');
      await this.firebase.changePassword(this.oldPassword, this.newPassword);
      this.toaster.createToaster(toasterTypes.success, 'Password changed successfully');
      document.getElementById('closeModal')?.click();
      await this.firebase.logout();
    } catch (e: AuthError | any) {
      this.toaster.createToaster(toasterTypes.error, e.code);
    }
  }

  changeUserData() {

  }

  onPasswordChange() {
    const progressbar = document.getElementById('passwordStrength');
    if(this.newPassword === '') {
      this.passwordStrength = 0;
      return;
    }
    if (progressbar) {
      if(this.strongPassword.test(this.newPassword)) {
        this.passwordStrength = 100;
        progressbar.className = `progress-bar bg-success`;
      } else if (this.mediumPassword.test(this.newPassword)) {
        this.passwordStrength = 50;
        progressbar.className = `progress-bar bg-warning`;
      } else {
        this.passwordStrength = 25;
        progressbar.className = `progress-bar bg-danger`;
      }
    }
  }

  clearForm() {
    this.phoneNumber = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
