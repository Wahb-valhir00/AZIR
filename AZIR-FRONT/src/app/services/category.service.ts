import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string>('');

  categories$ = this.categoriesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private httpService: HttpService) {}

  loadCategories(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next('');

    this.httpService.get<Category[]>('/categories').pipe(
      map(categories => {
        this.categoriesSubject.next(categories);
        this.loadingSubject.next(false);
        return categories;
      }),
      catchError(error => {
        this.errorSubject.next('Failed to load categories');
        this.loadingSubject.next(false);
        throw error;
      })
    ).subscribe();
  }

  getCategories(): Observable<Category[]> {
    if (this.categoriesSubject.value.length === 0) {
      this.loadCategories();
    }
    return this.categories$;
  }

  getCategoryById(id: number): Observable<Category | undefined> {
    return this.categories$.pipe(
      map(categories => categories.find(cat => cat.id === id))
    );
  }

  createCategory(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category> {
    this.loadingSubject.next(true);
    
    return this.httpService.post<Category>('/categories', category).pipe(
      map(newCategory => {
        const currentCategories = this.categoriesSubject.value;
        this.categoriesSubject.next([...currentCategories, newCategory]);
        this.loadingSubject.next(false);
        return newCategory;
      }),
      catchError(error => {
        this.errorSubject.next('Failed to create category');
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    this.loadingSubject.next(true);
    
    return this.httpService.put<Category>(`/categories/${id}`, category).pipe(
      map(updatedCategory => {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map(cat => 
          cat.id === id ? { ...cat, ...updatedCategory } : cat
        );
        this.categoriesSubject.next(updatedCategories);
        this.loadingSubject.next(false);
        return updatedCategory;
      }),
      catchError(error => {
        this.errorSubject.next('Failed to update category');
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    this.loadingSubject.next(true);
    
    return this.httpService.delete<void>(`/categories/${id}`).pipe(
      map(() => {
        const currentCategories = this.categoriesSubject.value;
        const filteredCategories = currentCategories.filter(cat => cat.id !== id);
        this.categoriesSubject.next(filteredCategories);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.errorSubject.next('Failed to delete category');
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }
}
