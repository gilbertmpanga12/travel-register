import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,  Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { take, map, tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MainGuard implements  CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.authState
    .pipe(take(1),map(user => {
      return !!user;
    }), tap(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['/auth']);
      }
  }));
    
  }
  
}