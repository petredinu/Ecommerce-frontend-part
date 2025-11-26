import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

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
  

  constructor(private productService:ProductService,
              private cartService: CartService,
              private route:ActivatedRoute){}

  ngOnInit(): void {
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
    } else {
       this.thePageNumber = this.productService.thePageNumber;
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
  } else {
    this.thePageNumber = this.productService.thePageNumber; // Restaurăm pagina dacă e aceeași categorie
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
}
