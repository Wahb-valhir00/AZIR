export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Skincare' | 'Makeup' | 'Fragrance';
  price: number;
  description: string;
  longDescription: string;
  ingredients: string[];
  usage: string;
  image: string;
  rating: number;
  reviews: Review[];
}
