import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

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
      fname: [],
      lname: [],
      otherNames: [],
      nin: [],
      passportnumber: [],
      datePassportIssue: [],
      passportExpiration:[],
      contactNumber: [],
      gender: [],
      dob: [],
      religion: [],
      maritalStatus: [],
      qualification:[],
      languages: [],
      skills:[],
      address: [],
      physicalAddress:[],
      kinRelationship:[],
      numberOfNextOfKin: [],
      nextOfKin:[],
      gcc:[],
      medicalCenter:[],
      training:[],
      vaccine:[],
      agent:[],
      remarks:[],
      rDate:[],
      tDate:[],
      duration:[],
      picture:[]

    })
   }

  ngOnInit(): void {
  }

}
