import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'dialog-content',
  templateUrl: './full-details.component.html',
  styleUrls: ['./full-details.component.scss']
})
export class FullDetailsComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    }
}
