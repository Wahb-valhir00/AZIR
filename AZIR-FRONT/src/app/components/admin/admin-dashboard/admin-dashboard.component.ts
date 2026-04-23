import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // TODO: Load actual stats from backend
    this.stats = {
      totalUsers: 2,
      totalProducts: 4,
      totalCategories: 4,
      totalOrders: 0
    };
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/admin/products']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/admin/categories']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/admin/orders']);
  }
}
