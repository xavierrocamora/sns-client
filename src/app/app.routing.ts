import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/userEdit/userEdit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowersComponent } from './components/followers/followers.component';

// Services
import { UserGuard } from './services/user.guard';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'editProfile', component: UserEditComponent, canActivate:[UserGuard]},
    {path: 'community', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'community/:page', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'timeline', component: TimelineComponent, canActivate:[UserGuard]},
    {path: 'profile/:id', component: ProfileComponent, canActivate:[UserGuard]},
    {path: 'following/:id/:page', component: FollowingComponent, canActivate:[UserGuard]},
    {path: 'followers/:id/:page', component: FollowersComponent, canActivate:[UserGuard]},
    {path: '**', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);