import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  private loadAllProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Încărcare toate produsele...');
    
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Produse primite:', data);
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Eroare completă:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        this.errorMessage = this.getErrorMessage(err);
        this.isLoading = false;
      }
    });
  }

  activateProduct(product: Product): void {
    if (!confirm(`Sigur doriți să activați produsul "${product.name}"?`)) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.productService.activateProduct(product.id).subscribe({
      next: (updatedProduct) => {
        this.successMessage = `Produsul "${product.name}" a fost activat cu succes!`;
        // Reîncarcă lista de produse pentru a reflecta schimbarea
        this.loadAllProducts();
        // Șterge mesajul de succes după 3 secunde
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = this.getErrorMessage(err);
        console.error('Eroare la activarea produsului:', err);
      }
    });
  }

  editProduct(productId: number): void {
    this.router.navigate(['/admin/product-form', productId]);
  }

  deleteProduct(productId: number): void {
    this.router.navigate(['/admin/delete-product', productId]);
  }

  private getErrorMessage(err: any): string {
    if (err.status === 404) {
      return 'Produsul nu a fost găsit în baza de date.';
    } else if (err.status === 403) {
      return 'Nu aveți permisiunea necesară pentru această acțiune.';
    } else if (err.status === 0) {
      return 'Nu există conexiune cu serverul. Verificați conexiunea la internet.';
    } else if (err.status === 400) {
      return 'Datele trimise sunt invalide.';
    } else {
      return 'A apărut o eroare neprevăzută. Vă rugăm încercați din nou.';
    }
  }

  getActiveProductsCount(): number {
    return this.products.filter(p => p.active).length;
  }

  getInactiveProductsCount(): number {
    return this.products.filter(p => !p.active).length;
  }
}
