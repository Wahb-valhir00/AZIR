import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Order, CheckoutData, OrderItem, Address, PaymentMethod } from '../models/order.model';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  orders$ = this.ordersSubject.asObservable();

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.loadOrders();
  }

  private loadOrders(): void {
    const savedOrders = localStorage.getItem('azir_orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      this.ordersSubject.next(this.orders);
    }
  }

  private saveOrders(): void {
    localStorage.setItem('azir_orders', JSON.stringify(this.orders));
    this.ordersSubject.next(this.orders);
  }

  private generateOrderId(): string {
    return 'AZIR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  private calculateShippingCost(subtotal: number): number {
    // Free shipping for orders over $100
    return subtotal >= 100 ? 0 : 10;
  }

  private calculateTax(subtotal: number): number {
    // 8% tax rate
    return subtotal * 0.08;
  }

  createOrder(checkoutData: CheckoutData): Observable<{ success: boolean; message: string; order?: Order }> {
    const cartItems = this.cartService.getCartItems();
    
    if (cartItems.length === 0) {
      return of({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // Simulate API call
    return of({}).pipe(
      delay(2000),
      map(() => {
        try {
          // Calculate totals
          const subtotal = this.cartService.getTotalPrice();
          const shippingCost = this.calculateShippingCost(subtotal);
          const tax = this.calculateTax(subtotal);
          const total = subtotal + shippingCost + tax;

          // Create order items
          const orderItems: OrderItem[] = cartItems.map(item => ({
            productId: item.productId,
            product: item.product,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity
          }));

          // Create order
          const order: Order = {
            id: this.generateOrderId(),
            userId: this.authService.getCurrentUser()?.id,
            items: orderItems,
            shippingAddress: checkoutData.shippingAddress,
            billingAddress: checkoutData.sameAsShipping ? checkoutData.shippingAddress : checkoutData.billingAddress,
            paymentMethod: checkoutData.paymentMethod,
            subtotal,
            shippingCost,
            tax,
            total,
            status: 'pending',
            createdAt: new Date(),
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 10).toUpperCase()
          };

          // Save order
          this.orders.push(order);
          this.saveOrders();

          // Clear cart
          this.cartService.clearCart();

          return {
            success: true,
            message: 'Order placed successfully!',
            order: order
          };

        } catch (error) {
          console.error('Order creation error:', error);
          return {
            success: false,
            message: 'Failed to create order. Please try again.'
          };
        }
      })
    );
  }

  getUserOrders(): Order[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];
    
    return this.orders.filter(order => order.userId === currentUser.id);
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<{ success: boolean; message: string }> {
    return of({}).pipe(
      delay(500),
      map(() => {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex === -1) {
          return {
            success: false,
            message: 'Order not found'
          };
        }

        this.orders[orderIndex].status = status;
        this.saveOrders();

        return {
          success: true,
          message: 'Order status updated successfully'
        };
      })
    );
  }

  calculateOrderTotals(cartItems: OrderItem[]): { subtotal: number; shipping: number; tax: number; total: number } {
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const shipping = this.calculateShippingCost(subtotal);
    const tax = this.calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  }

  validateCheckoutData(checkoutData: CheckoutData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate shipping address
    if (!checkoutData.shippingAddress.firstName.trim()) {
      errors.push('Shipping first name is required');
    }
    if (!checkoutData.shippingAddress.lastName.trim()) {
      errors.push('Shipping last name is required');
    }
    if (!checkoutData.shippingAddress.street.trim()) {
      errors.push('Shipping street address is required');
    }
    if (!checkoutData.shippingAddress.city.trim()) {
      errors.push('Shipping city is required');
    }
    if (!checkoutData.shippingAddress.state.trim()) {
      errors.push('Shipping state is required');
    }
    if (!checkoutData.shippingAddress.zipCode.trim()) {
      errors.push('Shipping zip code is required');
    }
    if (!checkoutData.shippingAddress.phone.trim()) {
      errors.push('Shipping phone number is required');
    }

    // Validate billing address if different from shipping
    if (!checkoutData.sameAsShipping) {
      if (!checkoutData.billingAddress.firstName.trim()) {
        errors.push('Billing first name is required');
      }
      if (!checkoutData.billingAddress.lastName.trim()) {
        errors.push('Billing last name is required');
      }
      if (!checkoutData.billingAddress.street.trim()) {
        errors.push('Billing street address is required');
      }
      if (!checkoutData.billingAddress.city.trim()) {
        errors.push('Billing city is required');
      }
      if (!checkoutData.billingAddress.state.trim()) {
        errors.push('Billing state is required');
      }
      if (!checkoutData.billingAddress.zipCode.trim()) {
        errors.push('Billing zip code is required');
      }
    }

    // Validate payment method
    if (checkoutData.paymentMethod.type === 'card') {
      if (!checkoutData.paymentMethod.cardNumber?.trim()) {
        errors.push('Card number is required');
      }
      if (!checkoutData.paymentMethod.cardName?.trim()) {
        errors.push('Cardholder name is required');
      }
      if (!checkoutData.paymentMethod.expiryDate?.trim()) {
        errors.push('Expiry date is required');
      }
      if (!checkoutData.paymentMethod.cvv?.trim()) {
        errors.push('CVV is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
