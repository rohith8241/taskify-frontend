import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { BehaviorSubject, firstValueFrom} from 'rxjs';


@Injectable({
    providedIn: 'root'
  })

export class AppService {

    private baseUrl = `${environment.apiUrl}/api/`;

    services: any  = {
        createTask: {
            url:'tasks',
            type: 'POST'
        },

        getTasks:{
            url:'tasks',
            type: 'GET'
        },
        updateTask:{
            url:'tasks',
            type: 'PUT'
        },
        deleteTask:{
            url:'tasks',
            type: 'DELETE'
        }
    };

    signIn(){
        document.location.href = `${environment.apiUrl}/login`;
    }

    constructor(
        private http: HttpClient
    ){

    }

    async send(serviceName:string,options:any):Promise<any> {
        const request = this.services[serviceName];
        if (!request) { return Promise.reject({ msg: 'service doesn\'t exist', status: 404 }); }

        if((serviceName === 'getTasks' || serviceName === 'updateTask' || serviceName === 'deleteTask') && options.id){
            console.log("options inside service", options)
            request.url = 'tasks'
            request.url = request.url +`/${options.id}`
            console.log("request.url", request.url)
        }
        if(serviceName === 'createTask' || serviceName === 'getTasks' || serviceName === 'updateTask' || serviceName === 'deleteTask'){
            console.log("request", request.url);
            if(request.type == 'PUT'){
                return firstValueFrom(this.http.request(
                    request.type,
                    this.baseUrl + request.url,{
                        body: options,
                        observe:'response',
                        withCredentials:true
                    })).then( res => {
                        request.url = 'tasks'
                        return res
                    }                    
                    ).catch(async e => {
                        console.log("error in appService,", e)
                    })
            }else{
            return firstValueFrom(this.http.request(
                request.type,
                this.baseUrl + request.url,{
                    body: request.type !== 'GET' ? options : undefined,
                    params: request.type !== 'GET'  ? options : {} ,
                    observe:'response',
                    withCredentials:true
                })).then( res => {
                    request.url = 'tasks'
                    return res
                }                    
                ).catch(async e => {
                    console.log("error in appService,", e)
                })
            }
        }
    }

    
}