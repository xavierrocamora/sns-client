import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'userEdit',
    templateUrl: './userEdit.component.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{
    public title: string;
    public user: User;
    public identity;
    public token;
    public status: string;
    public onErrorMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Update my data';
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
    }
       
    ngOnInit(){
        console.log('userEdit component loaded...');
        console.log(this.user);
    }

    onSubmit(){
        console.log(this.user);
        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.status = 'error';
                    this.onErrorMessage = "Failed to update the profile!";
                }else{
                    this.status = 'success';
                    // save in store the updated user 
                    localStorage.setItem('userProfile', JSON.stringify(this.user));
                    this.identity = this.user;

                    // UPLOAD USER FILES IF ANY
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

    
}