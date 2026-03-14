import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CheckoutData, Address, PaymentMethod } from '../../models/order.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  cartItems: any[] = [];
  orderTotals: { subtotal: number; shipping: number; tax: number; total: number } = {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  };

  private cartSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private authService: AuthService
  ) {
    this.checkoutForm = this.fb.group({
      // Shipping Address
      shippingFirstName: ['', Validators.required],
      shippingLastName: ['', Validators.required],
      shippingCompany: [''],
      shippingStreet: ['', Validators.required],
      shippingApartment: [''],
      shippingCity: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingZipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      shippingCountry: ['Tunisia', Validators.required],
      shippingPhone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      
      // Billing Address
      sameAsShipping: [true],
      billingFirstName: [''],
      billingLastName: [''],
      billingCompany: [''],
      billingStreet: [''],
      billingApartment: [''],
      billingCity: [''],
      billingState: [''],
      billingZipCode: [''],
      billingCountry: ['Tunisia'],
      billingPhone: [''],
      
      // Payment Method
      paymentType: ['card', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      cardName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveCard: [false],
      
      // Order Notes
      orderNotes: ['']
    });

    // Watch sameAsShipping checkbox
    this.checkoutForm.get('sameAsShipping')?.valueChanges.subscribe(value => {
      this.updateBillingFields(value);
    });
  }

  ngOnInit() {
    // Check if user is authenticated
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      
      // Pre-fill user data if available
      if (user.firstName) {
        this.checkoutForm.patchValue({
          shippingFirstName: user.firstName,
          shippingLastName: user.lastName,
          billingFirstName: user.firstName,
          billingLastName: user.lastName
        });
      }
    });

    // Load cart items
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateOrderTotals();
    });

    // Redirect if cart is empty
    if (this.cartItems.length === 0) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private updateBillingFields(sameAsShipping: boolean): void {
    const billingFields = [
      'billingFirstName', 'billingLastName', 'billingCompany',
      'billingStreet', 'billingApartment', 'billingCity',
      'billingState', 'billingZipCode', 'billingCountry', 'billingPhone'
    ];

    if (sameAsShipping) {
      // Copy shipping to billing
      const shippingValues = {
        billingFirstName: this.checkoutForm.get('shippingFirstName')?.value,
        billingLastName: this.checkoutForm.get('shippingLastName')?.value,
        billingCompany: this.checkoutForm.get('shippingCompany')?.value,
        billingStreet: this.checkoutForm.get('shippingStreet')?.value,
        billingApartment: this.checkoutForm.get('shippingApartment')?.value,
        billingCity: this.checkoutForm.get('shippingCity')?.value,
        billingState: this.checkoutForm.get('shippingState')?.value,
        billingZipCode: this.checkoutForm.get('shippingZipCode')?.value,
        billingCountry: this.checkoutForm.get('shippingCountry')?.value,
        billingPhone: this.checkoutForm.get('shippingPhone')?.value
      };
      this.checkoutForm.patchValue(shippingValues);
      
      // Disable billing fields
      billingFields.forEach(field => {
        this.checkoutForm.get(field)?.disable();
      });
    } else {
      // Enable billing fields
      billingFields.forEach(field => {
        this.checkoutForm.get(field)?.enable();
      });
    }
  }

  private updateOrderTotals(): void {
    const orderItems = this.cartItems.map(item => ({
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    }));
    
    this.orderTotals = this.checkoutService.calculateOrderTotals(orderItems);
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    this.currentStep--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.validateCurrentStep()) {
      this.currentStep = step;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private validateCurrentStep(): boolean {
    this.errorMessage = '';
    
    switch (this.currentStep) {
      case 1:
        // Validate shipping address
        const shippingFields = [
          'shippingFirstName', 'shippingLastName', 'shippingStreet',
          'shippingCity', 'shippingState', 'shippingZipCode', 'shippingPhone'
        ];
        
        for (const field of shippingFields) {
          const control = this.checkoutForm.get(field);
          if (control?.invalid) {
            control.markAsTouched();
            this.errorMessage = 'Please fill in all required shipping information';
            return false;
          }
        }
        break;
        
      case 2:
        // Validate payment method
        if (this.checkoutForm.get('paymentType')?.value === 'card') {
          const cardFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
          for (const field of cardFields) {
            const control = this.checkoutForm.get(field);
            if (control?.invalid) {
              control.markAsTouched();
              this.errorMessage = 'Please fill in all payment information';
              return false;
            }
          }
        }
        break;
    }
    
    return true;
  }

  placeOrder(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const checkoutData: CheckoutData = {
      shippingAddress: {
        firstName: this.checkoutForm.get('shippingFirstName')?.value,
        lastName: this.checkoutForm.get('shippingLastName')?.value,
        company: this.checkoutForm.get('shippingCompany')?.value || undefined,
        street: this.checkoutForm.get('shippingStreet')?.value,
        apartment: this.checkoutForm.get('shippingApartment')?.value || undefined,
        city: this.checkoutForm.get('shippingCity')?.value,
        state: this.checkoutForm.get('shippingState')?.value,
        zipCode: this.checkoutForm.get('shippingZipCode')?.value,
        country: this.checkoutForm.get('shippingCountry')?.value,
        phone: this.checkoutForm.get('shippingPhone')?.value
      },
      billingAddress: {
        firstName: this.checkoutForm.get('billingFirstName')?.value,
        lastName: this.checkoutForm.get('billingLastName')?.value,
        company: this.checkoutForm.get('billingCompany')?.value || undefined,
        street: this.checkoutForm.get('billingStreet')?.value,
        apartment: this.checkoutForm.get('billingApartment')?.value || undefined,
        city: this.checkoutForm.get('billingCity')?.value,
        state: this.checkoutForm.get('billingState')?.value,
        zipCode: this.checkoutForm.get('billingZipCode')?.value,
        country: this.checkoutForm.get('billingCountry')?.value,
        phone: this.checkoutForm.get('billingPhone')?.value
      },
      paymentMethod: {
        type: this.checkoutForm.get('paymentType')?.value,
        cardNumber: this.checkoutForm.get('cardNumber')?.value,
        cardName: this.checkoutForm.get('cardName')?.value,
        expiryDate: this.checkoutForm.get('expiryDate')?.value,
        cvv: this.checkoutForm.get('cvv')?.value,
        saveCard: this.checkoutForm.get('saveCard')?.value
      },
      sameAsShipping: this.checkoutForm.get('sameAsShipping')?.value,
      notes: this.checkoutForm.get('orderNotes')?.value || undefined
    };

    // Validate complete checkout data
    const validation = this.checkoutService.validateCheckoutData(checkoutData);
    if (!validation.isValid) {
      this.errorMessage = validation.errors.join(', ');
      this.isLoading = false;
      return;
    }

    this.checkoutService.createOrder(checkoutData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.order) {
          this.router.navigate(['/order-confirmation'], { 
            queryParams: { orderId: response.order.id } 
          });
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while placing your order. Please try again.';
        console.error('Checkout error:', error);
      }
    });
  }

  // Getters for form controls
  get shippingFirstName() { return this.checkoutForm.get('shippingFirstName'); }
  get shippingLastName() { return this.checkoutForm.get('shippingLastName'); }
  get shippingStreet() { return this.checkoutForm.get('shippingStreet'); }
  get shippingCity() { return this.checkoutForm.get('shippingCity'); }
  get shippingState() { return this.checkoutForm.get('shippingState'); }
  get shippingZipCode() { return this.checkoutForm.get('shippingZipCode'); }
  get shippingPhone() { return this.checkoutForm.get('shippingPhone'); }
  
  get billingFirstName() { return this.checkoutForm.get('billingFirstName'); }
  get billingLastName() { return this.checkoutForm.get('billingLastName'); }
  get billingStreet() { return this.checkoutForm.get('billingStreet'); }
  get billingCity() { return this.checkoutForm.get('billingCity'); }
  get billingState() { return this.checkoutForm.get('billingState'); }
  get billingZipCode() { return this.checkoutForm.get('billingZipCode'); }
  
  get paymentType() { return this.checkoutForm.get('paymentType'); }
  get cardNumber() { return this.checkoutForm.get('cardNumber'); }
  get cardName() { return this.checkoutForm.get('cardName'); }
  get expiryDate() { return this.checkoutForm.get('expiryDate'); }
  get cvv() { return this.checkoutForm.get('cvv'); }
  get sameAsShipping() { return this.checkoutForm.get('sameAsShipping'); }
}
