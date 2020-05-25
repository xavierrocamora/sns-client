import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'publication',
    templateUrl: './publication.component.html',
    providers: [UserService, PublicationService]
})

export class PublicationComponent implements OnInit{
    public identity;
    public token;
    public url: string;
    public status: string;
    public onErrorMessage: string;
    public showImage;

    @Input() publication;

    @Output() deleted = new EventEmitter();

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.showImage = 'false';
    }

    ngOnInit(){
        //console.log('Publication ' + this.publication._id + ' component loaded...');
    }


    // auxiliary function to toggle showing/hiding the image of the publication
    togglePublicationImage(){
        if (this.showImage == 'false'){
            this.showImage = 'true';
        }else{
            this.showImage = 'false';
        }
    }

    // method to delete the publication
    deletePublication(){
        this._publicationService.deletePublication(this.token, this.publication._id).subscribe(
            response =>{
                // refresh the board
                this.deleted.emit({ deleted: 'true' });
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.onErrorMessage = errorMessage.error.message;
                    this.deleted.emit({ deleted: 'false'});
                    this.status = 'error';
                }
            }

        );

    }


}