import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { Notification } from '../../model/student.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getNotifications().subscribe({
      next: (data: Notification[]) => {
        if (Array.isArray(data)) {
          this.notifications = data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        } else {
          console.warn('No notifications received or data is not an array.', data);
        }
      },
      error: (err) => {
        console.error('Failed to fetch notifications:', err);
      },
    });
  }
}
