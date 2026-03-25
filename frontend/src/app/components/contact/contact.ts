import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  form = { name: '', email: '', phone: '', message: '' };
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private messageService: MessageService) {}

  onSubmit(): void {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.messageService.sendMessage(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Poruka je uspešno poslata! Odgovorićemo vam uskoro.';
        this.form = { name: '', email: '', phone: '', message: '' };
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Greška pri slanju poruke';
      }
    });
  }
}