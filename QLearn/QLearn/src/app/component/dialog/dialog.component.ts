
import {
  Component,
  Inject,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  MatDialogModule
} from '@angular/material/dialog';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatDividerModule
} from '@angular/material/divider';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';
 
declare var YT: any; // Declare YouTube global object
 
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, AfterViewInit {
  modules: { title: string; description: string; youtubeLink?: string }[] = [];
  userRole: string | null = null;
 
  players: any[] = [];
  isPlaying: boolean[] = [];
  isFullscreen: boolean[] = [];
  volumes: number[] = [];
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }
 
  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.loadYouTubeApi();
 
    if (this.data.type === 'modules') {
      this.modules = this.data.modules?.length
        ? this.data.modules.map((m: any) => ({
            title: m.title,
            description: m.description,
            youtubeLink: m.youtubeLink || ''
          }))
        : [{ title: '', description: '', youtubeLink: '' }];
    }
  }
 
  ngAfterViewInit(): void {
    if (this.data.type === 'modules' && this.data.viewOnly) {
      if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        (window as any)['onYouTubeIframeAPIReady'] = () => this.initPlayers();
      } else {
        this.initPlayers();
      }
    }
  }
 
  loadYouTubeApi(): void {
    const scriptId = 'youtube-api';
    if (!document.getElementById(scriptId)) {
      const tag = document.createElement('script');
      tag.id = scriptId;
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }
 
  initPlayers(): void {
    setTimeout(() => {
      this.modules.forEach((module, index) => {
        const videoId = this.extractYouTubeId(module.youtubeLink || '');
        const playerElem = document.getElementById(`youtube-player-${index}`);
 
        if (videoId && playerElem) {
          this.players[index] = new YT.Player(`youtube-player-${index}`, {
            height: '315',
            width: '100%',
            videoId: videoId,
            playerVars: { controls: 0, rel: 0 },
            events: {
              onStateChange: (event: any) => {
                this.isPlaying[index] = event.data === YT.PlayerState.PLAYING;
              },
              onReady: (event: any) => {
                this.volumes[index] = event.target.getVolume();
              }
            }
          });
 
          this.isPlaying[index] = false;
          this.isFullscreen[index] = false;
        }
      });
    }, 0);
  }
 
  togglePlayPause(index: number): void {
    const player = this.players[index];
    if (!player) return;
 
    this.isPlaying[index] ? player.pauseVideo() : player.playVideo();
  }
 
  forward(index: number): void {
    const current = this.players[index]?.getCurrentTime();
    if (current !== undefined) {
      this.players[index].seekTo(current + 10, true);
    }
  }
 
  rewind(index: number): void {
    const current = this.players[index]?.getCurrentTime();
    if (current !== undefined) {
      this.players[index].seekTo(current - 10, true);
    }
  }
 
  toggleFullscreen(index: number): void {
    const iframe = document.getElementById(`youtube-player-${index}`) as HTMLIFrameElement;
    if (!iframe) return;
 
    const isFull = this.isFullscreen[index];
    if (!isFull) {
      if (iframe.requestFullscreen) iframe.requestFullscreen();
      else if ((iframe as any).webkitRequestFullscreen) (iframe as any).webkitRequestFullscreen();
      else if ((iframe as any).mozRequestFullScreen) (iframe as any).mozRequestFullScreen();
      else if ((iframe as any).msRequestFullscreen) (iframe as any).msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
      else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen();
      else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
    }
 
    this.isFullscreen[index] = !isFull;
  }
 
  onVolumeChange(index: number, event: any): void {
    const newVolume = event.target.value;
    this.players[index]?.setVolume(newVolume);
    this.volumes[index] = newVolume;
  }
 
  addModule(): void {
    this.modules.push({ title: '', description: '', youtubeLink: '' });
  }
 
  removeModule(index: number): void {
    if (index >= 0 && index < this.modules.length) {
      this.modules.splice(index, 1);
      this.players.splice(index, 1);
      this.isPlaying.splice(index, 1);
      this.isFullscreen.splice(index, 1);
      this.volumes.splice(index, 1);
    }
  }
 
  saveModules(): void {
    const invalid = this.modules.some(
      module =>
        !module.title.trim() ||
        !module.description.trim() ||
        this.containsOnlySymbolsOrNumbers(module.title) ||
        this.containsOnlySymbolsOrNumbers(module.description)
    );
 
    if (invalid) {
      this.showToast('All modules must have valid text (no only numbers/symbols)');
      return;
    }
 
    this.dialogRef.close(this.modules);
  }
 
  closeModuleDialog(): void {
    this.dialogRef.close();
  }
 
  onCancel(): void {
    this.dialogRef.close(false);
  }
 
  onDelete(): void {
    this.dialogRef.close(true);
  }
 
  showToast(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
 
  containsOnlySymbolsOrNumbers(value: string): boolean {
    return !/[a-zA-Z]/.test(value);
  }
 
  getSafeYouTubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYouTubeId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
 
  extractYouTubeId(url: string): string {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : '';
  }
 
  openYouTube(url: string): void {
    window.open(url, '_blank');
  }
}
 
 