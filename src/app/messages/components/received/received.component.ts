import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'received',
    templateUrl: './received.component.html'
})
export class ReceivedComponent implements OnInit{
    public title: string;

    constructor(){
        this.title = 'Received messages';
    }

    ngOnInit(){
        console.log('received component loaded');
    }


}