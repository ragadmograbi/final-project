import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from "@angular/router";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatBadgeModule} from "@angular/material/badge";

// ---- Services ----
import {ToastContainerModule, ToastrModule} from 'ngx-toastr';
import {ToastService, AngularToastifyModule} from "angular-toastify";
import {FirebaseHelper} from "./Utilites/firebase-helper.service";

// ---- Components ----
import {AppComponent} from './main/app.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {LoginComponent} from './authentication/login/login.component';
import {ResetPasswordComponent} from './authentication/reset-password/reset-password.component';
import {SignupComponent} from './authentication/signup/signup.component';
import {StoreComponent} from './store/store.component';
import {ItemComponent} from './store/item/item.component';
import {NavbarComponent} from './navbar/navbar.component';
import {CartComponent} from './cart/cart.component';
import {UserComponent} from './navbar/user/user.component';
import {CartItemComponent} from './cart/cart-item/cart-item.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', component: AuthenticationComponent},
  {path: 'store', pathMatch: 'full', component: StoreComponent},
  {path: 'cart', pathMatch: 'full', component: CartComponent},
  {path: '', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    AuthenticationComponent,
    StoreComponent,
    ItemComponent,
    NavbarComponent,
    CartComponent,
    UserComponent,
    CartItemComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    ToastrModule.forRoot(
      {
        preventDuplicates: true,
        timeOut: 2000,
        autoDismiss: true,
        positionClass: 'toast-top-center',
      }
    ),
    MatInputModule,
    AngularToastifyModule,
    FormsModule,
    ToastContainerModule,
    MatBadgeModule
  ],
  providers: [
    FirebaseHelper,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
