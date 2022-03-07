import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { districts } from './districts';

export interface Qualification {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Qualification[];
}


@Component({
  selector: 'app-dataform',
  templateUrl: './dataform.component.html',
  styleUrls: ['./dataform.component.scss']
})
export class DataformComponent implements OnInit {
  fileNumber: number = 223001;
  task: Qualification = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'PLE', completed: false, color: 'primary'},
      {name: 'UCE', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'},
      {name: 'Diploma', completed: false, color: 'warn'},
      {name: 'Certificate', completed: false, color: 'warn'},
      {name: 'Degree', completed: false, color: 'warn'},
      {name: 'Master', completed: false, color: 'warn'}
    ],
  };
  languages: Qualification = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'English', completed: false, color: 'primary'},
      {name: 'Luganda', completed: false, color: 'accent'},
      {name: 'Runyankole', completed: false, color: 'warn'},
      {name: 'Acholi', completed: false, color: 'warn'},
      {name: 'Swahili', completed: false, color: 'warn'},
      {name: 'Lusoga', completed: false, color: 'warn'},
      {name: 'Others', completed: false, color: 'warn'}
    ],
  };
  gender: any[] = [{name:'CF', value:'Female'}, {name:'CM',value:'Male'}];// 
  marriage: string[] = ['Single', 'Married'];
  religion: string[] = ['Christian', 'Muslim'];
  vaccine: string[] = ['Not yet', 'One Dose', 'Two Doses', 'Certified', 'Ready'];
  gcc: string[] = ['Not Yet', 'Booked', 'On Progress', 'Fit', 'Unfit'];
  training: string[] = ['Not yet', 'Approved', 'On training', 'Trained'];
  nextOfKeenRelationship: string[] = ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Others'];
  address = districts;
  allComplete: boolean = false;
  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  formGroup:FormGroup;
  form1: {name:string, control:string}[] = [{
    name:'First Name',
    control:'fname'
  },{
    name:'Last Name',
    control:'lname'
  },{
    name:'Other Names',
    control:'otherNames'
  }
];
  constructor(private _fb: FormBuilder) {
    this.formGroup = this._fb.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      otherNames: [''],
      nin: ['', [Validators.required, Validators.min(14)]],
      passportnumber: ['', [Validators.required, Validators.min(9)]], // must start with an A
      datePassportIssue: ['', [Validators.required]],
      passportExpiration:['', Validators.required],// auto increment by 10 years
      contactNumber: ['', Validators.required], // must start with 256
      gender: ['', Validators.required],
      dob: ['', Validators.required], // warn for age less than 21 years  or 21 not allowed
      religion: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      qualification:['', Validators.required],
      languages: ['', Validators.required],
      skills:['', Validators.required],
      address: [districts[0].city],
      physicalAddress:['', Validators.required],
      kinRelationship:['', Validators.required],
      numberOfNextOfKin: ['', Validators.required],
      nextOfKin:['', ['', Validators.required]],
      gcc:['', Validators.required],
      medicalCenter:['', Validators.required],
      training:['', Validators.required],
      vaccine:['', Validators.required],
      agent:['', Validators.required],
      remarks:['', Validators.required],
      rDate:['', Validators.required],
      tDate:['', Validators.required],
      duration:['', Validators.required],
      picture:['', Validators.required]

    })
   }

  ngOnInit(): void {
    
  }

  submitForm(): void{
    try{

    }catch(e){

    }
  }

}
