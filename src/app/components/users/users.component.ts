import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public page;
    public nextPage;
    public prevPage;
    public onErrorMessage;
    public status: string;
    public pages;
    public users: User[];
    public total;
    public url;
    public followedUsers;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ){
        this.title = 'Community';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Users component loaded...');
        this.currentPage();
    }

    currentPage(){
        // get the page parameter from url and convert it to integer (+)
        this._route.params.subscribe(params =>{
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

            // get a list of users
            this.getUsers(page);
            
        });
    }

    getUsers(page){
        this._userService.getUsers(page).subscribe(
            response => {
                if(!response.users){
                    this.status = 'error';
                }else{
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.followedUsers = response.followedUsers;
                    if(page > response.pages){
                        this._router.navigate(['/community',1]);
                    }
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
    // send petition to start following that user
    followUser(followed){
        let follow = new Follow('', this.identity._id, followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                if(!response.follow.followedUser){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    // add user to followedUsers array
                    this.followedUsers.push(response.follow.followedUser);
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
                    // try to delete user from followedUsers array
                    let search = this.followedUsers.indexOf(followed);
                    if (search != -1){
                        this.followedUsers.splice(search, 1);
                        this.status = 'success';
                    }else{
                        this.status = 'error';
                    }     
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
    public followUserOver;
    mouseEnter(user_id){
        this.followUserOver = user_id;
    }
    mouseLeave(user_id){
        this.followUserOver = 0;
    }


}