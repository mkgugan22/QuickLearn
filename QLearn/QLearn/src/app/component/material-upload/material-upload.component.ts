import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-material-upload',
  imports: [CommonModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './material-upload.component.html',
  styleUrl: './material-upload.component.css'
})
export class MaterialUploadComponent {
  // ✅ FIXED: removed space in URL
  api = 'http://localhost:3700';
  progress = '';

  @ViewChild('player') audio!: ElementRef<HTMLAudioElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { course: any },
    private http: HttpClient
  ) {}

  onFile(evt: any) {
    const file: File = evt.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('pdf', file);
    this.progress = 'Uploading…';

  this.http
  .post(`${this.api}/api/courses/${this.data.course._id}/material`, fd)
  .subscribe({
    next: (course: any) => {
      this.progress = 'Done!';
      this.data.course.pdfMaterials = course.pdfMaterials;
    },
    error: (err) => {
      console.error('Upload failed:', err.error || err);
      this.progress = 'Failed: ' + (err.error?.msg || err.message || 'Unknown error');
    }
  });

  }

  play(path: string) {
    if (!path) {
      alert('No audio file available.');
      return;
    }

    this.audio.nativeElement.src = this.api + path;
    this.audio.nativeElement.play();
  }
}
