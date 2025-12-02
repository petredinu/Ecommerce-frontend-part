import { Component, OnInit } from '@angular/core';
import { PriceAlert } from '../../common/price-alert';
import { PriceAlertService } from '../../services/price-alert.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-price-alerts',
  standalone: false,
  templateUrl: './my-price-alerts.component.html',
  styleUrls: ['./my-price-alerts.component.css']
})
export class MyPriceAlertsComponent implements OnInit {

  priceAlerts: PriceAlert[] = [];
  isLoading: boolean = true;
  userEmail: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private priceAlertService: PriceAlertService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (!isAuth) {
        this.router.navigate(['/']);
      }
    });

    this.authService.user$.subscribe(user => {
      if (user?.email) {
        this.userEmail = user.email;
        this.loadPriceAlerts();
      }
    });
  }

  loadPriceAlerts(): void {
    this.isLoading = true;
    this.priceAlertService.getAlertsByUser(this.userEmail).subscribe({
      next: (data) => {
        this.priceAlerts = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Eroare la încărcarea alertelor:', error);
        this.isLoading = false;
      }
    });
  }

  deleteAlert(alertId: number): void {
    if (confirm('Sigur vrei să ștergi această alertă de preț?')) {
      this.priceAlertService.deleteAlert(alertId).subscribe({
        next: () => {
          alert('Alertă ștearsă cu succes!');
          this.loadPriceAlerts();
        },
        error: (error) => {
          console.error('Eroare la ștergerea alertei:', error);
          alert('Eroare la ștergerea alertei. Te rugăm să încerci din nou.');
        }
      });
    }
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  getStatusClass(alert: PriceAlert): string {
    if (!alert.isActive && alert.notifiedDate) {
      return 'status-notified';
    }
    return alert.isActive ? 'status-active' : 'status-inactive';
  }

  getStatusText(alert: PriceAlert): string {
    if (!alert.isActive && alert.notifiedDate) {
      return 'Notificat';
    }
    return alert.isActive ? 'Activă' : 'Inactivă';
  }
}
