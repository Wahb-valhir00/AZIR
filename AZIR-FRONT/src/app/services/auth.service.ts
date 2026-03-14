import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
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

  constructor() {
    this.loadAuthState();
    this.loadSampleUsers();
  }

  private loadAuthState(): void {
    const savedUser = localStorage.getItem('azir_user');
    const savedToken = localStorage.getItem('azir_token');
    
    if (savedUser && savedToken) {
      this.currentUserSubject.next(JSON.parse(savedUser));
      this.tokenSubject.next(savedToken);
    }
  }

  private loadSampleUsers(): void {
    // Load sample users from localStorage or create defaults
    const savedUsers = localStorage.getItem('azir_users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    } else {
      // Create sample users for demo
      this.users = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123', // In real app, this would be hashed
          phone: '+1234567890',
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date()
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: 'password123',
          phone: '+0987654321',
          createdAt: new Date('2024-02-20'),
          lastLogin: new Date()
        }
      ];
      this.saveUsers();
    }
  }

  private saveUsers(): void {
    localStorage.setItem('azir_users', JSON.stringify(this.users));
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

  signUp(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Observable<{ success: boolean; message: string; user?: User }> {
    this.isLoadingSubject.next(true);

    // Simulate API call
    return of({}).pipe(
      delay(1000),
      map(() => {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
          this.isLoadingSubject.next(false);
          return {
            success: false,
            message: 'An account with this email already exists'
          };
        }

        // Create new user
        const newUser: User = {
          id: (this.users.length + 1).toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password, // In real app, hash this
          phone: userData.phone,
          createdAt: new Date()
        };

        this.users.push(newUser);
        this.saveUsers();

        // Auto-login after signup
        const token = this.generateToken();
        this.saveAuthState(newUser, token);

        this.isLoadingSubject.next(false);

        return {
          success: true,
          message: 'Account created successfully',
          user: newUser
        };
      })
    );
  }

  signIn(email: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    this.isLoadingSubject.next(true);

    // Simulate API call
    return of({}).pipe(
      delay(1000),
      map(() => {
        // Find user
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          this.isLoadingSubject.next(false);
          return {
            success: false,
            message: 'Invalid email or password'
          };
        }

        // Update last login
        user.lastLogin = new Date();
        this.saveUsers();

        // Create token and save auth state
        const token = this.generateToken();
        this.saveAuthState(user, token);

        this.isLoadingSubject.next(false);

        return {
          success: true,
          message: 'Login successful',
          user: user
        };
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

    return of({}).pipe(
      delay(500),
      map(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          this.isLoadingSubject.next(false);
          return {
            success: false,
            message: 'No user logged in'
          };
        }

        // Update user data
        const updatedUser = { ...currentUser, ...userData };
        const userIndex = this.users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
          this.saveUsers();
          this.saveAuthState(updatedUser, this.getToken()!);
        }

        this.isLoadingSubject.next(false);

        return {
          success: true,
          message: 'Profile updated successfully',
          user: updatedUser
        };
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    this.isLoadingSubject.next(true);

    return of({}).pipe(
      delay(500),
      map(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser || !currentUser.password) {
          this.isLoadingSubject.next(false);
          return {
            success: false,
            message: 'No user logged in'
          };
        }

        // Verify current password
        if (currentUser.password !== currentPassword) {
          this.isLoadingSubject.next(false);
          return {
            success: false,
            message: 'Current password is incorrect'
          };
        }

        // Update password
        const userIndex = this.users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          this.users[userIndex].password = newPassword;
          this.saveUsers();
        }

        this.isLoadingSubject.next(false);

        return {
          success: true,
          message: 'Password changed successfully'
        };
      })
    );
  }
}
