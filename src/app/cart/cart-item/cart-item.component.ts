import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {cartItem, FirebaseHelper} from "../../Utilites/firebase-helper.service";
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() data: cartItem;
  public modal_id='';
  public buttonChecked = 0; // 0 one time, 1 monthly

  @Output() removeItemEvent = new EventEmitter<string>();
  constructor(private toaster: ToasterHelper, public firebase: FirebaseHelper) {
    this.data = {
      age: 0,
      name: '',
      quantity: 0,
      info: '',
      donate: 0,
      image_name: '',
      monthlyDonate: 0,
      oneTimeDonate: 0

    }
  }

  ngOnInit(): void {
    this.modal_id=this.data.name.replace(/[ ]/g,'_');

  }

  async changeQuantity(number: number) {

    if(this.data.quantity < 2 && number < 0) {
      this.toaster.createToaster(toasterTypes.warning, 'If you wish to remove the item, use the remove button');
      return;
    }
    if (this.firebase.delay)
      return;
    this.data.quantity += number;
    await this.firebase.updateItem(this.data.name, this.data.quantity);
    this.removeItemEvent.emit('just update');
  }

  removeItem() {
    this.removeItemEvent.emit(this.data.name);
  }

  selected(number: number) {
    const OT = document.getElementById(this.data.name + 'Button' + 'OneTime');
    const MO = document.getElementById(this.data.name + 'Button' + 'Monthly');
    if (!OT || !MO) return;
    if (number === 0) {
      OT.className = 'btn btn-primary';
      MO.className = 'btn btn-secondary';
    } else {
      MO.className = 'btn btn-primary';
      OT.className = 'btn btn-secondary';
    }
    this.buttonChecked = number;
  }
}
