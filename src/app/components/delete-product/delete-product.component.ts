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
  product: Product = {} as Product;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const productIdParam = this.route.snapshot.paramMap.get('id');
    const productId = productIdParam ? +productIdParam : 0;

    if (productId > 0) {
      // 1. Încărcăm produsul pentru a afișa numele și a confirma
      this.productService.getProduct(productId).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          alert(`Eroare la încărcarea produsului: ${err.message}`);
          this.router.navigate(['/products']);
        }
      });
    } else {
      alert('ID produs invalid!');
      this.router.navigate(['/products']);
    }
  }

  confirmDelete(): void {
    if (!this.product.id) {
      alert('Eroare: Produsul nu are un ID valid pentru ștergere.');
      this.router.navigate(['/products']);
      return;
    }
    
    this.productService.deleteProduct(this.product.id).subscribe({
      next: () => {
        alert(`Produsul "${this.product.name}" șters cu succes!`);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        alert(`Eroare la ștergere: ${err.message}`);
      }
    });
  }
  backToList(): void {
    this.router.navigate(['/products']);
  }
}