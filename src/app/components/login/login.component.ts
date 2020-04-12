import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})

export class LoginComponent implements OnInit{

    public title:string;
    public user: User;
    public responseStatus: string;
    public onErrorMessage: string;
    public authenticatedUser;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Please, authenticate';
        this.user = new User(
            "",
            "",
            "",
            "",
            "",
            "",
            "USER",
            ""
        );
    }

    ngOnInit(){
        console.log('Login component loaded...')
    }

    // Log user and get user data
    onSubmit(){
        this._userService.login(this.user).subscribe(
            response => {
                console.log(response);
                this.authenticatedUser = response;
                if ( !this.authenticatedUser || !this.authenticatedUser.token){
                    this.responseStatus = 'error';
                }else{
                    this.responseStatus = 'success';

                    // Store the object
                    localStorage.setItem('authenticatedUser', JSON.stringify(this.authenticatedUser));

                    this.token = this.authenticatedUser.token;


                    // Redirect to home page
                    this._router.navigate(['/']);



                }
                

            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error;
                    this.responseStatus = 'error';
                }
            }
        );


    }

}