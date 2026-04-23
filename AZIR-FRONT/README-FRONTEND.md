# AZIR Frontend

## Overview
The AZIR Frontend is a modern Angular application that provides the user interface for the AZIR e-commerce platform. It features a responsive design, dynamic content loading, and comprehensive admin functionality.

## Features
- **User Authentication**: Login, registration, and profile management
- **Dynamic Navigation**: Real-time category loading from backend
- **Product Catalog**: Browse products by category with search functionality
- **Shopping Cart**: Add to cart with quantity management
- **Admin Dashboard**: Complete backend administration interface
- **Responsive Design**: Mobile-friendly interface
- **Real-time Data**: Dynamic content fetching and updates

## Technology Stack
- **Angular 21** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Tailwind CSS** - Utility-first CSS framework
- **Angular CLI** - Development tooling

## Project Structure
```
AZIR-FRONT/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   │   ├── navbar/         # Navigation component
│   │   │   ├── cart-modal/     # Shopping cart modal
│   │   │   ├── search-modal/   # Search functionality
│   │   │   └── admin/          # Admin dashboard components
│   │   │       ├── admin-dashboard/
│   │   │       ├── user-management/
│   │   │       └── product-management/
│   │   ├── pages/               # Page components
│   │   │   ├── home/           # Home page
│   │   │   ├── login/          # Login page
│   │   │   ├── signup/         # Registration page
│   │   │   ├── category/       # Category listing
│   │   │   ├── product/        # Product details
│   │   │   └── checkout/       # Checkout process
│   │   ├── services/            # Business logic services
│   │   │   ├── auth.service.ts # Authentication service
│   │   │   ├── http.service.ts # HTTP client service
│   │   │   ├── category.service.ts # Category management
│   │   │   ├── cart.service.ts # Shopping cart service
│   │   │   └── search.service.ts # Search functionality
│   │   ├── models/              # Data models
│   │   │   └── user.model.ts   # User interface
│   │   ├── app.routes.ts        # Application routing
│   │   ├── app.config.ts        # Application configuration
│   │   └── app.component.ts     # Root component
│   ├── assets/                  # Static assets
│   └── styles/                  # Global styles
├── package.json                # Dependencies and scripts
├── angular.json               # Angular configuration
└── README-FRONTEND.md         # This file
```

## Installation

### Prerequisites
- Node.js 18+
- npm 9+
- Angular CLI 21+

### Setup Steps

1. **Navigate to frontend directory**
```bash
cd AZIR-FRONT
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Access the application**
```
http://localhost:4200
```

## Core Components

### Services

#### AuthService
Handles user authentication and authorization:
- User login and registration
- Token management
- Profile updates
- Password management

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signIn(email: string, password: string): Observable<{success: boolean; message: string; user?: User}>
  signUp(userData: UserSignupData): Observable<{success: boolean; message: string; user?: User}>
  signOut(): void
  updateUserProfile(userData: Partial<User>): Observable<{success: boolean; message: string; user?: User}>
}
```

#### HttpService
Centralized HTTP client for API communication:
- Request/response interceptors
- Authentication headers
- Error handling
- Base URL configuration

```typescript
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  get<T>(endpoint: string): Observable<T>
  post<T>(endpoint: string, data: any): Observable<T>
  put<T>(endpoint: string, data: any): Observable<T>
  delete<T>(endpoint: string): Observable<T>
}
```

#### CategoryService
Manages category data and navigation:
- Fetch categories from backend
- Loading states and error handling
- Category CRUD operations

```typescript
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  loadCategories(): void
  getCategories(): Observable<Category[]>
  createCategory(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category>
  updateCategory(id: number, category: Partial<Category>): Observable<Category>
  deleteCategory(id: number): Observable<void>
}
```

#### CartService
Shopping cart functionality:
- Add/remove items
- Quantity management
- Cart persistence
- Total calculation

### Components

#### NavbarComponent
Main navigation with dynamic categories:
- Real-time category loading
- User authentication state
- Shopping cart integration
- Search functionality

```typescript
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CartModalComponent, SearchModalComponent]
})
export class NavbarComponent implements OnInit, OnDestroy {
  categories: Category[] = []
  currentUser: User | null = null
  isAuthenticated = boolean
  cartCount = number
}
```

#### Admin Components

**AdminDashboardComponent**
- Statistics overview
- Quick action buttons
- Recent activity feed

**UserManagementComponent**
- User listing and CRUD operations
- Form validation
- Error handling

**ProductManagementComponent**
- Product listing and CRUD operations
- Category selection
- Image URL support

### Pages

#### Authentication Pages
- **Login**: User authentication form
- **Signup**: User registration form
- **Profile**: User profile management

#### Product Pages
- **Home**: Featured products and categories
- **Category**: Product listings by category
- **Product**: Individual product details
- **Checkout**: Purchase process

## Routing Configuration

```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:category', component: CategoryComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/users', component: UserManagementComponent },
  { path: 'admin/products', component: ProductManagementComponent },
  { path: '**', redirectTo: '' }
];
```

## Data Models

### User Model
```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses?: Address[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Category Model
```typescript
export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}
```

### Product Model
```typescript
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id?: number;
  stock_quantity: number;
  image_url?: string;
  createdAt: string;
}
```

## Development

### Scripts
```json
{
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "lint": "ng lint"
}
```

### Development Commands
```bash
# Start development server
npm start

# Build for production
ng build

# Run tests
ng test

# Run linting
ng lint

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name
```

## Styling

### Tailwind CSS Configuration
The application uses Tailwind CSS for styling:
- Utility-first approach
- Responsive design
- Custom components
- Dark mode support (future)

### Component Styling
Each component has its own CSS file:
- Scoped styles
- Responsive breakpoints
- Hover and focus states
- Animation effects

## State Management

### Reactive Programming
The application uses RxJS for state management:
- Observables for data streams
- Subjects for component communication
- Operators for data transformation

### Authentication State
```typescript
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
}
```

## Error Handling

### HTTP Error Handling
```typescript
private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  return throwError(() => new Error('Something went wrong; please try again later.'));
}
```

### Form Validation
- Template-driven validation
- Reactive forms validation
- Custom validators
- Error messages display

## Performance Optimization

### Lazy Loading
Routes are configured for lazy loading:
```typescript
{
  path: 'admin',
  loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
}
```

### Change Detection
- OnPush change detection strategy
- Immutable data structures
- Optimistic updates

## Testing

### Unit Tests
```bash
# Run all tests
ng test

# Run tests with coverage
ng test --coverage

# Run specific test file
ng test --include="**/auth.service.spec.ts"
```

### Component Testing
```typescript
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### E2E Testing
```bash
# Run end-to-end tests
ng e2e
```

## Build and Deployment

### Production Build
```bash
# Build for production
ng build --configuration production

# Output directory: dist/azir-front/
```

### Deployment Options

#### Static Hosting
```bash
# Deploy to Netlify, Vercel, or GitHub Pages
ng build --configuration production
# Upload dist/ folder to hosting provider
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/azir-front /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Accessibility

### ARIA Support
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility

### Performance
- Lazy loading images
- Code splitting
- Tree shaking
- Minification

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

### Code Style
- Use TypeScript strict mode
- Follow Angular style guide
- Use ESLint and Prettier
- Write meaningful comments

### Git Workflow
1. Create feature branch
2. Make changes with tests
3. Run linting and tests
4. Create pull request
5. Code review and merge

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache
ng cache clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Development Server Issues
```bash
# Check port usage
netstat -an | findstr :4200

# Use different port
ng serve --port 4300
```

#### CORS Issues
Ensure backend CORS is configured:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  next();
});
```

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please create an issue on GitHub.
