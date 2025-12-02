import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  DashboardStats, 
  SalesData, 
  TopProduct, 
  CategorySales, 
  RevenueByPeriod 
} from '../common/dashboard-stats';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private baseUrl = environment.luv2shopApiUrl + '/analytics';

  constructor(private httpClient: HttpClient) { }

  /**
   * Get overall dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.httpClient.get<DashboardStats>(`${this.baseUrl}/dashboard-stats`);
  }

  /**
   * Get sales data for the last N days
   */
  getSalesData(days: number = 30): Observable<SalesData[]> {
    return this.httpClient.get<SalesData[]>(`${this.baseUrl}/sales-data?days=${days}`);
  }

  /**
   * Get top selling products
   */
  getTopProducts(limit: number = 10): Observable<TopProduct[]> {
    return this.httpClient.get<TopProduct[]>(`${this.baseUrl}/top-products?limit=${limit}`);
  }

  /**
   * Get revenue breakdown by category
   */
  getCategorySales(): Observable<CategorySales[]> {
    return this.httpClient.get<CategorySales[]>(`${this.baseUrl}/category-sales`);
  }

  /**
   * Get revenue by period (daily, weekly, monthly)
   */
  getRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly', limit: number = 12): Observable<RevenueByPeriod[]> {
    return this.httpClient.get<RevenueByPeriod[]>(`${this.baseUrl}/revenue-by-period?period=${period}&limit=${limit}`);
  }

  /**
   * Get abandoned carts count
   */
  getAbandonedCartsCount(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/abandoned-carts-count`);
  }

  /**
   * Export analytics data as CSV
   */
  exportAnalytics(startDate: string, endDate: string): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}/export?startDate=${startDate}&endDate=${endDate}`, {
      responseType: 'blob'
    });
  }
}
