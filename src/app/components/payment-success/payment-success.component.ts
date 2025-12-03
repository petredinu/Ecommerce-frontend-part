import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: false,
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  paymentIntentId: string = '';
  orderTrackingNumber: string = '';
  isLoading: boolean = true;
  paymentDetails: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // Get payment_intent from URL query params
    this.route.queryParams.subscribe(params => {
      this.paymentIntentId = params['payment_intent'] || '';
      this.orderTrackingNumber = params['order_tracking'] || '';

      if (this.paymentIntentId) {
        this.loadPaymentDetails();
      } else {
        this.isLoading = false;
        this.errorMessage = 'Nu s-au găsit detalii despre plată.';
      }
    });
  }

  loadPaymentDetails(): void {
    this.paymentService.getPaymentIntent(this.paymentIntentId).subscribe({
      next: (details) => {
        this.paymentDetails = details;
        this.isLoading = false;
        console.log('Payment details loaded:', details);
      },
      error: (error) => {
        console.error('Error loading payment details:', error);
        this.isLoading = false;
        // Still show success even if we can't load details
        this.errorMessage = '';
      }
    });
  }

  goToOrders(): void {
    this.router.navigateByUrl('/order-history');
  }

  goToHome(): void {
    this.router.navigateByUrl('/products');
  }

  formatAmount(amountInCents: number): number {
    return this.paymentService.convertFromCents(amountInCents);
  }
}
