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
  public isAdmin: boolean = true;
  public name: string = '';
  public info: string = '';
  public age: number = 0;
  public donate: number = 0;

  constructor(private router: Router, private firestore: FirebaseHelper, private toaster: ToasterHelper, public manager: NavManagerService) { }


  ngOnInit(): void {
    this.manager.currentBadgeNumber.subscribe(num => this.badgeCount = num);
    this.firestore.isAdmin().then(result => this.isAdmin = result);
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

  async addChild() {
    await this.manager.resetCartBadge();
    await this.router.navigateByUrl('/cart');
  }

  async addChildFirebase() {
    try{

      console.log(this.age)
      await this.firestore.addNewChild(
        this.age,
        this.name,
        this.donate,
        this.info
      )
      this.toaster.createToaster(toasterTypes.success, 'child added');
      } catch (e) {
        this.toaster.createToaster(toasterTypes.error, 'Failed: ' + e);
    }
  
    
  }
  async changeProfilePicture(event: any) {
    // const elem = document.getElementById('change_profile_picture');
    // if (!elem)
    //     return;
    const reader = new FileReader();

    const fileToUpload: any = event.target?.files[0];
    reader.readAsDataURL(fileToUpload);
    reader.onload = async () => {
        // this.loadingMessage = 'Updating Profile Picture';
        // this.isLoading = true;
        // this.notificationService.createNotification(
        //     notificationTypes.info,
        //     'Updating image'
        // )
        const imgFile = reader.result as string;
        const imageType = imgFile.slice(5, imgFile.indexOf(';'));
        const data = imgFile.slice(imgFile.indexOf(',') + 1);
        await this.firestore.updateProfilePicture(data, imageType,this.name);
        // this.notificationService.createNotification(
        //     notificationTypes.success,
        //     'Your image been updated successfully'
        // )
        // this.isLoading = false;
    }
}
}
