import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  currentImageIndex: number = 0;
  Math = Math; // Expose Math for template
  quantity: number = 1;
  addedToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: string) {
    this.product = this.productService.getProductById(id);
    if (this.product) {
      // Get related products from same category
      const allCategoryProducts = this.productService.getProductsByCategory(this.product.category);
      this.relatedProducts = allCategoryProducts
        .filter(p => p.id !== this.product!.id)
        .slice(0, 4);
    }
    // Scroll to top when product loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
      this.addedToCart = true;
      setTimeout(() => {
        this.addedToCart = false;
      }, 2000);
    }
  }

  updateQuantity(action: 'increase' | 'decrease') {
    if (action === 'increase') {
      this.quantity++;
    } else if (action === 'decrease' && this.quantity > 1) {
      this.quantity--;
    }
  }
}
