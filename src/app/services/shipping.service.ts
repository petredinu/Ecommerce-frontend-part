import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShippingMethod } from '../common/shipping-method';
import { ShippingZone } from '../common/shipping-zone';
import { environment } from '../../environments/environment';

interface GetResponseShippingMethods {
  _embedded?: {
    shippingMethods: ShippingMethod[];
  };
  shippingMethods?: ShippingMethod[];
  error?: string;
}

interface ShippingCalculation {
  shippingMethodId: number;
  shippingMethodName: string;
  cost: number;
  estimatedDays: string;
  isFree: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private baseUrl = `${environment.luv2shopApiUrl}/shipping`;

  constructor(private httpClient: HttpClient) { }

  // Get available shipping methods for a country
  getShippingMethodsByCountry(countryCode: string): Observable<ShippingMethod[]> {
    const url = `${this.baseUrl}/methods/country/${countryCode}`;
    return this.httpClient.get<GetResponseShippingMethods>(url).pipe(
      map(response => {
        // Support both formats: direct array or Spring Data REST format
        if (response._embedded && response._embedded.shippingMethods) {
          return response._embedded.shippingMethods;
        } else if (response.shippingMethods) {
          return response.shippingMethods;
        } else if (Array.isArray(response)) {
          return response as any as ShippingMethod[];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching shipping methods:', error);
        return of(this.getDefaultShippingMethods());
      })
    );
  }

  // Get all active shipping methods
  getAllShippingMethods(): Observable<ShippingMethod[]> {
    const url = `${this.baseUrl}/methods`;
    return this.httpClient.get<GetResponseShippingMethods>(url).pipe(
      map(response => {
        // Support both formats: direct array or Spring Data REST format
        if (response._embedded && response._embedded.shippingMethods) {
          return response._embedded.shippingMethods;
        } else if (response.shippingMethods) {
          return response.shippingMethods;
        } else if (Array.isArray(response)) {
          return response as any as ShippingMethod[];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching shipping methods:', error);
        return of(this.getDefaultShippingMethods());
      })
    );
  }

  // Calculate shipping cost
  calculateShippingCost(
    shippingMethodId: number,
    countryCode: string,
    totalWeight: number,
    orderTotal: number
  ): Observable<ShippingCalculation> {
    const url = `${this.baseUrl}/calculate`;
    const body = { shippingMethodId, countryCode, totalWeight, orderTotal };
    
    return this.httpClient.post<ShippingCalculation>(url, body).pipe(
      catchError(error => {
        console.error('Error calculating shipping:', error);
        return of(this.getDefaultShippingCalculation());
      })
    );
  }

  // Get shipping zones
  getShippingZones(): Observable<ShippingZone[]> {
    return this.httpClient.get<ShippingZone[]>(`${this.baseUrl}/zones`).pipe(
      catchError(error => {
        console.error('Error fetching shipping zones:', error);
        return of([]);
      })
    );
  }

  // Calculate total weight from cart items (assumes 0.5kg per item by default)
  calculateTotalWeight(cartItems: any[]): number {
    return cartItems.reduce((total, item) => {
      const itemWeight = item.weight || 0.5; // default 0.5kg per item
      return total + (itemWeight * item.quantity);
    }, 0);
  }

  // Check if order qualifies for free shipping
  qualifiesForFreeShipping(orderTotal: number, shippingMethod: ShippingMethod): boolean {
    if (!shippingMethod.freeShippingThreshold) {
      return false;
    }
    return orderTotal >= shippingMethod.freeShippingThreshold;
  }

  // Get default shipping methods (fallback if API fails)
  private getDefaultShippingMethods(): ShippingMethod[] {
    return [
      new ShippingMethod(1, 'Standard Shipping', 'Delivery in 5-7 business days', '5-7 days', 9.99, true, 0, 50),
      new ShippingMethod(2, 'Express Shipping', 'Delivery in 2-3 business days', '2-3 days', 19.99, true, 0, 100),
      new ShippingMethod(3, 'Next Day Delivery', 'Delivery next business day', '1 day', 29.99, true, 0, 150)
    ];
  }

  private getDefaultShippingCalculation(): ShippingCalculation {
    return {
      shippingMethodId: 1,
      shippingMethodName: 'Standard Shipping',
      cost: 9.99,
      estimatedDays: '5-7 days',
      isFree: false
    };
  }
}
