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
  product: Product = this.createEmptyProduct();
  categories: ProductCategory[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  productId: number | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  private createEmptyProduct(): Product {
    return {
      id: 0,
      sku: '',
      name: '',
      description: '',
      unitPrice: 0,
      imageUrl: '',
      active: true,
      unitsInStock: 0,
      dateCreated: new Date(),
      lastUpdated: new Date(),
      category: {} as ProductCategory
    };
  }

  private loadCategories(): void {
    this.productService.getProductCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.errorMessage = 'Eroare la încărcarea categoriilor!';
        console.error('Eroare categorii:', err);
      }
    });
  }

  private checkEditMode(): void {
    const hasProductId = this.route.snapshot.paramMap.has('id');

    if (hasProductId) {
      this.isEditMode = true;
      this.productId = +this.route.snapshot.paramMap.get('id')!;
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(productId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

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

  onSubmit(): void {
    if (!this.validateProduct()) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const productToSave = this.prepareProductForSave();

    const saveObservable = this.isEditMode 
      ? this.productService.updateProduct(productToSave)
      : this.productService.saveProduct(productToSave);

    saveObservable.subscribe({
      next: () => {
        const message = this.isEditMode 
          ? `Produsul "${this.product.name}" a fost actualizat cu succes!`
          : `Produsul "${this.product.name}" a fost adăugat cu succes!`;
        alert(message);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = this.getErrorMessage(err);
        this.isSaving = false;
      }
    });
  }

  private validateProduct(): boolean {
    if (!this.product.name || this.product.name.trim() === '') {
      this.errorMessage = 'Numele produsului este obligatoriu!';
      return false;
    }

    if (!this.product.sku || this.product.sku.trim() === '') {
      this.errorMessage = 'SKU-ul produsului este obligatoriu!';
      return false;
    }

    if (!this.product.category || !this.product.category.id) {
      this.errorMessage = 'Te rog selectează o categorie!';
      return false;
    }

    if (this.product.unitPrice <= 0) {
      this.errorMessage = 'Prețul trebuie să fie mai mare decât 0!';
      return false;
    }

    if (this.product.unitsInStock < 0) {
      this.errorMessage = 'Stocul nu poate fi negativ!';
      return false;
    }

    return true;
  }

  private prepareProductForSave(): any {
    const productToSave: any = { ...this.product };
    
    // Construim link-ul pentru Spring Data REST
    productToSave.category = `${environment.luv2shopApiUrl}/product-category/${this.product.category.id}`;
    
    return productToSave;
  }

  cancelEdit(): void {
    if (confirm('Sigur vrei să anulezi? Modificările nesalvate vor fi pierdute.')) {
      this.router.navigate(['/products']);
    }
  }

  private getErrorMessage(err: any): string {
    if (err.status === 404) {
      return 'Produsul nu a fost găsit.';
    } else if (err.status === 400) {
      return 'Date invalide. Verificați toate câmpurile.';
    } else if (err.status === 403) {
      return 'Nu aveți permisiunea să efectuați această acțiune.';
    } else if (err.status === 409) {
      return 'Există deja un produs cu acest SKU.';
    } else if (err.status === 0) {
      return 'Nu se poate conecta la server. Verificați conexiunea.';
    }
    return err.message || 'A apărut o eroare neașteptată.';
  }
}
