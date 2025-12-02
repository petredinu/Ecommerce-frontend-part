import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { StockAlert } from '../../common/stock-alert';
import { StockMovement } from '../../common/stock-movement';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-alerts',
  standalone: false,
  templateUrl: './stock-alerts.component.html',
  styleUrl: './stock-alerts.component.css'
})
export class StockAlertsComponent implements OnInit {

  alerts: StockAlert[] = [];
  movements: StockMovement[] = [];
  isLoadingAlerts: boolean = false;
  isLoadingMovements: boolean = false;
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;

  // Tab selection
  activeTab: 'alerts' | 'movements' = 'alerts';

  constructor(
    private stockService: StockService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStockAlerts();
  }

  loadStockAlerts(): void {
    this.isLoadingAlerts = true;
    this.stockService.getAllStockAlerts(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.alerts = data.alerts || [];
        this.totalElements = data.totalElements || 0;
        this.isLoadingAlerts = false;
      },
      error: (error) => {
        console.error('Error loading stock alerts:', error);
        this.isLoadingAlerts = false;
      }
    });
  }

  loadStockMovements(): void {
    this.isLoadingMovements = true;
    this.stockService.getAllStockMovements(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.movements = data.movements || [];
        this.totalElements = data.totalElements || 0;
        this.isLoadingMovements = false;
      },
      error: (error) => {
        console.error('Error loading stock movements:', error);
        this.isLoadingMovements = false;
      }
    });
  }

  switchTab(tab: 'alerts' | 'movements'): void {
    this.activeTab = tab;
    this.currentPage = 0;
    
    if (tab === 'alerts') {
      this.loadStockAlerts();
    } else {
      this.loadStockMovements();
    }
  }

  getAlertClass(alertLevel: string): string {
    switch (alertLevel) {
      case 'CRITICAL':
        return 'alert-danger';
      case 'LOW':
        return 'alert-warning';
      case 'OUT_OF_STOCK':
        return 'alert-dark';
      default:
        return 'alert-info';
    }
  }

  getAlertIcon(alertLevel: string): string {
    switch (alertLevel) {
      case 'CRITICAL':
        return '⚠️';
      case 'LOW':
        return '⚡';
      case 'OUT_OF_STOCK':
        return '❌';
      default:
        return 'ℹ️';
    }
  }

  getMovementIcon(movementType: string): string {
    switch (movementType) {
      case 'IN':
        return '📥';
      case 'OUT':
        return '📤';
      case 'ADJUSTMENT':
        return '🔧';
      default:
        return '📦';
    }
  }

  getMovementClass(movementType: string): string {
    switch (movementType) {
      case 'IN':
        return 'text-success';
      case 'OUT':
        return 'text-danger';
      case 'ADJUSTMENT':
        return 'text-warning';
      default:
        return 'text-info';
    }
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/admin/product-form', productId]);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      if (this.activeTab === 'alerts') {
        this.loadStockAlerts();
      } else {
        this.loadStockMovements();
      }
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.totalElements / this.pageSize);
    if (this.currentPage < totalPages - 1) {
      this.currentPage++;
      if (this.activeTab === 'alerts') {
        this.loadStockAlerts();
      } else {
        this.loadStockMovements();
      }
    }
  }

}
