import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "../../app-routing.module";
import { EmailService } from '../../services/email.service';
import { TranslatePipe } from '../../pipes/translate.pipe';



@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
  imports: [CommonModule, AppRoutingModule, TranslatePipe],
  standalone: true
})
export class LoginStatusComponent {

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  readonly adminEmail: string = 'dinu_petre26@yahoo.ro';
  profileJson: string | undefined;
  userEmail: string | undefined;
  storage: Storage = sessionStorage;
  localStorageForWelcome: Storage = localStorage;

  constructor(
    private auth: AuthService, 
    @Inject(DOCUMENT) private doc: Document,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(
      (authenticated: boolean) => {
        this.isAuthenticated = authenticated;
        console.log('User is authenticated: ', this.isAuthenticated);
      }
    );
    this.auth.user$.subscribe(
      (user) => {
        this.userEmail = user?.email;
         // now store the email in browser storage
         this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
        console.log('User ID: ', this.userEmail);
        
        // Send Welcome Email for first-time users
        if (user && user.email && user.name) {
          this.checkAndSendWelcomeEmail(user.email, user.name);
        }
      }
    );
    this.auth.user$.subscribe(
      (profile) => {
        // Verificăm dacă există profil și dacă emailul este cel corect
        if (profile && profile.email === this.adminEmail) {
          this.isAdmin = true;
          console.log("Admin logat: " + profile.email);
        } else {
          this.isAdmin = false;
        }
      }
    );
  }

  /**
   * Check if user is new and send welcome email
   */
  private checkAndSendWelcomeEmail(email: string, userName: string): void {
    const welcomeEmailSentKey = `welcomeEmailSent_${email}`;
    const hasReceivedWelcomeEmail = this.localStorageForWelcome.getItem(welcomeEmailSentKey);

    // If welcome email was never sent to this user
    if (!hasReceivedWelcomeEmail) {
      console.log(`Sending welcome email to new user: ${email}`);
      
      this.emailService.sendWelcomeEmail(email, userName).subscribe({
        next: (response) => {
          console.log('Welcome email sent successfully:', response);
          // Mark that welcome email was sent
          this.localStorageForWelcome.setItem(welcomeEmailSentKey, 'true');
        },
        error: (error) => {
          console.error('Failed to send welcome email:', error);
          // Don't mark as sent if it failed, so we can retry next time
        }
      });
    } else {
      console.log(`User ${email} already received welcome email`);
    }
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    // this.auth.logout({ returnTo: this.doc.location.origin });
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin
      }
    });
  }

}