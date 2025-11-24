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
  // --- METODĂ NOUĂ: Caută produsul când se schimbă SKU-ul ---
  onNameChange() {
    if (this.product.name) {
      this.productService.getProductByName(this.product.name).subscribe({
        next: (data) => {
          if (data) {
            this.product = data;
            this.isEditMode = true; // Trecem automat în mod editare dacă găsim produsul
            
            // Notă: Dacă Backend-ul nu trimite categoria populată complet, 
            // s-ar putea să fie nevoie să setezi manual categoria în dropdown
             alert(`Produsul "${data.name}" a fost găsit și încărcat!`);
          }
        },
        error: (err) => {
          // Dacă primim eroare (404), înseamnă că produsul nu există, deci e mod Adăugare
          // Nu resetăm tot formularul, lăsăm utilizatorul să creeze unul nou cu acest SKU
          this.isEditMode = false;
          this.product.id = undefined!; // Resetăm ID-ul ca să fie considerat nou
        }
      });
    }
  }

  // --- METODĂ NOUĂ: Ștergere produs ---
  onDelete() {
    if (confirm(`Ești sigur că vrei să ștergi produsul "${this.product.name}"?`)) {
      this.productService.deleteProduct(this.product.id!).subscribe({
        next: () => {
          alert('Produs șters cu succes!');
          this.router.navigate(['/products']);
        },
        error: err => alert(`Eroare la ștergere: ${err.message}`)
      });
    }
  }

  onSubmit() {
    // Copiem produsul
    const productToSave: any = { ...this.product };

    // Acum TypeScript recunoaște 'category', deci nu mai dă eroare
    if (this.product.category) {
        // Construim link-ul pentru Spring Data REST
        // Backend-ul așteaptă un URI, ex: ".../product-category/1"
        productToSave.category = `${environment.luv2shopApiUrl}/product-category/${this.product.category.id}`;
    } else {
        alert("Te rog selectează o categorie!");
        return;
    }

    // Logica de salvare/actualizare rămâne la fel...
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
