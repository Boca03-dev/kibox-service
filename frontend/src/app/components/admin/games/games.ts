import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { GameService } from '../../../services/game';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './games.html',
  styleUrl: './games.css'
})
export class Games implements OnInit {
  games: any[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  newGame = {
    name: '',
    minRequirements: { ramGB: 0, gpuPerformance: 0, cpuPerformance: 0 },
    recommendedRequirements: { ramGB: 0, gpuPerformance: 0, cpuPerformance: 0 }
  };

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe({
      next: (data) => this.games = data,
      error: () => this.cdr.detectChanges()
    });
  }

  addGame(): void {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.gameService.createGame(this.newGame).subscribe({
      next: (data) => {
        this.loading = false;
        this.successMessage = 'Igrica uspešno dodata!';
        this.games.push(data);
        this.newGame = {
          name: '',
          minRequirements: { ramGB: 0, gpuPerformance: 0, cpuPerformance: 0 },
          recommendedRequirements: { ramGB: 0, gpuPerformance: 0, cpuPerformance: 0 }
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Greška pri dodavanju';
        this.cdr.detectChanges();
      }
    });
  }

  deleteGame(id: string): void {
    if (!confirm('Da li ste sigurni?')) return;
    this.gameService.deleteGame(id).subscribe({
      next: () => this.games = this.games.filter(g => g._id !== id),
      error: () => this.cdr.detectChanges()
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.cdr.detectChanges();
  }
}