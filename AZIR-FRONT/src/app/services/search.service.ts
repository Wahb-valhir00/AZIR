import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  private isSearchOpenSubject = new BehaviorSubject<boolean>(false);

  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();
  searchResults$: Observable<any[]> = this.searchResultsSubject.asObservable();
  isSearchOpen$: Observable<boolean> = this.isSearchOpenSubject.asObservable();

  constructor(private productService: ProductService) {}

  updateSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
    this.performSearch(query);
  }

  openSearch(): void {
    this.isSearchOpenSubject.next(true);
  }

  closeSearch(): void {
    this.isSearchOpenSubject.next(false);
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchQuerySubject.next('');
    this.searchResultsSubject.next([]);
  }

  private performSearch(query: string): void {
    if (!query.trim()) {
      this.searchResultsSubject.next([]);
      return;
    }

    const allProducts = this.productService.getAllProducts();
    const filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(query.toLowerCase())
      )
    );

    this.searchResultsSubject.next(filteredProducts);
  }

  getSearchQuery(): string {
    return this.searchQuerySubject.value;
  }

  getSearchResults(): any[] {
    return this.searchResultsSubject.value;
  }

  isSearchOpen(): boolean {
    return this.isSearchOpenSubject.value;
  }
}
