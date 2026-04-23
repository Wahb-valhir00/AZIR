import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../services/http.service';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  createdAt: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string = '';
  selectedUser: User | null = null;
  isEditing = false;
  isCreating = false;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.httpService.get<User[]>('/users').subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.isCreating = false;
  }

  createNewUser(): void {
    this.selectedUser = {
      id: 0,
      name: '',
      lastname: '',
      email: '',
      phone: '',
      createdAt: new Date().toISOString()
    };
    this.isCreating = true;
    this.isEditing = false;
  }

  saveUser(): void {
    if (!this.selectedUser) return;

    this.loading = true;
    const userData = {
      name: this.selectedUser.name,
      lastname: this.selectedUser.lastname,
      email: this.selectedUser.email,
      phone: this.selectedUser.phone,
      password: 'password123' // Default password for new users
    };

    if (this.isCreating) {
      this.httpService.post('/users', userData).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEdit();
        },
        error: (err) => {
          this.error = 'Failed to create user';
          this.loading = false;
          console.error('Error creating user:', err);
        }
      });
    } else {
      this.httpService.put(`/users/${this.selectedUser.id}`, userData).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEdit();
        },
        error: (err) => {
          this.error = 'Failed to update user';
          this.loading = false;
          console.error('Error updating user:', err);
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.name} ${user.lastname}?`)) {
      this.loading = true;
      this.httpService.delete(`/users/${user.id}`).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Failed to delete user';
          this.loading = false;
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.isEditing = false;
    this.isCreating = false;
    this.error = '';
  }

  updateUserName(value: string): void {
    if (this.selectedUser) {
      this.selectedUser.name = value;
    }
  }

  updateUserLastname(value: string): void {
    if (this.selectedUser) {
      this.selectedUser.lastname = value;
    }
  }

  updateUserEmail(value: string): void {
    if (this.selectedUser) {
      this.selectedUser.email = value;
    }
  }

  updateUserPhone(value: string): void {
    if (this.selectedUser) {
      this.selectedUser.phone = value;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
