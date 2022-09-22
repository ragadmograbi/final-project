import {Component, OnInit} from '@angular/core';
import {cartItem, FirebaseHelper} from "../Utilites/firebase-helper.service";
import {ToasterHelper, toasterTypes} from "../Utilites/toaster-helper.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: cartItem[] = Array<cartItem>();

  public totalCount: number = 0;
  public totalPrice: number = 0;
  constructor(private firebase: FirebaseHelper, private toaster: ToasterHelper) {
    this.firebase.getUserCart().then((res) => {
      this.products = res;
      this.products.forEach((item) => {
        this.totalCount += item.quantity;
        this.totalPrice += item.price * item.quantity;
      })
    });
  }

  async ngOnInit(): Promise<void> {

  }

  updateTotals() {
    this.totalCount = this.totalPrice = 0;
    this.products.forEach((item) => {
      this.totalCount += item.quantity;
      this.totalPrice += item.price * item.quantity;
    });
  }

  async removeItem($event: string) {
    if($event === 'just update') {
      this.updateTotals();
      return;
    }
    this.toaster.createToaster(toasterTypes.info, `Removing ${$event}...`);
    this.products = this.products.filter((data) => {
      return data.name !== $event;
    });
    await this.firebase.removeItem($event);
    this.updateTotals();
    this.toaster.createToaster(toasterTypes.success, 'Removed');
  }
}
