import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartItems$: Observable<CartItem[]> = this.cartSubject.asObservable();
  cartCount$: Observable<number> = this.cartCountSubject.asObservable();

  constructor(private productService: ProductService) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('azir-cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCart();
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('azir-cart', JSON.stringify(this.cartItems));
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.cartCountSubject.next(this.getTotalItemCount());
    this.saveCartToStorage();
  }

  addToCart(productId: string, quantity: number = 1): void {
    const product = this.productService.getProductById(productId);
    if (!product) return;

    const existingItem = this.cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        product,
        quantity,
        addedAt: new Date()
      });
    }
    
    this.updateCart();
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getTotalItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  isInCart(productId: string): boolean {
    return this.cartItems.some(item => item.productId === productId);
  }

  getQuantity(productId: string): number {
    const item = this.cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }
}
