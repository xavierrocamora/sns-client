// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Routes
import { MessagesRoutingModule } from './messages-routing.module';

// Components
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

@NgModule({
    declarations: [
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SentComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MessagesRoutingModule
    ],
    exports: [
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SentComponent
    ],
    providers: []
})
export class MessagesModule{}