import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DataformComponent } from './dataform/dataform.component';
import { HomeComponent } from './home/home.component';
import { UserdataComponent } from './userdata/userdata.component';

const routes: Routes = [{
  component: HomeComponent,
  path: '',
  children: [{
    component: DataformComponent,
    path: ''
  },{
    component: UserdataComponent,
    path: 'user-data'
  }]
},
{
  component: AuthComponent,
  path: 'auth'
}, 
{
  path:'**',
  redirectTo:'/auth',
  pathMatch:'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
