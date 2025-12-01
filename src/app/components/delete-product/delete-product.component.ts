import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-delete-product',
  standalone: false,
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.css'
})
export class DeleteProductComponent implements OnInit {
  product: Product | null = null;
  isLoading: boolean = true;
  isDeleting: boolean = false;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    const productIdParam = this.route.snapshot.paramMap.get('id');
    const productId = productIdParam ? +productIdParam : 0;

    if (productId <= 0) {
      this.errorMessage = 'ID produs invalid!';
      this.isLoading = false;
      setTimeout(() => this.router.navigate(['/products']), 2000);
      return;
    }

    this.productService.getProduct(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.getErrorMessage(err);
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/products']), 3000);
      }
    });
  }

  confirmDelete(): void {
    if (!this.product?.id) {
      this.errorMessage = 'Produsul nu are un ID valid pentru ștergere.';
      return;
    }

    const confirmation = confirm(
      `Ești absolut sigur că vrei să ștergi produsul "${this.product.name}"?\n\n` +
      `Această acțiune nu poate fi anulată!`
    );

    if (!confirmation) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';
    
    this.productService.deleteProduct(this.product.id).subscribe({
      next: () => {
        alert(`Produsul "${this.product!.name}" a fost șters cu succes!`);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = this.getErrorMessage(err);
        this.isDeleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.router.navigate(['/products']);
  }

  private getErrorMessage(err: any): string {
    if (err.status === 404) {
      return 'Produsul nu a fost găsit în baza de date.';
    } else if (err.status === 403) {
      return 'Nu aveți permisiunea să ștergeți acest produs.';
    } else if (err.status === 0) {
      return 'Nu se poate conecta la server. Verificați conexiunea la internet.';
    }
    return err.message || 'A apărut o eroare neașteptată.';
  }
}