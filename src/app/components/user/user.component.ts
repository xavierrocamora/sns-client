import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { SharedService } from '../../services/shared.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    providers: [UserService, FollowService]
})
export class UserComponent implements OnInit{
    
    public identity;
    public token;
    public onErrorMessage;
    public status: string;
    public url;
    
    // component receives the user data and a flag informing if the user 
    // is being followed or not by the authentivated user
    @Input() followedUser;
    @Input() user;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService,
        private _sharedService: SharedService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('User component loaded...');
        
    }

    // receive an user id
    // send petition to start following that user
    followUser(followed){
        let follow = new Follow('', this.identity._id, followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                if(!response.follow.followedUser){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    // set flag to true
                    this.followedUser = true;
                    // tell sidebar to update stat counters
                    this._sharedService.updateSignal.next('User ' + this.user._id + ' started being followed by ' + this.identity._id);
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error.message;
                    this.status = 'error';
                }         
            }
        );

    }


     // receive an user id
    // send petition to stop following that user
    unfollowUser(followed){
        
        this._followService.deleteFollow(this.token, followed).subscribe(
            response => {
                if(!response){
                    this.status = 'error';
                }else{
                    // set flag to false
                    this.followedUser = false;
                    this.status = 'success';
                    // tell sidebar to update stat counters
                    this._sharedService.updateSignal.next('User ' + this.user._id + ' stopped being followed by ' + this.identity._id); 
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error.message;
                    this.status = 'error';
                }         
            }
        );

    }

    // auxiliary variable and functions to determinate which kind of button must be shown
    // when moving the mouse pointer over the button
    public followUserOver = false;
    mouseEnter(){
        this.followUserOver = true;
    }
    mouseLeave(){
        this.followUserOver = false;
    }

}