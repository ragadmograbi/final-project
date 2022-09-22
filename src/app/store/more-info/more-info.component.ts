import {Component, Input, OnInit} from '@angular/core';
import {FirebaseHelper} from "../../Utilites/firebase-helper.service";
import {ToasterHelper, toasterTypes} from "../../Utilites/toaster-helper.service";
import {NavManagerService} from "../../navbar/nav-manager.service";
import {child} from "../item/item.component"


@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss']
})


export class MoreInfoComponent implements OnInit {


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

  async updateChildInfo() {
    
  }

  

}
