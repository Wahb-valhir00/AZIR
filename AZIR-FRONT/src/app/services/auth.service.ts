import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, AuthState } from '../models/user.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  authState$: Observable<AuthState> = new Observable(observer => {
    observer.next({
      user: this.currentUserSubject.value,
      token: this.tokenSubject.value,
      isAuthenticated: !!this.currentUserSubject.value,
      isLoading: this.isLoadingSubject.value
    });
  });

  constructor(private httpService: HttpService) {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    const savedUser = localStorage.getItem('azir_user');
    const savedToken = localStorage.getItem('azir_token');
    
    if (savedUser && savedToken) {
      this.currentUserSubject.next(JSON.parse(savedUser));
      this.tokenSubject.next(savedToken);
    }
  }



  private saveAuthState(user: User, token: string): void {
    localStorage.setItem('azir_user', JSON.stringify(user));
    localStorage.setItem('azir_token', token);
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  private clearAuthState(): void {
    localStorage.removeItem('azir_user');
    localStorage.removeItem('azir_token');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  private generateToken(): string {
    return 'azir_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private createUserFromBackend(backendUser: any): User {
    return {
      id: backendUser.id.toString(),
      firstName: backendUser.name,
      lastName: backendUser.lastname,
      email: backendUser.email,
      phone: backendUser.phone,
      createdAt: new Date(backendUser.createdAt || Date.now()),
      lastLogin: new Date()
    };
  }

  signUp(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Observable<{ success: boolean; message: string; user?: User }> {
    this.isLoadingSubject.next(true);

    // Map frontend fields to backend fields
    const backendUserData = {
      name: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone
    };

    return this.httpService.post('/users', backendUserData).pipe(
      map((backendUser: any) => {
        const user = this.createUserFromBackend(backendUser);
        const token = this.generateToken();
        this.saveAuthState(user, token);
        this.isLoadingSubject.next(false);

        return {
          success: true,
          message: 'Account created successfully',
          user: user
        };
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false);
        return of({
          success: false,
          message: error.error?.message || 'Failed to create account'
        });
      })
    );
  }

  signIn(email: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    this.isLoadingSubject.next(true);

    // For now, we'll simulate login by getting all users and finding a match
    // In a real backend, you'd have a dedicated login endpoint
    return this.httpService.get<any[]>('/users').pipe(
      map((users) => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          this.isLoadingSubject.next(false);
          return {
            success: false,
            message: 'Invalid email or password'
          };
        }

        const frontendUser = this.createUserFromBackend(user);
        const token = this.generateToken();
        this.saveAuthState(frontendUser, token);
        this.isLoadingSubject.next(false);

        return {
          success: true,
          message: 'Login successful',
          user: frontendUser
        };
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false);
        return of({
          success: false,
          message: 'Login failed'
        });
      })
    );
  }

  signOut(): void {
    this.clearAuthState();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  updateUserProfile(userData: Partial<User>): Observable<{ success: boolean; message: string; user?: User }> {
    this.isLoadingSubject.next(true);

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      this.isLoadingSubject.next(false);
      return of({
        success: false,
        message: 'No user logged in'
      });
    }

    return this.httpService.put(`/users/${currentUser.id}`, userData).pipe(
      map((backendUser: any) => {
        const updatedUser = this.createUserFromBackend(backendUser);
        this.saveAuthState(updatedUser, this.getToken()!);
        this.isLoadingSubject.next(false);

        return {
          success: true,
          message: 'Profile updated successfully',
          user: updatedUser
        };
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false);
        return of({
          success: false,
          message: error.error?.message || 'Failed to update profile'
        });
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    this.isLoadingSubject.next(true);

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      this.isLoadingSubject.next(false);
      return of({
        success: false,
        message: 'No user logged in'
      });
    }

    // For now, we'll just update the password directly
    // In a real backend, you'd verify the current password first
    return this.httpService.put(`/users/${currentUser.id}`, { password: newPassword }).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
        return {
          success: true,
          message: 'Password changed successfully'
        };
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false);
        return of({
          success: false,
          message: error.error?.message || 'Failed to change password'
        });
      })
    );
  }
}
