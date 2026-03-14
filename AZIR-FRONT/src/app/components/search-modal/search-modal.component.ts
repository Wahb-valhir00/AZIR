import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.css'
})
export class SearchModalComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: any[] = [];
  isOpen: boolean = false;
  
  private searchQuerySubscription: Subscription | null = null;
  private searchResultsSubscription: Subscription | null = null;
  private isSearchOpenSubscription: Subscription | null = null;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
    });

    this.searchResultsSubscription = this.searchService.searchResults$.subscribe(results => {
      this.searchResults = results;
    });

    this.isSearchOpenSubscription = this.searchService.isSearchOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        setTimeout(() => {
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }, 100);
      }
    });
  }

  ngOnDestroy() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
    if (this.searchResultsSubscription) {
      this.searchResultsSubscription.unsubscribe();
    }
    if (this.isSearchOpenSubscription) {
      this.isSearchOpenSubscription.unsubscribe();
    }
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchService.updateSearchQuery(target.value);
  }

  closeSearch(): void {
    this.searchService.closeSearch();
  }

  navigateToProduct(productId: string): void {
    this.closeSearch();
    this.router.navigate(['/product', productId]);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeSearch();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeSearch();
    }
  }
}
