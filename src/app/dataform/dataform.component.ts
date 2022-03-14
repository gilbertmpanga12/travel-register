import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { districts } from './districts';
import {MainService} from '../services/main.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  minDate: Date;
  maxDate: Date;
  file:any;
  avatar:any;
  loading: boolean = false;
  fileNumber: number = 223001;
  task: Qualification = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'PLE', completed: false, color: 'primary'},
      {name: 'UCE', completed: false, color: 'accent'},
      {name: 'UACE', completed: false, color: 'warn'},
      {name: 'Diploma', completed: false, color: 'warn'},
      {name: 'Certificate', completed: false, color: 'warn'},
      {name: 'Degree', completed: false, color: 'warn'},
      {name: 'Master', completed: false, color: 'warn'}
    ],
  };

  skills: Qualification = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Cooking', completed: false, color: 'primary'},
      {name: 'Ironing', completed: false, color: 'accent'},
      {name: 'Cleaning', completed: false, color: 'warn'},
      {name: 'Dusting', completed: false, color: 'warn'},
      {name: 'Washing', completed: false, color: 'warn'},
      {name: 'Baby sitting', completed: false, color: 'warn'}
    ],
  }
  otherLang:string='';
  otherSkills:string='';
  remarks: string='';
  languages: Qualification = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Local', completed: false, color: 'primary'},
      {name: 'Arabic', completed: false, color: 'accent'},
      {name: 'Swahili', completed: false, color: 'warn'},
      {name: 'English', completed: false, color: 'warn'},
      {name: 'French', completed: false, color: 'warn'}
    ],
  };
  gender: any[] = [{name:'Female', value:'Female'}, {name:'Male',value:'Male'}];// 
  marriage: string[] = ['Single', 'Married'];
  religion: string[] = ['Christian', 'Muslim'];
  vaccine: string[] = ['Not yet', 'One Dose', 'Two Doses', 'Certified', 'Ready'];
  gcc: string[] = ['Not Yet', 'Booked', 'On Progress', 'Fit', 'Unfit'];
  training: string[] = ['Not yet', 'Approved', 'On training', 'Trained'];
  nextOfKeenRelationship: string[] = ['Relative','Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Others'];
  address = districts;
  allComplete: boolean = false;
  allCompleteLang: boolean = false;
  allCompleSkills: boolean = false;
  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  updateAllCompleteLang() {
    this.allCompleteLang = this.languages.subtasks != null && this.languages.subtasks.every(t => t.completed);
  }

  updateAllCompleteSkills() {
    this.allCompleSkills = this.skills.subtasks != null && this.skills.subtasks.every(t => t.completed);
  }


  mainformGroup:FormGroup;
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
  constructor(private _fb: FormBuilder, public service: MainService, private afs: AngularFirestore) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 90, 11, 31);
    this.maxDate = new Date(currentYear - 21, 11, 31);//currentYear + 1000, 11, 31 
    this.mainformGroup = this._fb.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      otherNames: [''],
      nin: ['', [Validators.required, Validators.minLength(14)]],
      passportnumber: ['', [Validators.required, Validators.minLength(9)]], // must start with an A
      datePassportIssue: ['', [Validators.required]],
      passportExpiration:['', [Validators.required]],// auto increment by 10 years
      contactNumber: ['', [Validators.required, Validators.minLength(9)]], // must start with 256
      altNumber:['', [Validators.minLength(9)]],
      kinAltNumber: ['',[Validators.minLength(9)]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]], // warn for age less than 21 years  or 21 not allowed
      religion: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      qualification:[''],
      languages: [''],
      skills:[''],
      address: [districts[0].city],
      physicalAddress:['', [Validators.required]],
      kinRelationship:['', [Validators.required]],
      numberOfNextOfKin: ['', [Validators.required, Validators.minLength(9)]],
      nextOfKin:['', [Validators.required]],
      gcc:['', [Validators.required]],
      medicalCenter:['', [Validators.required]],
      training:['', [Validators.required]],
      vaccine:['', [Validators.required]],
      agent:['', [Validators.required]],
      rDate:[''],
      tDate:[''],
      duration:['', [Validators.required]],
      picture:[''],
      pageNumber: [0]

    })
   }

  ngOnInit(): void {
    this.afs.collection('pageNumber').doc('page').valueChanges().forEach((doc:any) => {
      this.fileNumber = doc?.page;
    });
  }

  
  async submitForm(){
    try{
      const languages = this.languages.subtasks?.filter(item => item.completed).map(item => item.name);
      const qualifications = this.task.subtasks?.filter(item => item.completed).map(item => item.name);
      const skills =this.skills.subtasks?.filter(item => item.completed).map(item => item.name);
      if(this.mainformGroup.valid && !!this.avatar && languages!.length>0 && qualifications!.length>0&&skills!.length>0){
      this.service.isLoading =  true;
      const data  = this.mainformGroup.getRawValue();
      data['languages'] = languages;
      data['qualification'] = qualifications;
      data['uid'] = this.afs.createId();
      data['contactNumber'] ='+256'+data['contactNumber'];
      data['numberOfNextOfKin'] = '+256'+data['numberOfNextOfKin'];
      data['otherLang'] = this.otherLang;
      data['otherSkills']=this.otherSkills;
      data['remarks']=this.remarks;
      this.service.startUpload(this.file,this.file?.name,this.extractName(this.file?.name),data);
      Swal.fire(
          'Good job!',
          'You data was saved',
          'success'
        );
        this.avatar = null;
        this.service.isLoading =  false;
        this.mainformGroup.reset();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Warning',
        text: 'You have missing fields, make sure all fields are filled in'
      });
    }
    }catch(e){
      this.service.isLoading =  false;
      this.avatar = null;
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      });
    }
  };

  errorController(control: string){
    return this.mainformGroup.touched && this.mainformGroup.get(control)?.invalid;
  };

  requiredError(control: string){
    return  this.mainformGroup.touched && this.mainformGroup.get(control)?.hasError('required');
  }

  uploadDocuments(event: any): void{
    const eventFiles = event.target.files;
    const file = eventFiles.item(0);
    if (file!.type.split('/')[0] !== 'image') { 
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Upload only images please!'
      });
      return;
    }
    this.file = file;
    const reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { 
      this.avatar = _event.target?.result; 
    }
   };

   extractName(name:string): string{
     return name.substring(0,name.indexOf('.'));
   }

   resetForm(){
     Swal.fire({
      title: 'Are you sure you want to reset form?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.mainformGroup.reset();
        this.avatar = null;
      } else if (result.isDenied) {
       console.log('denied')
      }
    })
   }
}
