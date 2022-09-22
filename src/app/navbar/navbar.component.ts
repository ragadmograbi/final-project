import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FirebaseHelper} from "../Utilites/firebase-helper.service";
import {ToasterHelper, toasterTypes} from "../Utilites/toaster-helper.service";
import {NavManagerService} from "./nav-manager.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  badgeCount: number = 0;

  constructor(private router: Router, private firestore: FirebaseHelper, private toaster: ToasterHelper, public manager: NavManagerService) {

  }

  ngOnInit(): void {
    this.manager.currentBadgeNumber.subscribe(num => this.badgeCount = num);
  }

  async handleSignOut() {
    try {
      this.toaster.createToaster(toasterTypes.info, 'Logging out');
      await new Promise(f => setTimeout(f, 1000));
      await this.firestore.logout();
      this.toaster.createToaster(toasterTypes.success, 'Logged out successfully');
    } catch (e) {
      this.toaster.createToaster(toasterTypes.error, 'Failed: ' + e);
    }
  }

  async gotoCart() {
    await this.manager.resetCartBadge();
    await this.router.navigateByUrl('/cart');
  }
}
