import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { Follow } from '../../../models/follow';
import { FollowService } from '../../../services/follow.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    providers: [FollowService, MessageService]
})
export class AddComponent implements OnInit{
    public title: string;
    public message: Message;
    public identity;
    public token;
    public url;
    public status: string;
    public followers;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService
    ){
        this.title = 'Send a message';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.message = new Message('', this.identity._id, '', '', '', '');
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('add component loaded');
        this.getMyFollows();
    }

    // method to get a list of followers to send messages to
    getMyFollows(){
        this._followService.getMyFollows(this.token).subscribe(
            response => {
                // 
                this.followers = response.follows;

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

    onSubmit(form){
        console.log(this.message);
        this._messageService.addMessage(this.token, this.message).subscribe(
            response => {
                if (response.message){
                    this.status = 'success';
                    form.reset();
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