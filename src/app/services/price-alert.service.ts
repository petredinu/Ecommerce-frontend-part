import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PriceAlert } from '../common/price-alert';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceAlertService {

  private baseUrl = `${environment.luv2shopApiUrl}/price-alerts`;

  constructor(private httpClient: HttpClient) { }

  createAlert(userEmail: string, productId: number, targetPrice: number): Observable<PriceAlert> {
    const request = {
      userEmail: userEmail,
      productId: productId,
      targetPrice: targetPrice
    };
    return this.httpClient.post<PriceAlert>(this.baseUrl, request);
  }

  getAlertsByUser(email: string): Observable<PriceAlert[]> {
    const url = `${this.baseUrl}/user/${email}`;
    return this.httpClient.get<PriceAlert[]>(url);
  }

  getActiveAlertsByUser(email: string): Observable<PriceAlert[]> {
    const url = `${this.baseUrl}/user/${email}/active`;
    return this.httpClient.get<PriceAlert[]>(url);
  }

  deleteAlert(alertId: number): Observable<any> {
    const url = `${this.baseUrl}/${alertId}`;
    return this.httpClient.delete(url);
  }

  triggerPriceCheck(): Observable<any> {
    const url = `${this.baseUrl}/check-prices`;
    return this.httpClient.post(url, {});
  }

  getStats(): Observable<{activeAlerts: number, notifiedAlerts: number}> {
    const url = `${this.baseUrl}/stats`;
    return this.httpClient.get<{activeAlerts: number, notifiedAlerts: number}>(url);
  }
}
