import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'following',
    templateUrl: './following.component.html',
    providers: [UserService, FollowService]
})
export class FollowingComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public page;
    public nextPage;
    public prevPage;
    public onErrorMessage;
    public status: string;
    public pages;
    public total;
    public url;
    public loading: boolean;
     
    // id of the user whose page of users being followed by him/her must be shown
    public userPageId;

    // users followed by a specified user
    // needed to determinate all users to be shown as followed by a specified user
    public users: User[];

    // array of ids users followed by the authenticated user
    // needed to determinate if authenticated user can follow/unfollow that user
    // when creating a new user component in the view
    public followedUsers;

    // variable of type User, mainly needed to get the user's name in the page title
    public user = User;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ){
        this.title = 'Users being followed by ';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Follows component loaded...');
        this.loading = true;
        this.currentPage();
    }

    currentPage(){
        // get the page parameter from url and convert it to integer (+)
        this._route.params.subscribe(params =>{
            let userId = params['id'];
            this.userPageId = userId
            let page = +params['page'];
            this.page = page;

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

            // get the user and the user being followed by that user
            this.getUser(userId, page);
            
        });
    }

    // get all users followed by a given user
    getFollows(userId, page){
        this._followService.getFollowedUsers(this.token, userId, page).subscribe(
            response => {
                if(!response.follows){
                    this.status = 'error';
                    this.loading = false;
                }else{
                    this.total = response.total;
                    this.pages = response.pages;
                    
                    this.users=[];
                    this.followedUsers=[];
                    let i;
                    for ( i = 0; i < response.follows.length; i++){
                        this.users.push(response.follows[i].followedUser);
                    }
                    this.followedUsers = response.followedUsers;
                    
                    if(page > response.pages){
                        this._router.navigate(['/following',userId, 1]);
                    }
                    this.loading = false;
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error.message;
                    this.status = 'error';
                    this.loading = false;
                }
                
            }
        );
    }

    
    // method to get data from a specified user as well as the users being followed by that user
    getUser(userId, page){
        this._userService.getUser(userId).subscribe(
            response => {
                if(response.user){
                    this.user = response.user;
                    // get a list of users currently being followed by that user
                    this.getFollows(userId, page);
                }else{
                    this._router.navigate(['/home']);
                }

            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error.message;
                    this.status = 'error';
                    this.loading = false;
                }         
            }
        );

    }

}