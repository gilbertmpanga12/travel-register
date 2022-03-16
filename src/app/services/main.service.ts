import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import firebase from '@firebase/app-compat';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  allFiles: any[] = [];
  percentageChangesStatus: any;
  user!:  any;
  isLoading: boolean = false;
  private itemsCollection!: AngularFirestoreCollection<any>;
  private pageNumber!: AngularFirestoreCollection<any>;
  constructor(private router: Router, private auth: AngularFireAuth, private http: HttpClient, 
    private readonly afs: AngularFirestore,private storage: AngularFireStorage,  public dialog: MatDialog) {
    this.auth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.itemsCollection = this.afs.collection<any>('userData');
        this.pageNumber = this.afs.collection<any>('pageNumber');
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

  async incrementPageNumber(){
    try{
      const increment = firebase.firestore.FieldValue.increment(1);
      return await this.pageNumber.doc('page').update({page: increment});
     }catch(e){
      throw e;
     }
  }

  async uploadNow(files:any[],data:any){
    for(let file of  files){
        this.startUpload(file,data);
    }
  }

  async startUpload(file: any,data:any) {
    const userId:any = await firebase.auth().currentUser?.uid;
    const filePath = `users_${userId}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
     this.percentageChangesStatus = task.percentageChanges();
    
     return task.snapshotChanges().pipe(
       finalize(() => {
         const downloadURL = fileRef.getDownloadURL();
         downloadURL.subscribe(async (url) => {
          this.allFiles.push(url);
          if(this.allFiles.length===4){
            data['picture']=this.allFiles;
            return this.itemsCollection.doc(data.uid).set(data).then(() =>{
              this.storeDocuments(data).then(() => {
                this.incrementPageNumber().then(() => {
                  this.pageNumber.doc('page').get().forEach(doc => {
                    const item = doc.data().page;
                    this.itemsCollection.doc(data.uid).update({pageNumber:item}).then(()=>null).catch(e => console.log(e));
                    this.isLoading =  false;
                    this.dialog.open(SpinnerComponent, {
                      width:'300px',
                      height:'340px'
                    });
                    return true;
                  });
                });
              }).catch((e) => {
                this.isLoading =  false;
                alert(e)});
          }).catch((err) => {
            this.isLoading =  false;
            throw 'Something went wrong while updating data, try again!';
          });
          }

         });

       } )
    ).subscribe();
   }

}