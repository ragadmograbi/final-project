import {Component, OnInit} from '@angular/core';



@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  page: number = 1;

  constructor() { }

  ngOnInit(): void {

  }

  changePage(toPage: number) {
    this.page = toPage;
  }
}
