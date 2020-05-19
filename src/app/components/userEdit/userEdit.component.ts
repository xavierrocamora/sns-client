import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'userEdit',
    templateUrl: './userEdit.component.html',
    providers: [UserService, UploadService]
})

export class UserEditComponent implements OnInit{
    public title: string;
    public user: User;
    public identity;
    public token;
    public status: string;
    public onErrorMessage: string;
    public filesToUpload: Array<File>;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService
    ){
        this.title = 'Update my data';
        this.url = GLOBAL.url;
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
    }
       
    ngOnInit(){
        console.log('userEdit component loaded...');
    }

    onSubmit(){
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
                    this._uploadService.makeFileRequest(this.url + 'users/uploadImg/' + this.user._id,
                    [], this.filesToUpload, this.token, 'image')
                    .then((result: any) => {
                        this.user.image = result.user.image;
                        localStorage.setItem('userProfile', JSON.stringify(this.user));

                    });
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

    // use angular form event (change) to "capture" the files added on formfield type file
    onFileChange(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    
}