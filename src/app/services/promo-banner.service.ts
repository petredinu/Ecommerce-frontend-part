import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PromoBanner } from '../common/promo-banner';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromoBannerService {

  private baseUrl = `${environment.luv2shopApiUrl}/promo-banners`;
  private activeBannerSubject = new BehaviorSubject<PromoBanner | null>(null);
  public activeBanner$ = this.activeBannerSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadActiveBanner();
  }

  // Get active banner for homepage
  getActiveBanner(): Observable<PromoBanner> {
    return this.httpClient.get<PromoBanner>(`${this.baseUrl}/active`).pipe(
      tap(banner => this.activeBannerSubject.next(banner)),
      catchError(this.handleError)
    );
  }

  // Get all banners (admin)
  getAllBanners(): Observable<PromoBanner[]> {
    return this.httpClient.get<PromoBanner[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get banner by ID
  getBannerById(id: number): Observable<PromoBanner> {
    return this.httpClient.get<PromoBanner>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new banner (admin)
  createBanner(banner: PromoBanner): Observable<PromoBanner> {
    return this.httpClient.post<PromoBanner>(this.baseUrl, banner).pipe(
      tap(() => this.loadActiveBanner()),
      catchError(this.handleError)
    );
  }

  // Update banner (admin)
  updateBanner(id: number, banner: PromoBanner): Observable<PromoBanner> {
    return this.httpClient.put<PromoBanner>(`${this.baseUrl}/${id}`, banner).pipe(
      tap(() => this.loadActiveBanner()),
      catchError(this.handleError)
    );
  }

  // Delete banner (admin)
  deleteBanner(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadActiveBanner()),
      catchError(this.handleError)
    );
  }

  // Activate/Deactivate banner (admin)
  toggleBannerStatus(id: number, active: boolean): Observable<PromoBanner> {
    return this.httpClient.patch<PromoBanner>(`${this.baseUrl}/${id}/status`, { active }).pipe(
      tap(() => this.loadActiveBanner()),
      catchError(this.handleError)
    );
  }

  private loadActiveBanner(): void {
    this.getActiveBanner().subscribe();
  }

  private handleError(error: any): Observable<never> {
    console.error('PromoBannerService Error:', error);
    throw error;
  }
}
