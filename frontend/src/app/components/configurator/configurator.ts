import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentService } from '../../services/component';
import { ConfigurationService } from '../../services/configuration';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configurator.html',
  styleUrl: './configurator.css'
})
export class Configurator implements OnInit {
  activeTab = 'manual';
  loading = false;
  successMessage = '';
  errorMessage = '';
  configName = '';
  budget = 0;
  purpose = 'gaming';
  selectedGames: string[] = [];
  generatedConfig: any = null;
  generatedConfigItems: any[] = [];
  allComponents: any[] = [];
  selectedComponents: any = {};

  componentTypes = [
    { key: 'cpu', label: '🖥️ Procesor (CPU)' },
    { key: 'gpu', label: '🎮 Grafička karta (GPU)' },
    { key: 'ram', label: '💾 Radna memorija (RAM)' },
    { key: 'storage', label: '💿 Skladište (Storage)' },
    { key: 'motherboard', label: '🔌 Matična ploča' },
    { key: 'psu', label: '⚡ Napajanje (PSU)' },
    { key: 'case', label: '📦 Kućište' }
  ];

  availableGames : string[]= [];

  constructor(
    private componentService: ComponentService,
    private configService: ConfigurationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
  this.componentService.getComponents().subscribe({
    next: (data) => this.allComponents = data,
    error: () => this.errorMessage = 'Greška pri učitavanju komponenti'
  });

  this.gameService.getGames().subscribe({
    next: (data) => this.availableGames = data.map((g: any) => g.name),
    error: () => this.errorMessage = 'Greška pri učitavanju igrica'
  });
}

  getComponentsByType(type: string): any[] {
    return this.allComponents.filter(c => c.type === type);
  }

  get manualTotalPrice(): number {
    return Object.values(this.selectedComponents)
      .filter(id => id)
      .reduce((total: number, id) => {
        const comp = this.allComponents.find(c => c._id === id);
        return total + (comp?.price || 0);
      }, 0);
  }

  toggleGame(game: string): void {
    const idx = this.selectedGames.indexOf(game);
    if (idx > -1) this.selectedGames.splice(idx, 1);
    else this.selectedGames.push(game);
  }

  isGameSelected(game: string): boolean {
    return this.selectedGames.includes(game);
  }

  generateByBudget(): void {
    this.loading = true;
    this.generatedConfig = null;
    this.configService.generateConfiguration({ budget: this.budget, purpose: this.purpose }).subscribe({
      next: (data) => {
        this.loading = false;
        this.generatedConfig = data;
        this.buildGeneratedItems(data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Greška pri generisanju';
      }
    });
  }

  generateByGames(): void {
  this.loading = true;
  this.generatedConfig = null;

  this.gameService.getGames().subscribe({
    next: (games) => {
      const selectedGameData = games.filter((g: any) => this.selectedGames.includes(g.name));

      const maxGpuPerformance = Math.max(...selectedGameData.map((g: any) => g.recommendedRequirements.gpuPerformance));
      const maxCpuPerformance = Math.max(...selectedGameData.map((g: any) => g.recommendedRequirements.cpuPerformance));
      const maxRam = Math.max(...selectedGameData.map((g: any) => g.recommendedRequirements.ramGB));

      this.configService.generateConfiguration({
        budget: 9999,
        purpose: 'gaming',
        games: this.selectedGames,
        minGpuPerformance: maxGpuPerformance,
        minCpuPerformance: maxCpuPerformance,
        minRamGB: maxRam
      }).subscribe({
        next: (data) => {
          this.loading = false;
          this.generatedConfig = data;
          this.buildGeneratedItems(data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Greška pri generisanju';
          this.cdr.detectChanges();
        }
      });
    }
  });
}

  buildGeneratedItems(data: any): void {
    const labels: any = { cpu: 'CPU', gpu: 'GPU', ram: 'RAM', storage: 'Storage', motherboard: 'Matična', psu: 'Napajanje', case: 'Kućište' };
    this.generatedConfigItems = Object.keys(labels)
      .filter(key => data[key])
      .map(key => ({ label: labels[key], name: data[key].name, price: data[key].price }));
  }

  saveManualConfig(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const components: any = {};
    Object.keys(this.selectedComponents).forEach(key => {
      if (this.selectedComponents[key]) components[key] = this.selectedComponents[key];
    });
    this.configService.createConfiguration({
      name: this.configName,
      components,
      totalPrice: this.manualTotalPrice
    }).subscribe({
      next: () => {
        this.successMessage = 'Konfiguracija sačuvana!';
        this.configName = '';
      },
      error: () => this.errorMessage = 'Greška pri čuvanju'
    });
  }

  saveGeneratedConfig(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.configService.createConfiguration({
      name: this.configName,
      components: {
        cpu: this.generatedConfig.cpu?._id,
        gpu: this.generatedConfig.gpu?._id,
        ram: this.generatedConfig.ram?._id,
        storage: this.generatedConfig.storage?._id,
        motherboard: this.generatedConfig.motherboard?._id,
        psu: this.generatedConfig.psu?._id,
        case: this.generatedConfig.case?._id,
      },
      totalPrice: this.generatedConfig.totalPrice,
      purpose: this.purpose,
      games: this.selectedGames
    }).subscribe({
      next: () => {
        this.successMessage = 'Konfiguracija sačuvana!';
        this.configName = '';
      },
      error: () => this.errorMessage = 'Greška pri čuvanju'
    });
  }

  sendManualConfig(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const components: any = {};
    Object.keys(this.selectedComponents).forEach(key => {
      if (this.selectedComponents[key]) components[key] = this.selectedComponents[key];
    });
    this.configService.createConfiguration({
      name: this.configName,
      components,
      totalPrice: this.manualTotalPrice,
      sentToAdmin: true
    }).subscribe({
      next: () => this.successMessage = 'Konfiguracija poslata adminu!',
      error: () => this.errorMessage = 'Greška pri slanju'
    });
  }

  sendGeneratedConfig(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.configService.createConfiguration({
      name: this.configName,
      components: {
        cpu: this.generatedConfig.cpu?._id,
        gpu: this.generatedConfig.gpu?._id,
        ram: this.generatedConfig.ram?._id,
        storage: this.generatedConfig.storage?._id,
        motherboard: this.generatedConfig.motherboard?._id,
        psu: this.generatedConfig.psu?._id,
        case: this.generatedConfig.case?._id,
      },
      totalPrice: this.generatedConfig.totalPrice,
      purpose: this.purpose,
      games: this.selectedGames,
      sentToAdmin: true
    }).subscribe({
      next: () => this.successMessage = 'Konfiguracija poslata adminu!',
      error: () => this.errorMessage = 'Greška pri slanju'
    });
  }
}