import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfigurationService } from '../../services/configuration';

@Component({
  selector: 'app-my-configurations',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-configurations.html',
  styleUrl: './my-configurations.css'
})
export class MyConfigurations implements OnInit {
  configurations: any[] = [];
  loading = true;
  compareMode = false;
  selectedForCompare: string[] = [];

  componentTypes = [
    { key: 'cpu', label: 'CPU' },
    { key: 'gpu', label: 'GPU' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'motherboard', label: 'Matična' },
    { key: 'psu', label: 'Napajanje' },
    { key: 'case', label: 'Kućište' }
  ];

  constructor(private configService: ConfigurationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.configService.getUserConfigurations().subscribe({
      next: (data) => {
        this.configurations = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getComponentName(config: any, type: string): string {
    return config.components?.[type]?.name || '—';
  }

  deleteConfig(id: string): void {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu konfiguraciju?')) return;
    this.configService.deleteConfiguration(id).subscribe({
      next: () => {
        this.configurations = this.configurations.filter(c => c._id !== id);
        this.cdr.detectChanges();
      }
    });
  }

  enterCompareMode(): void {
    this.compareMode = true;
    this.selectedForCompare = [];
  }

  exitCompare(): void {
    this.compareMode = false;
    this.selectedForCompare = [];
  }

  toggleCompare(id: string): void {
    const idx = this.selectedForCompare.indexOf(id);
    
    if (idx > -1) {
      this.selectedForCompare.splice(idx, 1);
    } else {
      if (this.selectedForCompare.length < 2) {
        this.selectedForCompare.push(id);
      } else {
        this.selectedForCompare[1] = id;
      }
    }
    this.cdr.detectChanges();
  }

  isSelectedForCompare(id: string): boolean {
    return this.selectedForCompare.includes(id);
  }

  getCompareConfigs(): any[] {
    return this.configurations.filter(c => this.selectedForCompare.includes(c._id));
  }

  sendToAdmin(config: any): void {
    this.configService.sendToAdmin(config._id).subscribe({
      next: () => config.sentToAdmin = true
    });
  }
}