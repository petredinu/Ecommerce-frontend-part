import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  standalone: false,
  templateUrl: './payment-cancel.component.html',
  styleUrl: './payment-cancel.component.css'
})
export class PaymentCancelComponent implements OnInit {
  reason: string = '';
  paymentIntentId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.reason = params['reason'] || 'unknown';
      this.paymentIntentId = params['payment_intent'] || '';
    });
  }

  goToCheckout(): void {
    this.router.navigateByUrl('/checkout');
  }

  goToCart(): void {
    this.router.navigateByUrl('/cart-details');
  }

  goToHome(): void {
    this.router.navigateByUrl('/products');
  }

  getReasonMessage(): string {
    const reasons: { [key: string]: string } = {
      'card_declined': 'Cardul tău a fost refuzat de către bancă.',
      'insufficient_funds': 'Fonduri insuficiente pentru a finaliza plata.',
      'expired_card': 'Cardul tău a expirat.',
      'processing_error': 'A apărut o eroare la procesarea plății.',
      'authentication_failed': 'Autentificarea cardului a eșuat.',
      'canceled_by_user': 'Ai anulat plata.',
      'network_error': 'Eroare de conexiune. Te rugăm să verifici internetul.',
      'unknown': 'A apărut o eroare neașteptată.'
    };

    return reasons[this.reason] || reasons['unknown'];
  }

  getReasonIcon(): string {
    const icons: { [key: string]: string } = {
      'canceled_by_user': 'fa-times-circle',
      'card_declined': 'fa-credit-card',
      'insufficient_funds': 'fa-wallet',
      'expired_card': 'fa-calendar-times',
      'network_error': 'fa-wifi',
      'unknown': 'fa-exclamation-triangle'
    };

    return icons[this.reason] || icons['unknown'];
  }
}
