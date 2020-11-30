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
    selector: 'received',
    templateUrl: './received.component.html',
    providers: [FollowService, MessageService]
})
export class ReceivedComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public url;
    public status: string;
    public messages: Message[];
    public page;
    public prevPage;
    public nextPage;
    public total;
    public pages;
    public loading: boolean;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService
    ){
        this.title = 'Received messages';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('received component loaded');
        this.loading = true;
        this.currentPage();
    }

    currentPage(){
        // get the page parameter from url and convert it to integer (+)
        this._route.params.subscribe(params =>{
            let page = +params['page'];

            if(!params['page']){
                page = 1;
            }

            if(!page){
                page = 1;
            }else{
                this.nextPage = page + 1;
                this.prevPage = page -1;

                if(this.prevPage <=0){
                    this.prevPage = 1;
                }
            }
            this.page = page;

            // get the messages sent by the user
            this.getMessages(this.token, this.page);
            
        });
    }

    getMessages(token, page){
        this._messageService.getMessages(token, page).subscribe(
            response => {
                if (!response.messages){
                    this.status = 'error';
                    this.loading = false;
                }else{
                    this.total = response.total;
                    this.pages = response.pages;
                    this.messages = response.messages;
                    this.loading = false;       
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    //this.onErrorMessage = errorMessage.error.message;
                    this.status = 'error';
                    this.loading = false;
                }
                
            }
        );
    }

    markAsRead(id, read){
        console.log(id);
        if (read == 'false'){
            this._messageService.setAsRead(this.token, id).subscribe(
                response => {
                    if (!response.message){
                        this.status = 'error';
                    }else{
                        // don't refresh the page, instead
                        // search for the element in messages and modify read property
                        let search = this.messages.findIndex(message => message._id == id );
                        if (search != -1){
                            console.log(search);
                            this.messages[search].read = 'true';
                            this.status = 'success';
                            console.log('message ' + id + ' marked as read');
                        }else{
                            this.status = 'error';
                        }     
                        
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