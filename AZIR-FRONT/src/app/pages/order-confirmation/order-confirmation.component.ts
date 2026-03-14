import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Order } from '../../models/order.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  isLoading = true;
  errorMessage = '';
  
  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      
      if (orderId) {
        const foundOrder = this.checkoutService.getOrderById(orderId);
        this.order = foundOrder || null;
        this.isLoading = false;
        
        if (!this.order) {
          this.errorMessage = 'Order not found';
        }
      } else {
        this.errorMessage = 'No order ID provided';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  viewOrderDetails(): void {
    if (this.order) {
      // Navigate to user profile with order details
      this.router.navigate(['/profile'], { 
        queryParams: { orderId: this.order.id } 
      });
    }
  }

  printOrder(): void {
    window.print();
  }

  getEstimatedDeliveryDays(): string {
    if (!this.order) return '';
    
    const created = new Date(this.order.createdAt);
    const estimated = new Date(this.order.estimatedDelivery || created);
    const days = Math.ceil((estimated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    return `${days} business days`;
  }

  getOrderStatusColor(): string {
    if (!this.order) return '';
    
    switch (this.order.status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }

  getOrderStatusText(): string {
    if (!this.order) return '';
    
    switch (this.order.status) {
      case 'pending':
        return 'Order Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}
