import {Component, OnInit} from '@angular/core';
import {FirebaseHelper} from "../Utilites/firebase-helper.service";
import {child} from "./item/item.component";
import {Router} from "@angular/router";
import {ToasterHelper, toasterTypes} from "../Utilites/toaster-helper.service";


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  public childs: Array<child> = [];
  showStore: boolean = false;



  constructor(private router: Router, public firestore: FirebaseHelper, private toaster: ToasterHelper) {}

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    this.toaster.createToaster(toasterTypes.info, 'getting charity data');
    const data = await this.firestore.getAllProducts();
    this.toaster.createToaster(toasterTypes.success, 'loading complete');
    data.forEach((prod) => {
      this.childs.push(prod);
    })
    this.showStore = true;
  }
}
