import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UploadService } from '../../services/upload.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit{
    public identity;
    public token;
    public statCounters;
    public url;
    public status;
    public publication: Publication;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _uploadService: UploadService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.statCounters = this._userService.getStoredCounters();
        this.url = GLOBAL.url;
        this.publication = new Publication("", this.identity._id, "", "", "");
    }

    ngOnInit(){
        console.log("Sidebar component loaded...");
    }

    // method for sending a petition to create a new publication
    onSubmit(form, $event){
        console.log(this.publication);
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if(response.publication){
                    this.publication = response.publication;
                    
                    // once response returns publication id
                    // UPLOAD USER FILES IF ANY
                    
                    this._uploadService.makeFileRequest(this.url + 'publications/uploadImg/' + response.publication._id,
                    [], this.filesToUpload, this.token, 'image')
                    .then((result: any) => {
                        this.publication.file = result.image;
                        // reset array of files
                        this.filesToUpload = [];

                        this.status = 'success';
                        // reset the form upon 
                        //successfully creating a publication !
                        form.reset();
                        this._router.navigate(['/timeline']);
                        this.sent.emit({send: 'true'});
                    });
                      
                }else{
                    this.status = 'error';
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    //this.onErrorMessage = errorMessage.error.message;
                    this.status = 'error';
                }
            }

        );
    }

    // method for uploading any file attached to a publication
    // use angular form event (change) to "capture" the files added on formfield type file
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    // Output
    @Output() sent = new EventEmitter();
    // auxiliary function to inform the parent Timeline component
    // that a new publication was done
    sendPublication(event){
        this.sent.emit({send: 'true'});
    }
}