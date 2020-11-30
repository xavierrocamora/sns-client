import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService]
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
    public loading: boolean;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Community';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Users component loaded...');
        this.loading = true;
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
                    this.loading = false;
                }else{
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.followedUsers = response.followedUsers;
                    if(page > response.pages){
                        this._router.navigate(['/community',1]);
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

}