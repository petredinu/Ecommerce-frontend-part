import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { 
  DashboardStats, 
  SalesData, 
  TopProduct, 
  CategorySales 
} from '../../common/dashboard-stats';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Dashboard stats
  dashboardStats: DashboardStats | null = null;
  topProducts: TopProduct[] = [];
  categorySales: CategorySales[] = [];
  salesData: SalesData[] = [];

  // Loading states
  isLoadingStats: boolean = true;
  isLoadingCharts: boolean = true;
  isLoadingProducts: boolean = true;

  // Error handling
  errorMessage: string = '';

  // Period selection
  selectedPeriod: 'daily' | 'weekly' | 'monthly' = 'daily';
  selectedDays: number = 30;

  // Sales Line Chart
  public salesLineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenue ($)',
        borderColor: '#0da8e4',
        backgroundColor: 'rgba(13, 168, 228, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        data: [],
        label: 'Orders',
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  public salesLineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Orders'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  };

  public salesLineChartType: ChartType = 'line';

  // Category Pie Chart
  public categoryPieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#0da8e4',
        '#28a745',
        '#ffc107',
        '#dc3545',
        '#6c757d',
        '#17a2b8',
        '#e83e8c',
        '#fd7e14'
      ]
    }]
  };

  public categoryPieChartType: ChartType = 'pie';

  public categoryPieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadDashboardStats();
    this.loadSalesData();
    this.loadTopProducts();
    this.loadCategorySales();
  }

  loadDashboardStats(): void {
    this.isLoadingStats = true;
    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.isLoadingStats = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.errorMessage = 'Failed to load dashboard statistics';
        this.isLoadingStats = false;
      }
    });
  }

  loadSalesData(): void {
    this.isLoadingCharts = true;
    this.analyticsService.getSalesData(this.selectedDays).subscribe({
      next: (data) => {
        this.salesData = data;
        this.updateSalesChart(data);
        this.isLoadingCharts = false;
      },
      error: (error) => {
        console.error('Error loading sales data:', error);
        this.isLoadingCharts = false;
      }
    });
  }

  loadTopProducts(): void {
    this.isLoadingProducts = true;
    this.analyticsService.getTopProducts(10).subscribe({
      next: (data) => {
        this.topProducts = data;
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error loading top products:', error);
        this.isLoadingProducts = false;
      }
    });
  }

  loadCategorySales(): void {
    this.analyticsService.getCategorySales().subscribe({
      next: (data) => {
        this.categorySales = data;
        this.updateCategoryChart(data);
      },
      error: (error) => {
        console.error('Error loading category sales:', error);
      }
    });
  }

  updateSalesChart(data: SalesData[]): void {
    this.salesLineChartData.labels = data.map(item => item.date);
    this.salesLineChartData.datasets[0].data = data.map(item => item.revenue);
    this.salesLineChartData.datasets[1].data = data.map(item => item.orders);
    this.chart?.update();
  }

  updateCategoryChart(data: CategorySales[]): void {
    this.categoryPieChartData.labels = data.map(item => item.categoryName);
    this.categoryPieChartData.datasets[0].data = data.map(item => item.revenue);
    this.chart?.update();
  }

  onPeriodChange(period: 'daily' | 'weekly' | 'monthly'): void {
    this.selectedPeriod = period;
    
    // Adjust days based on period
    switch(period) {
      case 'daily':
        this.selectedDays = 30;
        break;
      case 'weekly':
        this.selectedDays = 90;
        break;
      case 'monthly':
        this.selectedDays = 365;
        break;
    }
    
    this.loadSalesData();
  }

  exportData(): void {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - this.selectedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    this.analyticsService.exportAnalytics(startDate, endDate).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${startDate}-to-${endDate}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        alert('Failed to export analytics data');
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
