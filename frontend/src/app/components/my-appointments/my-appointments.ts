import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css'
})
export class MyAppointments implements OnInit {
  appointments: any[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.appointmentService.getUserAppointments().subscribe({
        next: (data) => {
          this.appointments = data;
          this.loading = false;
          this.appointmentService.markSeenByUser().subscribe();
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }, 0);
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: '⏳ Na čekanju',
      confirmed: '✅ Potvrđen',
      cancelled: '❌ Otkazan'
    };
    return labels[status] || status;
  }
}