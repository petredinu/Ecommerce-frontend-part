import { Component } from '@angular/core';
import { EmailService } from './services/email.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ecommerce';
  // Adaugă această variabilă pentru starea meniului mobil
  isMobileMenuOpen: boolean = false;

  // Newsletter properties
  newsletterEmail: string = '';
  isSubscribing: boolean = false;
  subscriptionMessage: string = '';
  subscriptionError: string = '';

  constructor(private emailService: EmailService) { }

  // Funcție pentru a deschide/închide meniul
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Funcție pentru a închide meniul când se dă click pe un link (opțional)
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  // Subscribe to newsletter
  subscribeToNewsletter() {
    // Reset messages
    this.subscriptionMessage = '';
    this.subscriptionError = '';

    // Validate email
    if (!this.newsletterEmail || !this.validateEmail(this.newsletterEmail)) {
      this.subscriptionError = 'Please enter a valid email address';
      return;
    }

    this.isSubscribing = true;

    this.emailService.subscribeNewsletter(this.newsletterEmail).subscribe({
      next: (response) => {
        this.subscriptionMessage = 'Successfully subscribed! Check your email for confirmation.';
        this.newsletterEmail = '';
        this.isSubscribing = false;

        // Clear success message after 5 seconds
        setTimeout(() => {
          this.subscriptionMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Newsletter subscription error:', error);
        this.subscriptionError = 'Failed to subscribe. Please try again later.';
        this.isSubscribing = false;

        // Clear error message after 5 seconds
        setTimeout(() => {
          this.subscriptionError = '';
        }, 5000);
      }
    });
  }

  // Validate email format
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
