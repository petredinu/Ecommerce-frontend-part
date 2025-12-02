import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PromoCode } from '../common/promo-code';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {

  private baseUrl = `${environment.luv2shopApiUrl}/promo-codes`;

  constructor(private httpClient: HttpClient) { }

  // Get all promo codes (admin)
  getAllPromoCodes(): Observable<PromoCode[]> {
    return this.httpClient.get<PromoCode[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get promo code by ID
  getPromoCodeById(id: number): Observable<PromoCode> {
    return this.httpClient.get<PromoCode>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new promo code
  createPromoCode(promoCode: PromoCode): Observable<PromoCode> {
    return this.httpClient.post<PromoCode>(this.baseUrl, promoCode).pipe(
      catchError(this.handleError)
    );
  }

  // Update promo code
  updatePromoCode(id: number, promoCode: PromoCode): Observable<PromoCode> {
    return this.httpClient.put<PromoCode>(`${this.baseUrl}/${id}`, promoCode).pipe(
      catchError(this.handleError)
    );
  }

  // Delete promo code
  deletePromoCode(id: number): Observable<string> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // Toggle active status
  togglePromoCodeStatus(id: number): Observable<PromoCode> {
    return this.httpClient.patch<PromoCode>(`${this.baseUrl}/${id}/status`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Validate promo code (checkout)
  validatePromoCode(code: string, orderTotal: number): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/validate`, {
      code: code,
      orderTotal: orderTotal
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Apply promo code (increment used count)
  applyPromoCode(code: string): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/apply`, { code }, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('PromoCodeService Error:', error);
    return throwError(() => error);
  }
}
