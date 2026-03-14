export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Only used during registration
  phone?: string;
  addresses?: Address[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
