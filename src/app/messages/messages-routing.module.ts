// Here we define the internal route configuration
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

// Services
import { UserGuard } from '../services/user.guard';

// This routing system features children routes
// just concat children path to main path in order to get the full route path
// example:  /messages/send
const messagesRoutes: Routes = [
    {
        path: 'messages',
        component: MainComponent,
        children: [
            {path: '', redirectTo: 'received', pathMatch: 'full'},
            {path: 'send', component: AddComponent, canActivate:[UserGuard]},
            {path: 'received', component: ReceivedComponent, canActivate:[UserGuard]},
            {path: 'sent', component: SentComponent, canActivate:[UserGuard]},
            {path: 'sent/:page', component: SentComponent, canActivate:[UserGuard]},
            {path: 'received/:page', component: ReceivedComponent, canActivate:[UserGuard]},
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(messagesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MessagesRoutingModule{}