import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CartModalComponent, SearchModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  categories = ['Skincare', 'Makeup', 'Fragrance'] as const;
  cartCount = 0;
  currentUser: any = null;
  isAuthenticated = false;
  
  private cartCountSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;
  @ViewChild(CartModalComponent) cartModal!: CartModalComponent;

  constructor(
    private router: Router,
    private cartService: CartService,
    private searchService: SearchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartCountSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/category', category.toLowerCase()]);
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  toggleCart() {
    if (this.cartModal) {
      this.cartModal.open();
    }
  }

  openSearch() {
    this.searchService.openSearch();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }
}
