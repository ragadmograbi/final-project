import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavManagerService {

  public add_actionsSource = new BehaviorSubject<number>(0);
  currentBadgeNumber = this.add_actionsSource.asObservable();
  constructor() { }

  public increaseCartBadge() {
    this.add_actionsSource.next(this.add_actionsSource.getValue() + 1);
  }
  public resetCartBadge() {
    this.add_actionsSource.next(0);
  }
}
