import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockMovement } from '../common/stock-movement';
import { StockAlert } from '../common/stock-alert';
import { environment } from '../../environments/environment';

interface GetResponseStockMovements {
  _embedded: {
    stockMovements: StockMovement[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseStockAlerts {
  _embedded: {
    stockAlerts: StockAlert[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  
  private baseUrl = `${environment.luv2shopApiUrl}/stock`;

  constructor(private httpClient: HttpClient) { }

  // Get stock movements for a product
  getStockMovementsByProduct(productId: number, page: number = 0, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/movements/product/${productId}?page=${page}&size=${pageSize}&sort=dateCreated,desc`;
    return this.httpClient.get<GetResponseStockMovements>(url).pipe(
      map(response => ({
        movements: response._embedded.stockMovements,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      })),
      catchError(this.handleError)
    );
  }

  // Get all stock movements (for admin)
  getAllStockMovements(page: number = 0, pageSize: number = 20): Observable<any> {
    const url = `${this.baseUrl}/movements?page=${page}&size=${pageSize}&sort=dateCreated,desc`;
    return this.httpClient.get<GetResponseStockMovements>(url).pipe(
      map(response => ({
        movements: response._embedded.stockMovements,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      })),
      catchError(this.handleError)
    );
  }

  // Record a stock movement
  recordStockMovement(movement: {
    productId: number,
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: number,
    reason: string
  }): Observable<StockMovement> {
    return this.httpClient.post<StockMovement>(`${this.baseUrl}/movements`, movement).pipe(
      catchError(this.handleError)
    );
  }

  // Get active stock alerts
  getActiveStockAlerts(): Observable<StockAlert[]> {
    const url = `${this.baseUrl}/alerts/active`;
    return this.httpClient.get<GetResponseStockAlerts>(url).pipe(
      map(response => response._embedded.stockAlerts),
      catchError(this.handleError)
    );
  }

  // Get all stock alerts
  getAllStockAlerts(page: number = 0, pageSize: number = 20): Observable<any> {
    const url = `${this.baseUrl}/alerts?page=${page}&size=${pageSize}&sort=alertLevel,desc`;
    return this.httpClient.get<GetResponseStockAlerts>(url).pipe(
      map(response => ({
        alerts: response._embedded.stockAlerts,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      })),
      catchError(this.handleError)
    );
  }

  // Update minimum stock level for a product
  updateMinimumStock(productId: number, minimumStock: number): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/minimum/${productId}`, { minimumStock }).pipe(
      catchError(this.handleError)
    );
  }

  // Check if product is low in stock
  isLowStock(currentStock: number, minimumStock: number = 10): boolean {
    return currentStock <= minimumStock && currentStock > 0;
  }

  // Check if product is critically low
  isCriticalStock(currentStock: number, minimumStock: number = 10): boolean {
    return currentStock <= minimumStock * 0.5 && currentStock > 0;
  }

  // Check if product is out of stock
  isOutOfStock(currentStock: number): boolean {
    return currentStock === 0;
  }

  private handleError(error: any): Observable<any> {
    console.error('Error in StockService:', error);
    return of({ movements: [], alerts: [], totalElements: 0, totalPages: 0 });
  }
}
