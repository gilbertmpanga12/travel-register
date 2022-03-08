import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  user!:  any;
  isLoading: boolean = false;
  private itemsCollection!: AngularFirestoreCollection<any>;
  constructor(private router: Router, private auth: AngularFireAuth, private http: HttpClient, 
    private readonly afs: AngularFirestore,) {
    
    this.auth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.itemsCollection = this.afs.collection<any>('travelData');
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

  getIdToken (): Observable<any> {
    return this.auth.authState.pipe(
      tap((user) => {
        if (user) {
          return of(user.getIdToken());
        } else {
          return of;
        }
      }),
      catchError(err => of(err))
    );
  };

  async storeDocuments(data:any){
    try{
      return await this.itemsCollection.doc(this.userId).set(data);
     }catch(e){
      throw e;
     }
  };

}