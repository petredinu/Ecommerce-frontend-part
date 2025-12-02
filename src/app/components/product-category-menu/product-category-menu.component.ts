import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-product-category-menu',
  standalone: false,
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[]=[];
  isAdmin: boolean = false;
  readonly adminEmail: string = 'dinu_petre26@yahoo.ro';


  constructor(private productService: ProductService, private auth: AuthService){ }

  ngOnInit(){
     this.listProductCategories();
     this.checkAdminStatus();
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  checkAdminStatus() {
    this.auth.user$.subscribe(
      (profile) => {
        if (profile && profile.email === this.adminEmail) {
          this.isAdmin = true;
          console.log('Admin detected in sidebar: ' + profile.email);
        } else {
          this.isAdmin = false;
        }
      }
    );
  }
}
