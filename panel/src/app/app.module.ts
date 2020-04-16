import {HttpClientModule} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule, Routes} from "@angular/router";
import {StoreModule} from "@ngrx/store";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {CookieService} from "ngx-cookie-service";
import {ToastrModule} from "ngx-toastr";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HeaderComponent} from "./components/header/header.component";
import {CreateVoteModalComponent} from "./modals/create-vote-modal/create-vote-modal.component";
import {ViewVoteModalComponent} from "./modals/view-vote-modal/view-vote-modal.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {SsoPageComponent} from "./pages/sso-page/sso-page.component";
import {VotePageComponent} from "./pages/vote-page/vote-page.component";
import {NotificationService} from "./services/notification.service";
import {userReducer} from "./store/reducers/user-reducer";

const routes: Routes = [
  {path: "", component: ProfilePageComponent},
  {path: "home", redirectTo: ""},
  {path: "sso", component: SsoPageComponent},
  {path: "profile", component: ProfilePageComponent},
  {path: "votes", component: VotePageComponent},
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfilePageComponent,
    VotePageComponent,
    ViewVoteModalComponent,
    CreateVoteModalComponent,
    SsoPageComponent,
  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot({
      user: userReducer,
    }),
  ],
  providers: [NotificationService, CookieService],
})
export class AppModule {
}
