import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Stripe, StripeElements, StripeCardElement, StripeCardElementOptions } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-payment',
  standalone: false,
  templateUrl: './stripe-payment.component.html',
  styleUrl: './stripe-payment.component.css'
})
export class StripePaymentComponent implements OnInit, OnDestroy {
  @Input() amount: number = 0;          // Amount in Lei (will be converted to cents)
  @Input() currency: string = 'ron';    // Currency code
  @Input() customerEmail: string = '';  // Customer email
  @Input() description: string = '';    // Order description
  
  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentError = new EventEmitter<any>();
  @Output() paymentProcessing = new EventEmitter<boolean>();

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  isProcessing: boolean = false;
  errorMessage: string = '';
  clientSecret: string = '';
  paymentIntentId: string = '';

  // Stripe Elements style
  cardStyle: StripeCardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        },
        iconColor: '#666EE8'
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
    hidePostalCode: true
  };

  constructor(private paymentService: PaymentService) {}

  async ngOnInit(): Promise<void> {
    try {
      // Initialize Stripe
      this.stripe = await this.paymentService.initializeStripe();
      
      if (!this.stripe) {
        this.errorMessage = 'Eroare la inițializarea Stripe. Te rugăm să reîncerci.';
        return;
      }

      // Create Elements
      this.elements = this.stripe.elements();
      
      // Create and mount Card Element
      this.cardElement = this.elements.create('card', this.cardStyle);
      this.cardElement.mount('#card-element');

      // Listen for errors
      this.cardElement.on('change', (event) => {
        if (event.error) {
          this.errorMessage = event.error.message;
        } else {
          this.errorMessage = '';
        }
      });

      console.log('Stripe Elements initialized successfully');
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.errorMessage = 'Eroare la inițializarea sistemului de plată. Te rugăm să reîncerci.';
    }
  }

  ngOnDestroy(): void {
    // Clean up Card Element
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  /**
   * Process the payment
   */
  async processPayment(): Promise<void> {
    if (!this.stripe || !this.cardElement) {
      this.errorMessage = 'Sistemul de plată nu este disponibil. Te rugăm să reîmprospătezi pagina.';
      return;
    }

    if (!this.customerEmail) {
      this.errorMessage = 'Email-ul clientului este necesar.';
      return;
    }

    if (this.amount <= 0) {
      this.errorMessage = 'Suma comenzii este invalidă.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.paymentProcessing.emit(true);

    try {
      // Step 1: Create Payment Intent on backend
      const amountInCents = this.paymentService.convertToCents(this.amount);
      
      const paymentInfo = {
        amount: amountInCents,
        currency: this.currency,
        receiptEmail: this.customerEmail,
        description: this.description || `Comandă ${new Date().toLocaleString()}`
      };

      console.log('Creating Payment Intent:', paymentInfo);

      const paymentIntentResponse = await this.paymentService
        .createPaymentIntent(paymentInfo)
        .toPromise();

      if (!paymentIntentResponse) {
        throw new Error('Nu s-a putut crea intenția de plată.');
      }

      this.clientSecret = paymentIntentResponse.clientSecret;
      this.paymentIntentId = paymentIntentResponse.paymentIntentId;

      console.log('Payment Intent created:', this.paymentIntentId);

      // Step 2: Confirm card payment with Stripe
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        this.clientSecret,
        {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              email: this.customerEmail
            }
          }
        }
      );

      if (error) {
        // Payment failed
        console.error('Payment failed:', error);
        this.errorMessage = this.getErrorMessage(error.code || '', error.message || '');
        this.paymentError.emit({
          error: error,
          paymentIntentId: this.paymentIntentId
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        console.log('Payment succeeded:', paymentIntent);
        this.paymentSuccess.emit({
          paymentIntent: paymentIntent,
          paymentIntentId: this.paymentIntentId
        });
      } else {
        // Unexpected status
        console.warn('Unexpected payment status:', paymentIntent?.status);
        this.errorMessage = 'Plata este în așteptare. Te rugăm să verifici starea comenzii.';
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      this.errorMessage = error.message || 'A apărut o eroare la procesarea plății. Te rugăm să reîncerci.';
      this.paymentError.emit({ error: error });
    } finally {
      this.isProcessing = false;
      this.paymentProcessing.emit(false);
    }
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(code: string, defaultMessage: string): string {
    const errorMessages: { [key: string]: string } = {
      'card_declined': 'Cardul tău a fost refuzat. Te rugăm să încerci alt card.',
      'expired_card': 'Cardul tău a expirat. Te rugăm să folosești alt card.',
      'incorrect_cvc': 'Codul de securitate (CVC) este incorect.',
      'processing_error': 'A apărut o eroare la procesare. Te rugăm să reîncerci.',
      'incorrect_number': 'Numărul cardului este incorect.',
      'invalid_expiry_month': 'Luna de expirare este invalidă.',
      'invalid_expiry_year': 'Anul de expirare este invalid.',
      'insufficient_funds': 'Fonduri insuficiente. Te rugăm să folosești alt card.',
      'authentication_required': 'Este necesară autentificarea cardului. Te rugăm să urmezi instrucțiunile băncii.',
    };

    return errorMessages[code] || defaultMessage || 'A apărut o eroare la procesarea plății.';
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage = '';
  }
}
