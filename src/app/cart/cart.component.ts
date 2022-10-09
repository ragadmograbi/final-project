import {Component, OnInit} from '@angular/core';
import {cartItem, FirebaseHelper} from "../Utilites/firebase-helper.service";
import {ToasterHelper, toasterTypes} from "../Utilites/toaster-helper.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public childs: cartItem[] = Array<cartItem>();

  public totalCount: number = 0;
  public totalPrice: number = 0;
  public donatenum : number = 0;
  public monthly_donation : number = 0;
  public oneTime_donation : number = 0;
  public totalMonthly : number = 0;
  public totalOneTime : number = 0;
  constructor(private firebase: FirebaseHelper, private toaster: ToasterHelper) {
    this.firebase.getUserCart().then((res) => {
      this.childs = res;
      this.childs.forEach((item) => {
        this.totalCount += item.quantity;
        this.totalPrice += item.donate * item.quantity;
        
      })
    });
  }

  async ngOnInit(): Promise<void> {

  }

  updateTotals() {
    this.totalCount = this.totalPrice = 0;
    this.childs.forEach((item) => {
      this.totalCount += item.quantity;
      this.totalPrice += item.donate * item.quantity;
    });
  }

  async removeItem($event: string) {
    if($event === 'just update') {
      this.updateTotals();
      return;
    }
    this.toaster.createToaster(toasterTypes.info, `Removing ${$event}...`);
    this.childs = this.childs.filter((data) => {
      return data.name !== $event;
    });
    await this.firebase.removeItem($event);
    this.updateTotals();
    this.toaster.createToaster(toasterTypes.success, 'Removed');
  }
}
