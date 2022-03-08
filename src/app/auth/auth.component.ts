import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router} from '@angular/router';
import { Login } from '../models/models';
import {MainService} from '../services/main.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  hide = true;
  loginGroup!: FormGroup;
  
  constructor(private _fb: FormBuilder, 
    public service: MainService, 
    private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginGroup = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  control(controlName:string): boolean{
    return this.loginGroup?.get(controlName)!.invalid;
  }

  getErrorMessage(controlName: string): string{
    if(controlName == 'email'){
      if(this.loginGroup.get('email')!.hasError('required')){
        return Login.EmailRequired;
      }
      return Login.EmailInvalid;
    }

    if(this.loginGroup.get('password')!.hasError('required')){
      return Login.PasswordRequired;
    }
    return Login.PasswordInvalid;
  }

  login(): void {
    const payload: {email:string,password:string} = <{email:string,password:string}>this.loginGroup.getRawValue();
    this.service.login(payload.email,payload.password).then(() => {
      this.service.isLoading = false;
      this.router.navigate(['/']);
    }).catch((e:any) => {
      this.service.isLoading = false;
      this.openSnackBar(e,'Ok');
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["success", "error"]
    });
  }


}