import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
