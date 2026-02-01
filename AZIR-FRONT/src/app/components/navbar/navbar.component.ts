import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  categories = ['Skincare', 'Makeup', 'Fragrance'] as const;

  constructor(private router: Router) {}

  navigateToCategory(category: string) {
    this.router.navigate(['/category', category.toLowerCase()]);
  }

  navigateHome() {
    this.router.navigate(['/']);
  }
}
