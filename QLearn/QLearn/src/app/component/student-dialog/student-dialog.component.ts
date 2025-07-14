import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.css']
})
export class StudentDialogComponent {
  selected: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { students: { id: string, name: string, email: string }[] },
    private dialogRef: MatDialogRef<StudentDialogComponent>
  ) {}

  confirm(): void {
    this.dialogRef.close({ unenrolledStudents: this.selected });
  }

  roles:any;
  ngOnInit(){
     this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  
  }
}
