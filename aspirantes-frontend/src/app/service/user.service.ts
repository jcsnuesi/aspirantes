import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable} from "@angular/core";
import {Observable} from "rxjs";
import { global } from "./global";
import { CookieService } from "ngx-cookie-service";


@Injectable()
export class UserService{

    public url:string;
    public identity:any;
    public token: any;

    constructor(private _http:HttpClient,
        private _cookies:CookieService){
        this.url = global.url;
    }

    registrarUsuario(user:any):Observable<any>{
     
        
        var params = JSON.stringify(user)
        var header = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'create-user', params, {headers:header})

    }

    login(user:any, gettoken=false):Observable<any>{

        if (gettoken != false) {

            user.token = gettoken
            
        }
        var params = JSON.stringify(user)
        var header = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params,{headers:header})

    }
    getIdentidad(){
       
        return JSON.parse(this._cookies.get('identity') || "false")
    }
    getToken(){

        return this._cookies.get('token')
    }

    getAvatar(filename:string):Observable<Object>{

        return this._http.get(this.url + 'avatar/' + filename)
    }
    cookiesDestroy(){

        this._cookies.delete('identity')
        this._cookies.delete('token')
    }

    grupoCodigo(id: string, token: string):Observable<any>{

        var header = new HttpHeaders().set('Content-Type','application/json').set('Authorization', token)

       return this._http.get(this.url + 'grupo-total-aspirantes/'+id, {headers:header})
   }
   


    grupoCodigoById(id: string, token: string): Observable<any> {

        var header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

        return this._http.get(this.url + 'gruposId/' + id, { headers: header })
    }


   crearCodigo(codigo:string, token:string):Observable<any>{

      var header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

       return this._http.post(this.url + 'crear-grupos', codigo,{ headers: header })


   }
   
    getCodigos(token: string):Observable<any>{

        var header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

        return this._http.get(this.url + 'grupos', { headers: header })
   }

    crearAspirante(aspirante: any, token: string): Observable<any> {

        var nuevo_aspirante = aspirante

        var header = new HttpHeaders().set('Authorization', token)

        return this._http.post(this.url + 'crear-aspirante', nuevo_aspirante , { headers: header })


    }

    crearAspiranteFile(aspirante: any, token: string): Observable<any> {

        var nuevo_aspirante = aspirante

        var header = new HttpHeaders().set('Authorization', token)

        return this._http.post(this.url + 'crear-aspiranteFile', nuevo_aspirante , { headers: header })


    }

    actualizarAspirante(data:any, token:string):Observable<any>{

        var params = JSON.stringify(data)

        var header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)
       
        return this._http.put(this.url + 'actualizar-aspirante', params, {headers:header})

    }

    
    actualizarAspiranteFile(data:any, token:string):Observable<any>{

        var params = JSON.stringify(data)

        var header = new HttpHeaders().set('Content-Type','application/json').set('Authorization', token)

        return this._http.put(this.url + 'actualizar-aspiranteFile', params, {headers:header})

    }


    getAspirante(ced:string, token:string):Observable<any>{

        var header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)


        return this._http.get(this.url + 'aspirante/'+ced, { headers: header })
    }
}
