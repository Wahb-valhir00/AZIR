import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../services/http.service';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id?: number;
  stock_quantity: number;
  image_url?: string;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  error: string = '';
  selectedProduct: Product | null = null;
  isEditing = false;
  isCreating = false;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.httpService.get<Product[]>('/products').subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  loadCategories(): void {
    this.httpService.get<Category[]>('/categories').subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.isEditing = true;
    this.isCreating = false;
  }

  createNewProduct(): void {
    this.selectedProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      category_id: 0,
      stock_quantity: 0,
      image_url: '',
      createdAt: new Date().toISOString()
    };
    this.isCreating = true;
    this.isEditing = false;
  }

  saveProduct(): void {
    if (!this.selectedProduct) return;

    this.loading = true;
    const productData = {
      name: this.selectedProduct.name,
      description: this.selectedProduct.description,
      price: this.selectedProduct.price,
      category_id: this.selectedProduct.category_id,
      stock_quantity: this.selectedProduct.stock_quantity,
      image_url: this.selectedProduct.image_url
    };

    if (this.isCreating) {
      this.httpService.post('/products', productData).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        },
        error: (err) => {
          this.error = 'Failed to create product';
          this.loading = false;
          console.error('Error creating product:', err);
        }
      });
    } else {
      this.httpService.put(`/products/${this.selectedProduct.id}`, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        },
        error: (err) => {
          this.error = 'Failed to update product';
          this.loading = false;
          console.error('Error updating product:', err);
        }
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      this.loading = true;
      this.httpService.delete(`/products/${product.id}`).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          this.error = 'Failed to delete product';
          this.loading = false;
          console.error('Error deleting product:', err);
        }
      });
    }
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.isEditing = false;
    this.isCreating = false;
    this.error = '';
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'No Category';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  updateProductName(value: string): void {
    if (this.selectedProduct) {
      this.selectedProduct.name = value;
    }
  }

  updateProductPrice(value: string): void {
    if (this.selectedProduct) {
      this.selectedProduct.price = parseFloat(value) || 0;
    }
  }

  updateProductCategory(value: string): void {
    if (this.selectedProduct) {
      this.selectedProduct.category_id = parseInt(value) || 0;
    }
  }

  updateProductStock(value: string): void {
    if (this.selectedProduct) {
      this.selectedProduct.stock_quantity = parseInt(value) || 0;
    }
  }

  updateProductDescription(value: string): void {
    if (this.selectedProduct) {
      this.selectedProduct.description = value;
    }
  }

  updateProductImageUrl(value: string): void {
    if (this.selectedProduct) {
      this.selectedProduct.image_url = value;
    }
  }
}
