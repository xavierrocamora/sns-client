import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef } from "@angular/core";
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { SharedService } from '../../services/shared.service';

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
    public onErrorMessage: string;
    public onSuccessMessage: string;
    public updateSignalSubscription: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _uploadService: UploadService,
        private _sharedService: SharedService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.getCounters();
        this.url = GLOBAL.url;
        this.publication = new Publication("", this.identity._id, "", "", "");
        // start hearing for any signal (sent by a publication or user) 
        // to update the stat counters.
        this.updateSignalSubscription = this._sharedService.updateSignal.subscribe((message: string) => {
            console.log('Message: ', message);
            this.getCounters(); 
        });
    }

    @ViewChild('myFileInputField') fileField: ElementRef;

    ngOnInit(){
        console.log("Sidebar component loaded...");
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        // REALLY IMPORTANT
        // otherwise signals from other instances of sidebar start stacking
        // each time a component emits a new signal
        // and are sent all at once
        this.updateSignalSubscription.unsubscribe();
    }

    // method for sending a petition to create a new publication
    onSubmit(form, $event){
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if(response.publication){
                    // once response returns publication id
                    // UPLOAD USER FILES IF ANY
                    if (this.filesToUpload != undefined && this.filesToUpload.length > 0) {
                        this._uploadService.makeFileRequest(this.url + 'publications/uploadImg/' + response.publication._id,
                    [], this.filesToUpload, this.token, 'image')
                    .then((result: any) => {
                        this.status = 'success';
                        this.onSuccessMessage = 'Publication successfully created';
                        this.getCounters();
                        // reset the form upon 
                        //successfully creating a publication !
                        this.fileField.nativeElement.value = "";
                        this.filesToUpload = [];
                        form.reset();
                        // Redirect and trigger event
                        this._router.navigate(['/timeline']);
                        this.sent.emit({send: 'true'});
                    }).catch(err => {
                        // there was an error
                        this.status = 'error';
                        this.onErrorMessage = err.message;
                        // Reset the form
                        this.fileField.nativeElement.value = "";
                        this.filesToUpload = [];
                        form.reset();
                    });

                    }else{     
                        this.status = 'success';
                        this.onSuccessMessage = 'Publication successfully created';
                        this.getCounters();
                        // reset the form upon 
                        //successfully creating a publication without image
                        // and redirect 
                        form.reset();
                        this._router.navigate(['/timeline']);
                        this.sent.emit({send: 'true'});
                    }
                     
                }else{
                    // failed to publish a publication
                    this.status = 'error';
                    this.onErrorMessage ="Failed to create a publication";
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

    // method for uploading any file attached to a publication
    // use angular form event (change) to "capture" the files added on formfield type file
    // then proceed to validate the file extension
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        let file = this.filesToUpload[0];
        let name = file.name.split('\.');
        let extension = name[1];
        // assuming that this file has any extension
        if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'gif') {
            console.log('Good file extension!');
          }
          else {
            // file extension is not allowed, then clean the input file field and array
            fileInput.target.value = '';
            this.onErrorMessage = 'Wrong file extension! Only jpg, png, gif and jpeg files';
            this.status = 'error';
            this.filesToUpload = [];
          }
    }

    // Output
    @Output() sent = new EventEmitter();
    // auxiliary function to inform the parent Timeline component
    // that a new publication was done
    sendPublication(event){
        this.sent.emit({send: 'true'});
    }

    // get statistic counters for the user
    getCounters(){
        this._userService.getCounters().subscribe(
            response => {
                this.statCounters = response;
                // publicate new statCounters into service so that profile can get them
                //this._sharedService.statCounters.next(this.statCounters);
                //this.status = 'success';
                //this.onSuccessMessage = 'Publication has been deleted';
            },
            error => {
                let errorMessage = <any>error;

                if(errorMessage != null){
                    //this.onErrorMessage = 'Publication could not be deleted';
                    this.status = 'error';
                }
            }
        );
    }
}