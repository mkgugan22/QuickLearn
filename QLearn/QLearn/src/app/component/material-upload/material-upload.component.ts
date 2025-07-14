import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { PrincipalServiceService } from '../../service/principal-service.service';

@Component({
  selector: 'app-material-upload',
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatListModule, 
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './material-upload.component.html',
  styleUrl: './material-upload.component.css'
})
export class MaterialUploadComponent implements OnInit {
  api = 'http://localhost:3700';
  progress = '';
  isUploading = false;
  supportedLanguages: any = {};
  selectedLanguages: string[] = ['en-US'];
  currentlyPlaying: string | null = null;

  @ViewChild('player') audio!: ElementRef<HTMLAudioElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { course: any },
    private http: HttpClient,
    private principalService: PrincipalServiceService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MaterialUploadComponent>
  ) {}

  ngOnInit() {
    this.loadSupportedLanguages();
  }

  loadSupportedLanguages() {
    this.principalService.getSupportedLanguages().subscribe({
      next: (languages: any) => {
        this.supportedLanguages = languages;
      },
      error: (err) => {
        console.error('Failed to load supported languages:', err);
        this.snackBar.open('Failed to load language options', 'Close', { duration: 3000 });
      }
    });
  }

  onLanguageChange(languageCode: string, checked: boolean) {
    if (checked) {
      if (!this.selectedLanguages.includes(languageCode)) {
        this.selectedLanguages.push(languageCode);
      }
    } else {
      this.selectedLanguages = this.selectedLanguages.filter(lang => lang !== languageCode);
    }
  }

  onFile(evt: any) {
    const file: File = evt.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.snackBar.open('Please select a PDF file', 'Close', { duration: 3000 });
      return;
    }

    if (this.selectedLanguages.length === 0) {
      this.snackBar.open('Please select at least one language', 'Close', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    this.progress = 'Processing PDF and generating audio...';

    this.principalService.uploadCourseMaterial(this.data.course._id, file, this.selectedLanguages)
      .subscribe({
        next: (response: any) => {
          this.progress = 'Upload successful!';
          this.isUploading = false;
          this.data.course.pdfMaterials = response.pdfMaterials;
          this.snackBar.open(
            `Material uploaded with audio in: ${response.generatedLanguages.join(', ')}`, 
            'Close', 
            { duration: 5000 }
          );
          // Refresh the dialog data
          this.dialogRef.close({ updated: true, pdfMaterials: response.pdfMaterials });
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.progress = 'Upload failed: ' + (err.error?.msg || err.message || 'Unknown error');
          this.isUploading = false;
          this.snackBar.open('Upload failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
  }

  playAudio(audioPath: string, languageName: string) {
    if (!audioPath) {
      this.snackBar.open('Audio file not available', 'Close', { duration: 2000 });
      return;
    }

    if (this.currentlyPlaying === audioPath) {
      this.audio.nativeElement.pause();
      this.currentlyPlaying = null;
      return;
    }

    this.audio.nativeElement.src = this.api + audioPath;
    this.audio.nativeElement.play();
    this.currentlyPlaying = audioPath;
    this.snackBar.open(`Playing audio in ${languageName}`, 'Close', { duration: 2000 });
  }

  stopAudio() {
    this.audio.nativeElement.pause();
    this.audio.nativeElement.currentTime = 0;
    this.currentlyPlaying = null;
  }

  deleteMaterial(materialIndex: number) {
    if (confirm('Are you sure you want to delete this material?')) {
      this.principalService.deleteCourseMaterial(this.data.course._id, materialIndex)
        .subscribe({
          next: (response: any) => {
            this.data.course.pdfMaterials = response.pdfMaterials;
            this.snackBar.open('Material deleted successfully', 'Close', { duration: 3000 });
            this.dialogRef.close({ updated: true, pdfMaterials: response.pdfMaterials });
          },
          error: (err) => {
            console.error('Delete failed:', err);
            this.snackBar.open('Failed to delete material', 'Close', { duration: 3000 });
          }
        });
    }
  }

  getSelectedLanguageNames(): string[] {
    return this.selectedLanguages.map(code => this.supportedLanguages[code]?.name || code);
  }

  onAudioEnded() {
    this.currentlyPlaying = null;
  }

  viewPdf(pdfPath: string) {
    window.open(this.api + pdfPath, '_blank');
  }
}
