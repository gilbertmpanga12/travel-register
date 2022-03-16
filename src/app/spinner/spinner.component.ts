import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {operation: 'default' | 'success' | 'failed' | 'loading'}) { }

  ngOnInit(): void {
  }

}
