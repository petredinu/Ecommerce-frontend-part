import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products:Product[] = [];
  currentCategoryId:number=1;
  previousCategoryId: number=1;
  searchMode: boolean=false;

  //NEW properties for pagination
  thePageNumber: number=1;
  thePageSize: number=5;
  theTotalElements: number=0;

  previousKeyword: string = "";
  isAdmin: boolean = false;
  readonly adminEmail: string = 'dinu_petre26@yahoo.ro';
  

  constructor(private productService:ProductService,
              private cartService: CartService,
              private route:ActivatedRoute,
              private auth: AuthService){}

  ngOnInit(): void {
    // Verificăm dacă utilizatorul este admin
    this.auth.user$.subscribe(
      (profile) => {
        if (profile && profile.email === this.adminEmail) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    );

    // Restaurăm pagina salvată doar la încărcarea inițială a componentei
    // Dacă categoria nu s-a schimbat, vom începe cu pagina salvată.
    // Dacă utilizatorul a navigat între timp, subscription-ul de mai jos va reseta oricum pagina dacă se schimbă ID-ul categoriei.
    if(this.route.snapshot.paramMap.has('id')) {
         const routeId = +this.route.snapshot.paramMap.get('id')!;
         if(routeId == this.productService.previousCategoryId) {
             this.thePageNumber = this.productService.thePageNumber;
         }
    }
    this.route.paramMap.subscribe(()=>{
    this.listProducts();
  });
}
  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
    this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

   // --- MODIFICARE: Verificăm dacă ne-am întors la aceeași căutare ---
    // Dacă cuvântul cheie e diferit, resetăm pagina la 1.
    // Dacă e același ca în serviciu, păstrăm pagina salvată.
    if (this.productService.previousKeyword != theKeyword) {
       this.thePageNumber = 1;
    } 

    this.productService.previousKeyword = theKeyword;
    // ------------------------------------------------------------------
    console.log(`keyword=${theKeyword}, thePageNumber= ${this.thePageNumber}`);

    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }

 handleListProducts(){
  const hasCategoryId:boolean=this.route.snapshot.paramMap.has('id');

  if(hasCategoryId){
    this.currentCategoryId=+this.route.snapshot.paramMap.get('id')!;
  }else{
    this.currentCategoryId=1;
  }

  // --- MODIFICARE: Logică de restaurare a paginii ---
  
  // Verificăm dacă categoria curentă este diferită de cea stocată în serviciu
  if (this.productService.previousCategoryId != this.currentCategoryId) {
    this.thePageNumber = 1; // Resetăm dacă am schimbat categoria
  } 

  this.productService.previousCategoryId = this.currentCategoryId;
  // -----------------------------------------------
  console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)


      this.productService.getProductListPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
                                              }

   updatePageSize(pageSize:string){
    this.thePageSize= +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
   }
   
   processResult(){
    return(data: any) =>{
      this.products = data._embedded.products;
      this.thePageNumber= data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;

      // --- MODIFICARE: Salvăm starea în serviciu pentru a o avea la revenire ---
      this.productService.thePageNumber = this.thePageNumber;
      this.productService.thePageSize = this.thePageSize;
      this.productService.theTotalElements = this.theTotalElements;
      // ------------------------------------------------------------------------
    };
   }
   addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
   }

   deleteProduct(product: Product): void {
    if (!product.id) {
      alert('Eroare: Produsul nu are un ID valid.');
      return;
    }

    const confirmation = confirm(
      `Ești absolut sigur că vrei să ștergi produsul "${product.name}"?\n\n` +
      `Această acțiune nu poate fi anulată!`
    );

    if (!confirmation) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        console.log('Backend a confirmat ștergerea cu succes');
        
        // Eliminăm produsul din array-ul local imediat
        const productIdToDelete = product.id;
        this.products = this.products.filter(p => p.id !== productIdToDelete);
        
        // Actualizăm totalul de elemente
        this.theTotalElements--;
        
        console.log(`Produs ${productIdToDelete} eliminat din array local`);
        console.log('Produse rămase:', this.products.length);
        
        alert(`Produsul "${product.name}" a fost șters cu succes!`);
        
        // NU mai reîncărcăm lista - lăsăm doar eliminarea locală
        // Utilizatorul poate da refresh manual dacă dorește
      },
      error: (err) => {
        console.error('Eroare la ștergere:', err);
        const errorMessage = this.getErrorMessage(err);
        alert(`Eroare la ștergere: ${errorMessage}`);
      }
    });
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
