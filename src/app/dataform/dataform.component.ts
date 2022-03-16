import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { districts } from './districts';
import {MainService} from '../services/main.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface CheckItem {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: CheckItem[];
}


@Component({
  selector: 'app-dataform',
  templateUrl: './dataform.component.html',
  styleUrls: ['./dataform.component.scss']
})
export class DataformComponent implements OnInit {
  defaultRangeBgColor: string = '#f3f4f6';
  defaultTextColor: string='#111827';
  statusColors={
    daysLess60:'#10b981',
    range6181:'#eab308',
    moreThan90:'#ef4444'
 }
  minDate: Date;
  maxDate: Date;
  file:any;
  avatar:any;
  loading: boolean = false;
  fileNumber: number = 223001;
  task: CheckItem = {
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

 

  skills: CheckItem = {
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
  };
  otherLang:string='';
  otherSkills:string='';
  remarks: string='';
  rDate: string='';
  tDate: string='';
  duration: string='';
  languages: CheckItem = {
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
  gender: any[] = [{name:'Female', value:'Female'}, {name:'Male',value:'Male'}];
  marriage: string[] = ['Single', 'Married'];
  religion: string[] = ['Christian', 'Muslim'];
  vaccine: string[] = ['Not yet', 'One Dose', 'Two Doses', 'Certified', 'Ready'];
  gcc: string[] = ['Not Yet', 'Booked', 'On Progress', 'Fit', 'Unfit'];
  training: string[] = ['Not yet', 'Approved', 'On training', 'Trained'];
  nextOfKeenRelationship: string[] = ['Relative','Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Others'];
  medicalCenter: string[] = ['Bayan', 'City Medical', 'JB', 'Jeoro', 'Kalson', 'Medi Care', 'Medical World', 'Travel C'];
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
  durationGroup: FormGroup;
  addressKeenGroup: FormGroup;
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
 fullPhoto!: File;
 smallPhoto!: File;
 passport!: File;
 resume!: File;

 fullPhotoUrl: any;
 smallPhotoUrl: any;
 passportUrl: any;
 resumeUrl: any;
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
      contactNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]], // must start with 256
      altNumber:['', [Validators.minLength(9)]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      religion: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      gcc:['', [Validators.required]],
      medicalCenter:['', [Validators.required]],
      training:['', [Validators.required]],
      picture:[''],
      pageNumber: [0]
    });

    this.durationGroup = this._fb.group({
      tDate:[''],
      rDate: [''],
      duration: ['']
    });

    this.addressKeenGroup = this._fb.group({
      vaccine:['', [Validators.required]],
      agent:['', [Validators.required]],
      nextOfKin:['', [Validators.required]],
      kinRelationship:['', [Validators.required]],
      numberOfNextOfKin: ['', [Validators.required, Validators.minLength(9)]],
      kinAltNumber: ['',[Validators.minLength(9)]],
      address: [districts[0].city],
      physicalAddress:['', [Validators.required]],
    });
   }


  ngOnInit(): void {
    this.afs.collection('pageNumber').doc('page').valueChanges().forEach((doc:any) => {
      this.fileNumber = doc?.page;
    });

    this.durationGroup.valueChanges.subscribe(data => {
      if(data['tDate'] && data['rDate']){
        const tDate = new Date(data['tDate']).getTime(), rDate = new Date(data['rDate']).getTime();
        const diff = tDate-rDate;
        const diffInDays= diff/ (1000 * 3600 * 24);
        this.markWarning(diffInDays);
        this.durationGroup.get('duration')?.setValue(`${diffInDays}`,{emitEvent: false});
      }
    });

  }

  getControls(target:string){
    return (this.mainformGroup.get(target) as FormArray).controls;
  }

  markWarning(days: number){
      if(days > 90){
        this.defaultRangeBgColor=this.statusColors.moreThan90;
        this.defaultTextColor='#fff';
        return;
      };
      if(days < 60){
        this.defaultRangeBgColor=this.statusColors.daysLess60;
        this.defaultTextColor='#fff';
        return;
      };
      if(days > 61 || days <= 89){
        this.defaultRangeBgColor=this.statusColors.range6181;
        this.defaultTextColor='#fff';
        return;
      };
     
  };

  pluraliseDays(days:number){
    return Number(days) > 1? days + ' days': days+ ' day';
  }

 
  
  async submitForm(){
    try{
      const hasAllPhotos = !!this.fullPhoto && !!this.smallPhoto && !!this.resume && !!this.passport;
      const languages = this.languages.subtasks?.filter(item => item.completed).map(item => item.name);
      const qualifications = this.task.subtasks?.filter(item => item.completed).map(item => item.name);
      const skills =this.skills.subtasks?.filter(item => item.completed).map(item => item.name);
      const addressKeenGroup = this.addressKeenGroup.valid;
      console.log('Is address group valid', addressKeenGroup)
      if(this.mainformGroup.valid  && languages!.length>0 && qualifications!.length>0&&skills!.length>0 && hasAllPhotos && addressKeenGroup){
        this.service.isLoading =  true;
        const data  = this.mainformGroup.getRawValue();
        const durationData = this.durationGroup.getRawValue();
        data['languages'] = languages;
        data['qualification'] = qualifications;
        data['uid'] = this.afs.createId();
        data['contactNumber'] ='+256'+data['contactNumber'];
        data['numberOfNextOfKin'] = '+256'+data['numberOfNextOfKin'];
        data['otherLang'] = this.otherLang;
        data['otherSkills']=this.otherSkills;
        data['remarks']=this.remarks;
        data['skills']=skills;
        data['tDate']=durationData['tDate'];
        data['rDate']=durationData['rDate'];
        data['duration']=durationData['duration'];
        const finalData = {...data, ...this.addressKeenGroup.getRawValue()};
        this.service.uploadNow([this.fullPhoto, this.smallPhoto, this.resume, this.passport],finalData).then(() => {
          Swal.fire(
            'Good job!',
            'You data was saved',
            'success'
          );
          this.fullPhotoUrl = null;
          this.smallPhotoUrl=null;
          this.passportUrl=null;
          this.resumeUrl=null;
          this.mainformGroup.reset();
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Warning',
            text: 'You have missing fields, make sure all fields are filled in'
          });
        });
        
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

  uploadDocuments(event: any, type:string): void{
    const eventFiles = event.target.files;
    const file = eventFiles.item(0);
    this.togglePhotoTypes(file,type);
    
   };

   togglePhotoTypes(file:File,type:string): void{
     console.log(type)
    switch(type){
      case 'fullPhoto':
        this.fullPhoto = file;
    const reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { 
      this.fullPhotoUrl = _event.target?.result; 
    }
        break;
      case 'smallPhoto':
        this.smallPhoto = file;
        const readerSmall = new FileReader();
        readerSmall.readAsDataURL(file); 
        readerSmall.onload = (_event) => { 
          this.smallPhotoUrl = _event.target?.result; 
        }
        break;
      case 'passportPhoto':
        this.passport = file;
        const readerPassport = new FileReader();
        readerPassport.readAsDataURL(file); 
        readerPassport.onload = (_event) => { 
          this.passportUrl = _event.target?.result; 
        }
        break;
      case 'resume':
        
        this.resume = file;
        const readerResume = new FileReader();
        readerResume.readAsDataURL(file); 
        readerResume.onload = (_event) => { 
          this.resumeUrl = _event.target?.result; 
        }
        break;
      default:
        Swal.fire({
          icon: 'error',
          title: 'Warning',
          text: 'Something went wrong try again uploading pictures'
        });
    }
   }

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
        this.durationGroup.reset();
        this.mainformGroup.reset();
        this.addressKeenGroup.reset();
        this.fullPhotoUrl=null;
        this.smallPhotoUrl=null;
        this.passportUrl=null;
        this.resumeUrl =null;
        this.languages={
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
        this.skills={
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
        };

        this.task={
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

      } else if (result.isDenied) {
       console.log('denied')
      }
    })
   }
}
