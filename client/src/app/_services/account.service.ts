
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators'
import { ReplaySubject } from 'rxjs';
import { User } from '../_models/User';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post(this.baseUrl + 'account/login',model).pipe(
      map( (response : any) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }
  register(model:any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: any)=>{
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }
  setCurrentUser(user:User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    var test:User = null;
    this.currentUserSource.next(test);
  }
}
