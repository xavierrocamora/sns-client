import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    providers: [MessageService]
})
export class MessageComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public url;
    public status: string;

    @Input() message;
    @Input() mode: string;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _messageService: MessageService,
        private _userService: UserService
    ){
        this.title = 'Message ';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit(){
        console.log('message ' + this.message._id + 'component loaded');
        console.log(this.message);
        console.log(this.mode);
    }

    // function that sends a petition to mark the message as read
    markAsRead(){
        console.log(this.message._id);
        if (this.message.read == 'false'){
            this._messageService.setAsRead(this.token, this.message._id).subscribe(
                response => {
                    if (!response.message){
                        this.status = 'error';
                    }else{
                        // upon receiving a favorable response set message as read   
                        this.message.read = 'true';
                        this.status = 'success';
                        console.log('message ' + this.message._id + ' marked as read');   
                    }
                },
                error => {
                    let errorMessage = <any>error;
                    console.log(errorMessage);
    
                    if(errorMessage != null){
                        //this.onErrorMessage = errorMessage.error.message;
                        this.status = 'error';
                    }      
                }
            );
        }
    }

}