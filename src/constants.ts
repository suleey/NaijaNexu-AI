import { Recommendation } from './types';

export const INITIAL_TRENDING_SPOTS: Recommendation[] = [
  {
    id: 'trend-1',
    title: 'Danfo Bistro, Lagos',
    description: 'A vibrant, modern take on Nigerian street food culture. Famous for their Ewa Agoyin and unique "Danfo" bus inspired decor.',
    reason: 'Highly rated for its creative fusion and authentic Lagos vibe. A must-visit for foodies looking for a modern twist on classics.',
    domain: 'food',
    priceContext: '₦10,000 - ₦25,000',
    rating: '4.8',
    tags: ['Contemporary', 'Lagos Vibe', 'Street Food']
  },
  {
    id: 'trend-2',
    title: 'Nike Art Gallery, Lagos',
    description: 'One of the largest privately-owned art galleries in Africa, boasting over 8,000 artworks from various Nigerian artists.',
    reason: 'The ultimate cultural experience in Lagos. Recommended for its breathtaking collection and authentic artistic heritage.',
    domain: 'lifestyle',
    priceContext: 'Free Entry',
    rating: '4.9',
    tags: ['Art', 'Culture', 'Tourism']
  },
  {
    id: 'trend-3',
    title: 'Terra Kulture, VI',
    description: 'The center for Nigerian art, culture, and business. Features an amazing restaurant, theater, and bookstore.',
    reason: 'Perfect for someone who enjoys the intersection of fine dining and theatrical performances. The Jollof is legendary.',
    domain: 'food',
    priceContext: '₦15,000 - ₦40,000',
    rating: '4.7',
    tags: ['Theater', 'Fine Dining', 'Bookstore']
  },
  {
    id: 'trend-4',
    title: 'Freedom Park, Lagos Island',
    description: 'A memorial and leisure park site formerly a colonial prison. Now a hub for concerts, festivals, and food.',
    reason: 'Recommended for its historical significance and the lively evening atmosphere with live Highlife music.',
    domain: 'lifestyle',
    priceContext: '₦500 - ₦5,000',
    rating: '4.5',
    tags: ['History', 'Music', 'Outdoors']
  },
  {
    id: 'trend-5',
    title: 'Wuse Market, Abuja',
    description: 'The primary open-market in Abuja. A hub for everything from electronics to traditional fabrics.',
    reason: 'The best place to experience the real hustle and bustle of Abuja while shopping for high-quality fabrics.',
    domain: 'products',
    priceContext: 'Variable',
    rating: '4.4',
    tags: ['Shopping', 'Local Market', 'Abuja']
  },
  {
    id: 'trend-6',
    title: 'Agodi Gardens, Ibadan',
    description: 'A beautiful botanical garden and recreational center in the heart of Ibadan. Features a water park and mini zoo.',
    reason: 'A peaceful escape from urban noise. Popular for family outings and quiet picnics.',
    domain: 'lifestyle',
    priceContext: 'Affordable',
    rating: '4.6',
    tags: ['Nature', 'Family Friendly', 'Ibadan']
  },
  {
    id: 'trend-7',
    title: 'Kantin Kwari Market, Kano',
    description: 'The largest textile market in Africa. A massive commercial hub known for traditional fabrics, high-quality lace, and various clothing materials.',
    reason: 'Recommended for the best deals on textiles and ethnic African fabrics. It is a legendary shopping destination in Northern Nigeria.',
    domain: 'products',
    priceContext: 'Very Affordable',
    rating: '4.6',
    tags: ['Clothing', 'Textiles', 'Kano', 'Market']
  }
];

export const INITIAL_GUIDES = [
  {
    title: 'The Amala Protocol',
    content: 'Finding the best Amala in Lagos requires knowing the "buka" culture. Look for spots with high turnover and steam rising from the pots. Always ask for "Abula" (Gbegiri + Ewedu).',
    category: 'Food'
  },
  {
    title: 'Budget Living in Yaba',
    content: 'For students and young professionals in Yaba, "White House" is a legendary affordable spot. Use "Yaba Left" (towards Sabo) for the best electronics deals.',
    category: 'Lifestyle'
  },
  {
    title: 'Safe Night Moves',
    content: 'When exploring Lagos nightlife, always use ride-sharing apps like Bolt or Uber rather than flagging local taxis. Areas like Lekki Phase 1 and Victoria Island are generally better lit and more secure.',
    category: 'Safety'
  },
  {
    title: 'Bargaining Like a Pro',
    content: 'In markets like Balogun or Wuse, never accept the first price. A good rule of thumb is to offer 40% of the initial price and meet somewhere in the middle.',
    category: 'Shopping'
  }
];
