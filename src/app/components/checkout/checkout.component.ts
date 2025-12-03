import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { StripePaymentComponent } from '../stripe-payment/stripe-payment.component';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { ShippingService } from '../../services/shipping.service';
import { PromoCodeService } from '../../services/promo-code.service';
import { Route, Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { Address } from '../../common/address';
import { Customer } from '../../common/customer';
import { ShippingMethod } from '../../common/shipping-method';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  totalPrice: number = 0;
  totalQuantity: number = 0;
  isCashOnDelivery: boolean = false;
  isStripePayment: boolean = false;
  isProcessingPayment: boolean = false;
  paymentError: string = '';
  
  @ViewChild(StripePaymentComponent) stripePayment!: StripePaymentComponent;
  
  // Shipping
  shippingMethods: ShippingMethod[] = [];
  selectedShippingMethod: ShippingMethod | null = null;
  shippingCost: number = 0;
  totalWithShipping: number = 0;

  // Promo Code
  promoCode: string = '';
  appliedPromoCode: string = '';
  discount: number = 0;
  promoCodeMessage: string = '';
  isApplyingPromoCode: boolean = false;

  checkoutFormGroup!: FormGroup<any>;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private shippingService: ShippingService,
              private promoCodeService: PromoCodeService,
              private paymentService: PaymentService,
              private router: Router) {}

 ngOnInit(): void {

    this.reviewCartDetails();

    // Set default payment method to Stripe
    this.isStripePayment = true;

    // --- COD MODIFICAT PENTRU SIGURANȚĂ ---
    let theEmail = '';
    try {
      const storedEmail = this.storage.getItem('userEmail');
      if (storedEmail) {
        theEmail = JSON.parse(storedEmail);
      }
    } catch (e) {
      console.log('Eroare la citirea emailului (probabil format invalid):', e);
      // Optional: ștergem data coruptă
      this.storage.removeItem('userEmail');
    }
    // --------------------------------------

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Luv2ShopValidators.cardLuhnValidator, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })

    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

    // Disable credit card form group since we're using Stripe by default
    this.checkoutFormGroup.get('creditCard')?.disable();
  }
  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }


    get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
    get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
    get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
    get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
    get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

    get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
    get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
    get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
    get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
    get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

    get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
    get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
    get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
    get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }

  }

  handlePaymentMethodChange(event: any) {
    this.isCashOnDelivery = event.target.checked;
    this.isStripePayment = !this.isCashOnDelivery; // Use Stripe if not cash on delivery

    const creditCardGroup = this.checkoutFormGroup.get('creditCard');

    if (this.isCashOnDelivery) {
      // Daca e cash, dezactivam grupul de card (validarile sunt ignorate automat)
      creditCardGroup?.disable();
    } else if (this.isStripePayment) {
      // Daca folosim Stripe, dezactivam grupul de card legacy
      creditCardGroup?.disable();
    } else {
      // Daca debifeaza, reactivam grupul de card
      creditCardGroup?.enable();
    }
  }





  async onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // If using Stripe payment, process payment first
    if (this.isStripePayment && !this.isCashOnDelivery) {
      await this.processStripePayment();
      return;
    }

    // If cash on delivery, proceed with order placement
    this.placeOrder();
  }

  async processStripePayment() {
    if (!this.stripePayment) {
      this.paymentError = 'Sistemul de plată nu este disponibil. Te rugăm să reîmprospătezi pagina.';
      return;
    }

    this.isProcessingPayment = true;
    this.paymentError = '';

    try {
      // Process payment through Stripe
      await this.stripePayment.processPayment();
      // Payment success will be handled by onPaymentSuccess callback
    } catch (error: any) {
      console.error('Payment processing error:', error);
      this.paymentError = error.message || 'A apărut o eroare la procesarea plății.';
      this.isProcessingPayment = false;
    }
  }

  onPaymentSuccess(event: any) {
    console.log('Payment successful:', event);
    // Now place the order with payment intent ID
    this.placeOrder(event.paymentIntentId);
  }

  onPaymentError(event: any) {
    console.error('Payment error:', event);
    this.isProcessingPayment = false;
    this.paymentError = 'Plata a eșuat. Te rugăm să încerci din nou.';
  }

  onPaymentProcessing(isProcessing: boolean) {
    this.isProcessingPayment = isProcessing;
  }

  placeOrder(paymentIntentId?: string) {
    // set up order
    let order = new Order();
    order.totalPrice = this.getFinalTotal(); // Use final total with discount
    order.totalQuantity = this.totalQuantity;

    // --- MODIFICARE AICI: Setam metoda de plata in obiectul Order ---
    order.paymentMethod = this.isCashOnDelivery ? 'CASH' : 'STRIPE';
    
    // Add payment intent ID if Stripe payment
    if (paymentIntentId) {
      (order as any).paymentIntentId = paymentIntentId;
    }


    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItemsfrom cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i< cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
      */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();
    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    // populate purchase - order and orderItems
    purchase.order= order;
    purchase.orderItems = orderItems;

    // Add promo code to purchase if applied
    if (this.appliedPromoCode) {
      purchase.promoCode = this.appliedPromoCode;
    }

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          // Increment promo code usage count after successful order
          if (this.appliedPromoCode) {
            this.promoCodeService.applyPromoCode(this.appliedPromoCode).subscribe({
              next: () => {
                console.log('Promo code usage incremented:', this.appliedPromoCode);
              },
              error: (err) => {
                console.error('Error incrementing promo code usage:', err);
              }
            });
          }

          // Reset cart before redirect
          this.cartService.cartItems = [];
          this.cartService.totalPrice.next(0);
          this.cartService.totalQuantity.next(0);
          this.cartService.removeCart();

          // Redirect based on payment method
          if (paymentIntentId) {
            // Stripe payment - redirect to success page with payment intent
            this.router.navigateByUrl(
              `/payment-success?payment_intent=${paymentIntentId}&order_tracking=${response.orderTrackingNumber}`
            );
          } else {
            // Cash on delivery - show alert and redirect
            alert(`Comanda ta a fost primită. \nNumăr tracking comandă: ${response.orderTrackingNumber}`);
            this.router.navigateByUrl('/products');
          }
        },
        error: err => {
          this.isProcessingPayment = false;
          this.paymentError = `A apărut o eroare: ${err.message}`;
          alert(`A apărut o eroare: ${err.message}`);
        }
      }
    );
  }


  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // MODIFICARE: Apelăm metoda din service care se ocupă și de localStorage
    this.cartService.removeCart();

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
          // Load shipping methods when country changes
          this.loadShippingMethods(countryCode);
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );

  }

  loadShippingMethods(countryCode: string): void {
    this.shippingService.getShippingMethodsByCountry(countryCode).subscribe({
      next: (methods) => {
        this.shippingMethods = methods;
        // Select first method by default
        if (methods.length > 0) {
          this.onShippingMethodChange(methods[0]);
        }
      },
      error: (error) => {
        console.error('Error loading shipping methods:', error);
        // Use default methods as fallback
        this.shippingMethods = this.shippingService['getDefaultShippingMethods']();
        if (this.shippingMethods.length > 0) {
          this.onShippingMethodChange(this.shippingMethods[0]);
        }
      }
    });
  }

  onShippingMethodChange(method: ShippingMethod): void {
    this.selectedShippingMethod = method;
    
    // Calculate shipping cost
    const cartWeight = this.shippingService.calculateTotalWeight(this.cartService.cartItems);
    
    this.shippingService.calculateShippingCost(
      method.id,
      this.checkoutFormGroup.get('shippingAddress.country')?.value?.code || 'US',
      cartWeight,
      this.totalPrice
    ).subscribe({
      next: (calculation) => {
        this.shippingCost = calculation.cost;
        this.totalWithShipping = this.totalPrice + this.shippingCost;
      },
      error: (error) => {
        console.error('Error calculating shipping:', error);
        // Use base price as fallback
        const isFreeShipping = this.shippingService.qualifiesForFreeShipping(this.totalPrice, method);
        this.shippingCost = isFreeShipping ? 0 : method.basePrice;
        this.totalWithShipping = this.totalPrice + this.shippingCost;
      }
    });
  }

  // PROMO CODE METHODS
  applyPromoCode() {
    if (!this.promoCode || this.promoCode.trim() === '') {
      this.promoCodeMessage = 'Te rog introdu un cod promoțional';
      return;
    }

    this.isApplyingPromoCode = true;
    this.promoCodeMessage = '';

    const orderTotal = this.totalPrice + this.shippingCost;

    this.promoCodeService.validatePromoCode(this.promoCode.toUpperCase(), orderTotal).subscribe({
      next: (response) => {
        if (response.valid) {
          this.appliedPromoCode = this.promoCode.toUpperCase();
          this.discount = response.discountAmount;
          this.promoCodeMessage = `✓ ${response.message}`;
          this.recalculateTotal();
        } else {
          this.promoCodeMessage = `✗ ${response.message}`;
          this.discount = 0;
          this.appliedPromoCode = '';
        }
        this.isApplyingPromoCode = false;
      },
      error: (err) => {
        console.error('Eroare la validarea codului:', err);
        this.promoCodeMessage = '✗ Eroare la validarea codului promoțional';
        this.discount = 0;
        this.appliedPromoCode = '';
        this.isApplyingPromoCode = false;
      }
    });
  }

  removePromoCode() {
    this.promoCode = '';
    this.appliedPromoCode = '';
    this.discount = 0;
    this.promoCodeMessage = '';
    this.recalculateTotal();
  }

  recalculateTotal() {
    this.totalWithShipping = this.totalPrice + this.shippingCost - this.discount;
  }

  getFinalTotal(): number {
    return Math.max(0, this.totalPrice + this.shippingCost - this.discount);
  }

}
