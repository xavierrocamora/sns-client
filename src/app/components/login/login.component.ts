import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import jwtDecode from 'jwt-decode';

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
                    this.onErrorMessage = "User could not sign up!";
                }else{   
                    // get the token and store the object
                    // get the user data from desencripting the token
                    // and aconditionate that data before storing it
                    // as the user profile
                    this.token = this.authenticatedUser.token;
                    let decoded = jwtDecode(this.token);
                    decoded._id = decoded.id;
                    decoded.id = undefined;
                    decoded.exp = undefined;
                    decoded.iss = undefined;
                    decoded.iat = undefined;

                    localStorage.setItem('userProfile', JSON.stringify(decoded));
                    localStorage.setItem('token', JSON.stringify(this.token));

                    // Finally, get user's statistic counters
                    this.getCounters(); 
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error.message;
                    this.responseStatus = 'error';
                }
            }
        );
    }

    // get statistic counters for the signing user
    getCounters(){
        this._userService.getCounters().subscribe(
            response => {
                localStorage.setItem('statCounters', JSON.stringify(response));
                this.responseStatus = 'success';
                // Redirect to home page
                this._router.navigate(['/']);
            },
            error => {
                let errorMessage = <any>error;
                // Make sure to clear localStorage
                localStorage.clear();

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error;
                    this.responseStatus = 'error';
                }
            }
        );
    }

}