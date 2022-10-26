import {Component, Input, OnInit} from '@angular/core';
import {FirebaseHelper} from "../../Utilites/firebase-helper.service";
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";
import {NavManagerService} from "../../navbar/nav-manager.service";

export interface child {
  name: string,
  donate: number,
  age: number,
  info: string,
  image_name: string
}


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {  
  @Input() name: string;
  @Input() info: string;
  @Input() image_name: string;
  @Input() donate: number;
  @Input() age: number;


  constructor(public firebase: FirebaseHelper, private toaster: ToasterHelper, private manager: NavManagerService) {
    this.name = '';
    this.info = '';
    this.donate = 0;
    this.image_name = '';
    this.age = 0;
  }

  ngOnInit(): void {
  }

  async addItemToCart() {
    try {
      this.toaster.createToaster(toasterTypes.info, 'Adding child to cart');
      await this.firebase.addItem(this.name);
      this.manager.increaseCartBadge();
      this.toaster.createToaster(toasterTypes.success, 'The child was added successfully');
    } catch (e) {
      this.toaster.createToaster(toasterTypes.error, String(e));
    }
  }

  async moreInfo() {
    try {
      this.toaster.createToaster(toasterTypes.info, 'more information page');
      await this.firebase.getMoreInfo(this.name);

      this.toaster.createToaster(toasterTypes.success, 'more info about child');
      
    } catch (e) {
      this.toaster.createToaster(toasterTypes.error, String(e));
    }
  }

  
}
