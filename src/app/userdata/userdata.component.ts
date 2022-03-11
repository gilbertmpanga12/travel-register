import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FullDetailsComponent } from '../full-details/full-details.component';

export interface UserData {
fullName:string;
passportnumber:string;
contactNumber:string;
gender:string;
viewFull:string;
}

@Component({
  selector: 'table-component',
  styleUrls: ['./userdata.component.scss'],
  templateUrl: './userdata.component.html',
})
export class UserdataComponent implements AfterViewInit {
  displayedColumns: string[] = ['pageNumber','fullName', 'passportnumber', 'contactNumber', 'gender', 'viewFull'];
  dataSource!: MatTableDataSource<UserData>;
  loading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private afs: AngularFirestore, public dialog: MatDialog) {
   
    
  }

  ngAfterViewInit() {
    this.afs.collection('userData').valueChanges().subscribe((data:any)=> {
      this.loading=false;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

viewFull(data: any){
  const dialogRef = this.dialog.open(FullDetailsComponent, {data});
  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
};


}
