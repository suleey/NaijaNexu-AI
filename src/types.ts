
export type Domain = 'food' | 'movies' | 'books' | 'products' | 'jobs' | 'lifestyle' | 'other';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  domain: Domain;
  priceContext?: string;
  rating?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Recommendation[];
  timestamp: number;
}

export interface UserPreferences {
  onboarded: boolean;
  name?: string;
  interests?: Domain[];
  budget?: 'affordable' | 'medium' | 'premium';
  location?: string;
}
