import { Component } from '@angular/core';

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

  // Funcție pentru a deschide/închide meniul
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Funcție pentru a închide meniul când se dă click pe un link (opțional)
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
