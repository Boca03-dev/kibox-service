import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css'
})
export class Appointment {
  form = { name: '', email: '', phone: '', date: '', description: '' };
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private appointmentService: AppointmentService) {}

  onSubmit(): void {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.appointmentService.createAppointment(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Termin je uspešno zakazan! Kontaktiraćemo vas uskoro.';
        this.form = { name: '', email: '', phone: '', date: '', description: '' };
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Greška pri zakazivanju termina';
      }
    });
  }
}