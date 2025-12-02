import { Component } from '@angular/core';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-email-test',
  template: `
    <div class="email-test-container">
      <h2>🧪 Email System Testing Panel</h2>
      
      <div class="test-section">
        <h3>Test Email Functionality</h3>
        <input 
          type="email" 
          [(ngModel)]="testEmail" 
          placeholder="Enter test email"
          class="test-input"
        />
        
        <div class="button-grid">
          <button (click)="testWelcomeEmail()" [disabled]="isLoading">
            <i class="fas fa-user-plus"></i> Welcome Email
          </button>
          
          <button (click)="testNewsletterEmail()" [disabled]="isLoading">
            <i class="fas fa-envelope"></i> Newsletter
          </button>
          
          <button (click)="testSimpleEmail()" [disabled]="isLoading">
            <i class="fas fa-paper-plane"></i> Simple Test
          </button>
        </div>
        
        <div *ngIf="message" class="message" [class.success]="isSuccess" [class.error]="!isSuccess">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .email-test-container {
      max-width: 600px;
      margin: 50px auto;
      padding: 30px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h2 {
      color: #0da8e4;
      margin-bottom: 30px;
    }
    
    .test-section {
      margin: 20px 0;
    }
    
    .test-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      margin-bottom: 20px;
    }
    
    .button-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin: 20px 0;
    }
    
    button {
      padding: 12px 20px;
      background: #0da8e4;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s;
    }
    
    button:hover:not(:disabled) {
      background: #0889c2;
      transform: translateY(-2px);
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .message {
      padding: 12px;
      border-radius: 5px;
      margin-top: 15px;
      text-align: center;
    }
    
    .message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `],
  standalone: false
})
export class EmailTestComponent {
  testEmail: string = '';
  isLoading: boolean = false;
  message: string = '';
  isSuccess: boolean = false;

  constructor(private emailService: EmailService) {}

  testWelcomeEmail() {
    if (!this.testEmail) {
      this.showMessage('Please enter an email address', false);
      return;
    }

    this.isLoading = true;
    this.emailService.sendWelcomeEmail(this.testEmail, 'Test User').subscribe({
      next: (response) => {
        this.showMessage('Welcome email sent successfully!', true);
        this.isLoading = false;
      },
      error: (error) => {
        this.showMessage('Failed to send welcome email', false);
        this.isLoading = false;
      }
    });
  }

  testNewsletterEmail() {
    if (!this.testEmail) {
      this.showMessage('Please enter an email address', false);
      return;
    }

    this.isLoading = true;
    this.emailService.subscribeNewsletter(this.testEmail).subscribe({
      next: (response) => {
        this.showMessage('Newsletter confirmation sent!', true);
        this.isLoading = false;
      },
      error: (error) => {
        this.showMessage('Failed to send newsletter email', false);
        this.isLoading = false;
      }
    });
  }

  testSimpleEmail() {
    if (!this.testEmail) {
      this.showMessage('Please enter an email address', false);
      return;
    }

    this.isLoading = true;
    this.emailService.sendTestEmail(this.testEmail).subscribe({
      next: (response) => {
        this.showMessage('Test email sent successfully!', true);
        this.isLoading = false;
      },
      error: (error) => {
        this.showMessage('Failed to send test email', false);
        this.isLoading = false;
      }
    });
  }

  private showMessage(text: string, success: boolean) {
    this.message = text;
    this.isSuccess = success;
    
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
