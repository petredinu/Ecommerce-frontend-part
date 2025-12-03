import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentUrl = `${environment.luv2shopApiUrl}/payment`;
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  constructor(private httpClient: HttpClient) {}

  /**
   * Initialize Stripe with publishable key
   */
  async initializeStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      // Get publishable key from backend
      const config = await this.getStripeConfig().toPromise();
      this.stripe = await loadStripe(config.publishableKey);
    }
    return this.stripe;
  }

  /**
   * Get Stripe configuration (publishable key)
   */
  getStripeConfig(): Observable<any> {
    return this.httpClient.get<any>(`${this.paymentUrl}/config`);
  }

  /**
   * Create a Payment Intent
   * @param paymentInfo Payment information (amount, currency, email, description)
   */
  createPaymentIntent(paymentInfo: PaymentInfo): Observable<PaymentIntentResponse> {
    return this.httpClient.post<PaymentIntentResponse>(
      `${this.paymentUrl}/create-payment-intent`,
      paymentInfo
    );
  }

  /**
   * Retrieve Payment Intent details
   * @param paymentIntentId The payment intent ID
   */
  getPaymentIntent(paymentIntentId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.paymentUrl}/payment-intent/${paymentIntentId}`);
  }

  /**
   * Cancel a Payment Intent
   * @param paymentIntentId The payment intent ID to cancel
   */
  cancelPaymentIntent(paymentIntentId: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.paymentUrl}/cancel-payment-intent/${paymentIntentId}`,
      {}
    );
  }

  /**
   * Request a refund
   * @param refundRequest Refund request details
   */
  requestRefund(refundRequest: RefundRequest): Observable<any> {
    return this.httpClient.post<any>(`${this.paymentUrl}/refund`, refundRequest);
  }

  /**
   * Convert decimal amount to cents for Stripe
   * @param amount Amount in decimal format (e.g., 123.45)
   */
  convertToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert cents to decimal amount
   * @param amountInCents Amount in cents (e.g., 12345)
   */
  convertFromCents(amountInCents: number): number {
    return amountInCents / 100;
  }

  /**
   * Create Stripe Elements
   */
  async createElements(): Promise<StripeElements | null> {
    const stripe = await this.initializeStripe();
    if (stripe) {
      this.elements = stripe.elements();
      return this.elements;
    }
    return null;
  }

  /**
   * Get Stripe instance
   */
  getStripe(): Stripe | null {
    return this.stripe;
  }

  /**
   * Get Stripe Elements instance
   */
  getElements(): StripeElements | null {
    return this.elements;
  }
}

/**
 * Payment Info DTO - matches backend PaymentInfo.java
 */
export interface PaymentInfo {
  amount: number;        // Amount in cents
  currency: string;      // Currency code (e.g., 'ron')
  receiptEmail: string;  // Customer email for receipt
  description?: string;  // Optional order description
}

/**
 * Payment Intent Response DTO - matches backend PaymentIntentResponse.java
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Refund Request DTO
 */
export interface RefundRequest {
  paymentIntentId: string;
  amount?: number;  // Optional, null for full refund
  reason?: string;  // Optional reason
}
