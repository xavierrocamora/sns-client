import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: [UserService]
})

export class RegisterComponent implements OnInit{

    public title:string;
    public user: User;
    public responseStatus: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Register an account.';
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
        console.log('Register component loaded...')
    }

    onSubmit(registerForm){
        this._userService.register(this.user).subscribe(
            response => {
                console.log(response);
                if (response.user && response.user._id){
                    console.log(response.user);
                    this.responseStatus = 'success';
                    registerForm.reset();
                }else{
                    this.responseStatus = 'error';
                }
                
            },
            error => {
                console.log(<any>error);
            }
        );
    }

}