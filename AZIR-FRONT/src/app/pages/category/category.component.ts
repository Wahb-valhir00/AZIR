import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  category: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortBy: string = 'default';
  
  // Filter properties
  priceRange: number = 200;
  minRating: number = 0;
  showFilters: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.loadProducts();
      // Scroll to top on category change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  loadProducts() {
    const categoryMap: { [key: string]: 'Skincare' | 'Makeup' | 'Fragrance' } = {
      'skincare': 'Skincare',
      'makeup': 'Makeup',
      'fragrance': 'Fragrance'
    };
    
    const categoryType = categoryMap[this.category.toLowerCase()];
    if (categoryType) {
      this.products = this.productService.getProductsByCategory(categoryType);
      this.filteredProducts = [...this.products];
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Price filter
      if (product.price > this.priceRange) {
        return false;
      }
      
      // Rating filter
      if (product.rating < this.minRating) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting after filtering
    this.sortProducts(this.sortBy);
  }

  resetFilters() {
    this.priceRange = 200;
    this.minRating = 0;
    this.sortBy = 'default';
    this.filteredProducts = [...this.products];
  }

  sortProducts(sortType: string) {
    this.sortBy = sortType;
    this.applyFilters(); // Re-apply filters and then sort
    
    switch (sortType) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
