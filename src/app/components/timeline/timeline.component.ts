import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
declare var $: any;

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, UploadService, PublicationService]
})

export class TimelineComponent implements OnInit{
    public identity;
    public token;
    public title: string;
    public url: string;
    public status: string;
    public page;
    public pages;
    public total;
    public itemsPerPage;
    public publications: Publication[];
    public reachedEnd = false;
    public showImage;
    public loading: boolean;
    public onErrorMessage;
    public hidden;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ){
        this.title = "Timeline";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
    }

    ngOnInit(){
        console.log('Timeline component loaded...');
        this.loading = true;
        this.hidden = 'true';
        this.getPublications(this.page);
    }

    // method to get all the publications from a given user and those from the users
    // being followed
    getPublications(page, stackPublications = false){
        this._publicationService.getPublications(this.token, page).subscribe(
            response => {
                if(response.publications){
                    this.total = response.total;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPage;
                   
                    // if the flag is false then refresh the array with the new publications
                    if(!stackPublications){
                        this.publications = response.publications;
                    }else{
                    // otherwise add the new publications to the current array
                        var stackedPublications = this.publications;
                        var nextPagePublications = response.publications;
                        this.publications = stackedPublications.concat(nextPagePublications);
                        
                        // and smoothly scroll down to show the newly added publications
                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500); 
                    }

                     // if limit of total publications
                    // hasn't been reached don't show the button for loading more
                    if(this.publications.length == (this.total)){
                        this.reachedEnd = true;
                    }
                    this.status = 'success';
                    this.loading = false;
                }else{
                    this.status = 'error';
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

    // method to show paginated publications with an infinite scroll effect
    showMore(){
        if(this.publications.length == (this.total)){
            this.reachedEnd = true;
        }else{
            this.page += 1;
        }
        this.getPublications(this.page, true);
    }

    // show last publications
    refresh(event){
        this.getPublications(1);
    }

    // refresh the publications upon successful deletion of a publication
    publicationDeleted(event){
        if (event.deleted == 'true'){
            this.getPublications(1);
        }else{
            this.status = 'error';
            this.onErrorMessage ="Publication could not be deleted"
        }
    }

}