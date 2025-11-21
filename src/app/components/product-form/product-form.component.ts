import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { ProductCategory } from '../../common/product-category';
import { environment } from '../../../environments/environment';

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
    // Spring Data REST așteaptă link-ul categoriei, ex: "https://.../product-category/1"
    // Trebuie să construim acest obiect manual sau să ne asigurăm că trimitem ce trebuie.
    
    // Clonăm produsul ca să nu modificăm direct obiectul din formular în timp ce prelucrăm datele
    const productToSave: any = { ...this.product };

    // Dacă avem o categorie selectată, Spring vrea URI-ul ei
    const selectedCategory = (this.product as any).category;
    if (selectedCategory) {
       // Presupunem că ai id-ul categoriei. Construim link-ul specific pentru Spring Data REST
       // Ajustează URL-ul dacă structura API-ului tău e diferită
       productToSave.category = `${environment.luv2shopApiUrl}/product-category/${selectedCategory.id}`;
    }

    if (this.isEditMode) {
      this.productService.updateProduct(productToSave).subscribe({
        next: response => {
          alert('Produs actualizat cu succes!');
          this.router.navigate(['/products']);
        },
        error: err => alert(`Eroare la actualizare: ${err.message}`)
      });
    } else {
      this.productService.saveProduct(productToSave).subscribe({
        next: response => {
          alert('Produs adăugat cu succes!');
          this.router.navigate(['/products']);
        },
        error: err => alert(`Eroare la salvare: ${err.message}`)
      });
    }
  }

}
