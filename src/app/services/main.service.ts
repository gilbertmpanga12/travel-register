import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  user!:  any;
  isLoading: boolean = false;
  constructor(private router: Router, private auth: AngularFireAuth, private http: HttpClient) {
    this.auth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      };
    });
   }

   async login(email: string, password: string) {
    this.isLoading = true;
    
    await this.auth.signInWithEmailAndPassword(email,password);
  }

  async signOut(){
    await this.auth.signOut();
    this.router.navigate(['/auth']);
  }


  get userId(): string{
    const userData:any = localStorage.getItem('user');
    const user = JSON.parse(userData);
    return user["uid"];
  }

  

}