import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Luminous Silk Serum',
      category: 'Skincare',
      price: 85,
      description: 'A revolutionary hydrating serum that leaves your skin with a glass-like finish.',
      longDescription: 'The Luminous Silk Serum is AZIR\'s flagship hydration miracle. Engineered with triple-weight hyaluronic acid and gold-leaf micro-particles, it penetrates deep into the epidermis to provide 72-hour moisture while reflecting light for an immediate ethereal glow.',
      ingredients: ['Hyaluronic Acid', '24K Gold Micro-flakes', 'Rosehip Oil', 'Niacinamide'],
      usage: 'Apply 2-3 drops to clean, damp skin. Gently press into the face and neck until absorbed. Follow with moisturizer.',
      image: 'product1.webp',
      rating: 4.9,
      reviews: [
        { user: 'Isabella R.', rating: 5, comment: 'Literally changed my skin texture overnight.', date: '2024-05-12' }
      ]
    },
    {
      id: '2',
      name: 'Velvet Matte Lipstick',
      category: 'Makeup',
      price: 38,
      description: 'Highly pigmented, non-drying matte lipstick available in 12 signature shades.',
      longDescription: 'Our signature lipstick collection redefined. Using a unique "air-matte" technology, this formula provides full-coverage pigment that feels weightless on the lips. Infused with shea butter to prevent dryness.',
      ingredients: ['Shea Butter', 'Vitamin E', 'Micro-pigments', 'Beeswax'],
      usage: 'Define lips with the edge of the bullet, then fill in for high-impact color.',
      image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      reviews: []
    },
    {
      id: '3',
      name: 'Midnight Bloom Parfum',
      category: 'Fragrance',
      price: 120,
      description: 'An enchanting blend of night-blooming jasmine and warm amber notes.',
      longDescription: 'Midnight Bloom is a sophisticated olfactory journey. It opens with top notes of Bergamot, transitions into a heart of rare Jasmine Grandiflorum, and settles into a base of Madagascar Vanilla and White Musk.',
      ingredients: ['Ethyl Alcohol', 'Parfum', 'Linalool', 'Citral'],
      usage: 'Spray on pulse points: wrists, neck, and behind ears. Do not rub, as this breaks down the scent molecules.',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
      rating: 5.0,
      reviews: []
    },
    {
      id: '4',
      name: 'Radiance Eye Cream',
      category: 'Skincare',
      price: 64,
      description: 'Banish dark circles and puffiness with our caffeine-infused formula.',
      longDescription: 'A cooling, revitalizing eye treatment that targets the primary signs of fatigue. Formulated with green tea extract and light-diffusing minerals to instantly brighten the orbital area.',
      ingredients: ['Caffeine', 'Green Tea Extract', 'Peptides', 'Squalane'],
      usage: 'Using your ring finger, gently pat a small amount around the eye contour area morning and night.',
      image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?auto=format&fit=crop&q=80&w=800',
      rating: 4.7,
      reviews: []
    },
    {
      id: '5',
      name: 'Ethereal Glow Foundation',
      category: 'Makeup',
      price: 52,
      description: 'Breathable, buildable coverage with an ethereal, dewy glow.',
      longDescription: 'Foundation that mimics the look of perfect skin. Our "Radiance Mesh" technology allows skin to breathe while concealing imperfections. 15% serum-infused for skincare benefits while you wear it.',
      ingredients: ['Titanium Dioxide', 'Glycerin', 'Aloe Vera', 'Silica'],
      usage: 'Shake well. Apply to the center of the face and blend outwards using a sponge or foundation brush.',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
      rating: 4.6,
      reviews: []
    },
    {
      id: '6',
      name: 'Noir Volume Mascara',
      category: 'Makeup',
      price: 32,
      description: 'Ultra-black mascara for dramatic volume and curl without clumping.',
      longDescription: 'Engineered for the boldest look. This carbon-black formula thickens lashes from root to tip while our hourglass brush captures even the smallest lashes for a fanned-out effect.',
      ingredients: ['Panthenol', 'Carnauba Wax', 'Carbon Black', 'Acacia Gum'],
      usage: 'Wiggle the brush from lash root to tip. Apply multiple coats for intensified volume.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviews: []
    },
    {
      id: '7',
      name: 'Azure Sea Body Oil',
      category: 'Skincare',
      price: 72,
      description: 'Deeply nourishing body oil with marine extracts and sandalwood.',
      longDescription: 'A silky dry oil that absorbs instantly, leaving a satin sheen. Inspired by the French Riviera, it features kelp extracts and sea buckthorn to firm and smooth the skin.',
      ingredients: ['Kelp Extract', 'Sea Buckthorn Oil', 'Sandalwood', 'Argan Oil'],
      usage: 'Massage into slightly damp skin after bathing for maximum absorption.',
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      reviews: []
    },
    {
      id: '8',
      name: 'Desert Sun Bronzer',
      category: 'Makeup',
      price: 45,
      description: 'Finely milled powder bronzer for a natural, sun-kissed warmth.',
      longDescription: 'The secret to a perpetual summer. This matte bronzer features ultra-fine pigments that blend seamlessly into any skin tone without looking orange or muddy.',
      ingredients: ['Talc', 'Mica', 'Cocoa Seed Butter', 'Iron Oxides'],
      usage: 'Sweep across the forehead, cheekbones, and jawline where the sun would naturally hit.',
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=800',
      rating: 4.7,
      reviews: []
    },
    {
      id: '9',
      name: 'Celestial Night Mask',
      category: 'Skincare',
      price: 92,
      description: 'Overnight recovery mask that repairs and rejuvenates while you sleep.',
      longDescription: 'Harness the power of the night. This decadent mask works with your body\'s natural circadian rhythm to repair DNA damage and intensely hydrate. Wake up to skin that looks rested, plump, and luminous.',
      ingredients: ['Retinol', 'Bakuchiol', 'Ceramides', 'Lavender Water'],
      usage: 'Apply a generous layer as the final step of your nighttime routine. Leave on overnight and rinse in the morning.',
      image: 'https://images.unsplash.com/photo-1590156221122-c29dd97a357f?auto=format&fit=crop&q=80&w=800',
      rating: 5.0,
      reviews: []
    },
    {
      id: '10',
      name: 'Satin Finish Blush',
      category: 'Makeup',
      price: 42,
      description: 'A buildable, soft-focus blush for a natural flush of color.',
      longDescription: 'The Silk Satin Blush provides a weightless flush that glows from within. Our micronized powder formula blurs pores and imperfections while delivering long-lasting, vibrant pigment.',
      ingredients: ['Rice Silk', 'Squalane', 'Wild Rose Extract', 'Zinc Stearate'],
      usage: 'Swirl a fluffy brush into the pan and sweep over the apples of your cheeks, blending upwards.',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      reviews: []
    },
    {
      id: '11',
      name: 'Oceanic Mist Parfum',
      category: 'Fragrance',
      price: 135,
      description: 'A crisp, aquatic scent capturing the essence of the Mediterranean.',
      longDescription: 'Refreshing and profound. Oceanic Mist opens with salty sea spray and citrus, revealing a heart of sage and rosemary on a base of driftwood and patchouli.',
      ingredients: ['Limonene', 'Citronellol', 'Marine Mineral Accord', 'Alcohol Denat.'],
      usage: 'Mist lightly on pulse points. Perfect for daytime elegance.',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviews: []
    }
  ];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByCategory(category: 'Skincare' | 'Makeup' | 'Fragrance'): Product[] {
    return this.products.filter(p => p.category === category);
  }

  getFeaturedProducts(count: number = 4): Product[] {
    return this.products.slice(0, count);
  }
}
