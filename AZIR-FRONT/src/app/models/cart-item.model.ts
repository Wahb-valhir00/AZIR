export interface CartItem {
  productId: string;
  product: any; // Using any for now, can be typed as Product later
  quantity: number;
  addedAt: Date;
}
