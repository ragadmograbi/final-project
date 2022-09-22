import {Component, Input, OnInit} from '@angular/core';
import {FirebaseHelper} from "../../Utilites/firebase-helper.service";
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";
import {NavManagerService} from "../../navbar/nav-manager.service";

export interface product {
  name: string,
  price: number,
  description: string,
  image_name: string
}


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() image_name: string;
  @Input() price: number;


  constructor(public firebase: FirebaseHelper, private toaster: ToasterHelper, private manager: NavManagerService) {
    this.name = '';
    this.description = '';
    this.price = 0;
    this.image_name = '';
  }

  ngOnInit(): void {
  }

  async addItemToCart() {
    try {
      this.toaster.createToaster(toasterTypes.info, 'Adding item to cart');
      await this.firebase.addItem(this.name);
      this.manager.increaseCartBadge();
      this.toaster.createToaster(toasterTypes.success, 'Item in cart');
    } catch (e) {
      this.toaster.createToaster(toasterTypes.error, String(e));
    }
  }
}
