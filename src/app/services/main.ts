import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap, take, finalize } from 'rxjs/operators';
import { MainService } from './main.service';

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(private service: MainService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.service.getIdToken().pipe(
      switchMap(token => {
          request = request.clone({
              setHeaders: {
              Authorization: `Bearer ${token.multiFactor.user.accessToken}`
              }
          });

          return next.handle(request);
      }))}
}