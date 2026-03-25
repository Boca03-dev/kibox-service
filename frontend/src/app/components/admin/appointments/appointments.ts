import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { AppointmentService } from '../../../services/appointment';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {
  appointments: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: '⏳ Na čekanju',
      confirmed: '✅ Potvrđen',
      cancelled: '❌ Otkazan'
    };
    return labels[status] || status;
  }

  updateStatus(appointment: any, status: string): void {
    this.appointmentService.updateStatus(appointment._id, status).subscribe({
      next: () => appointment.status = status
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}