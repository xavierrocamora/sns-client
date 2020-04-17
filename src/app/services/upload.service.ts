import { Injectable } from '@angular/core';
//import { GLOBAL } from './global';

@Injectable()
export class UploadService{
    //public url: string;

    constructor(){
        //this.url = GLOBAL.url;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string,
        name: string){
            return new Promise(function(resolve, reject){
                // simulate a form
                let formData: any = new FormData();
                // object needed for ajax calls
                let xhr = new XMLHttpRequest();

                // go through all the filles and attach them to the form
                for(let i = 0; i < files.length; i++){
                    // name of the parameter, file and filename
                    formData.append(name, files[i], files[i].name);
                }

                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4){
                        if(xhr.status == 200){
                            // return the correct response
                            resolve(JSON.parse(xhr.response));
                        }else{
                            // don't send
                            reject(xhr.response);
                        }
                    }
                }

                // setup the petition
                xhr.open('POST', url, true);
                xhr.setRequestHeader('authorization', 'Token ' + token);
                xhr.send(formData);   
            });
          
        }
}