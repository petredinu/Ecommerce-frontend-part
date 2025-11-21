import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { ProductCategory } from '../../common/product-category';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {

  product: Product = {} as Product;
  categories: ProductCategory[] = [];
  isEditMode: boolean = false;

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Încărcăm categoriile pentru dropdown
    this.productService.getProductCategories().subscribe(
      data => this.categories = data
    );

    // Verificăm dacă edităm un produs existent (dacă avem ID în URL)
    const hasProductId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasProductId) {
      this.isEditMode = true;
      const productId = +this.route.snapshot.paramMap.get('id')!;
      this.productService.getProduct(productId).subscribe(
        data => this.product = data
      );
    }
  }

  onSubmit() {
    // Setăm categoria selectată (Spring Data REST așteaptă link-ul resursei pentru asocieri, 
    // dar pentru simplificare trimitem obiectul. Asigură-te că backend-ul îl parsează corect sau trimite URI-ul categoriei)
    
    if (this.isEditMode) {
      this.productService.updateProduct(this.product).subscribe(
        data => {
          alert('Produs actualizat cu succes!');
          this.router.navigate(['/products']);
        }
      );
    } else {
      this.productService.saveProduct(this.product).subscribe(
        data => {
          alert('Produs adăugat cu succes!');
          this.router.navigate(['/products']);
        }
      );
    }
  }

}
