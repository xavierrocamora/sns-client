import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { SharedService } from '../../services/shared.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    providers: [UserService, FollowService]
})

export class ProfileComponent implements OnInit{
    public title: string;
    public user: User;
    public status: string;
    public identity;
    public token;
    public statCounters;
    public url;
    public following;
    public followed;
    public statCountersSubscription: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService,
        private _sharedService: SharedService
    ){
        this.title = 'Profile';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.following = false;
        this.followed = false;
        // start hearing from service for any change on statCounters
        this.statCountersSubscription = this._sharedService.statCounters.subscribe((counters: object) => {
            console.log('Counters: ', counters);
            this.statCounters = counters; 
        });
    }

    ngOnInit(){
        console.log('Profile component loaded...');
        this.loadPage();
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this.statCountersSubscription.unsubscribe();
    }

    loadPage(){
        this._route.params.subscribe(params => {
            let id = params['id'];

            this.getUser(id);
            this.getCounters(id);
        });
    }

    // method for getting the data concerning an user and if the given user is following
    // or being followed by the authenticated user
    getUser(id){
        this._userService.getUser(id).subscribe(
            response =>{
                if(response.user){
                    this.user = response.user;

                    // set value for flag following
                    if(response.following && response.following._id){
                        this.following = true;

                    }else{
                        this.following = false;

                    }

                    // set value for flag followed
                    if(response.followed && response.followed._id){
                        this.followed = true;

                    }else{
                        this.followed = false;
                    }

                }else{
                    this.status = 'error';
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    //this.onErrorMessage = errorMessage.error.message;
                    this.status = 'error';
                }
                // redirect ot the logged user profile
                this._router.navigate(['/profile', this.identity._id]);
            }
        );
    }

    // get statistic counters for a specified user id
    getCounters(id){
        this._userService.getCounters(id).subscribe(
            response => {
                this.statCounters = response;
                this.status = 'success';
            },
            error => {
                let errorMessage = <any>error;

                if(errorMessage != null){
                    //this.onErrorMessage = errorMessage.error;
                    this.status = 'error';
                }
            }
        );
    }

    followUser(followed){
        let follow = new Follow('',this.identity._id, followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response =>{
                if(!response.follow.followedUser){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    // set value for flag following
                    this.following = true;
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

     // receive an user id
    // send petition to stop following that user
    unfollowUser(followed){
        
        this._followService.deleteFollow(this.token, followed).subscribe(
            response => {
                if(!response){
                    this.status = 'error';
                }else{
                    this.following = false;
                    this.status = 'success';    
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

    // pair of auxiliary functions to help the "follow/unfollow button switching" effect
    public followUserOver;
    mouseEnter(user_id){
        this.followUserOver = user_id;
    }

    mouseLeave(){
        this.followUserOver = 0;
    }


}