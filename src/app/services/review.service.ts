import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductReview } from '../common/product-review';
import { environment } from '../../environments/environment';

interface GetResponseReviews {
  _embedded: {
    productReviews: ProductReview[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number }; // { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = `${environment.luv2shopApiUrl}/reviews`;

  constructor(private httpClient: HttpClient) { }

  // Get reviews for a product
  getProductReviews(productId: number, page: number = 0, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/product/${productId}?page=${page}&size=${pageSize}&sort=dateCreated,desc`;
    return this.httpClient.get<GetResponseReviews>(url).pipe(
      map(response => ({
        reviews: response._embedded.productReviews,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      })),
      catchError(this.handleError)
    );
  }

  // Get review statistics for a product
  getReviewStats(productId: number): Observable<ReviewStats> {
    return this.httpClient.get<ReviewStats>(`${this.baseUrl}/product/${productId}/stats`).pipe(
      catchError(error => {
        console.error('Error fetching review stats:', error);
        return of({ averageRating: 0, totalReviews: 0, ratingDistribution: {} });
      })
    );
  }

  // Add a new review
  addReview(review: {
    productId: number,
    rating: number,
    title: string,
    comment: string
  }): Observable<ProductReview> {
    return this.httpClient.post<ProductReview>(this.baseUrl, review).pipe(
      catchError(this.handleError)
    );
  }

  // Update a review
  updateReview(reviewId: number, review: {
    rating: number,
    title: string,
    comment: string
  }): Observable<ProductReview> {
    return this.httpClient.put<ProductReview>(`${this.baseUrl}/${reviewId}`, review).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a review
  deleteReview(reviewId: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${reviewId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Mark review as helpful
  markHelpful(reviewId: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${reviewId}/helpful`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Check if user can review a product (has purchased it)
  canUserReview(productId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/can-review/${productId}`).pipe(
      catchError(error => {
        console.error('Error checking review eligibility:', error);
        return of(false);
      })
    );
  }

  // Get user's review for a product
  getUserReviewForProduct(productId: number): Observable<ProductReview | null> {
    return this.httpClient.get<ProductReview>(`${this.baseUrl}/user/product/${productId}`).pipe(
      catchError(error => {
        console.error('Error fetching user review:', error);
        return of(null);
      })
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('Error in ReviewService:', error);
    return of(null);
  }
}
