import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { MomentModule } from 'angular2-moment';

// Custom module for the messagery system
import { MessagesModule } from './messages/messages.module';


// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/userEdit/userEdit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowersComponent } from './components/followers/followers.component';
import { PublicationComponent} from './components/publication/publication.component';
import { UserComponent } from './components/user/user.component';

// Services
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';
import { SharedService } from './services/shared.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationsComponent,
    ProfileComponent,
    FollowingComponent,
    FollowersComponent,
    PublicationComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    MomentModule,
    MessagesModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UserGuard,
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
