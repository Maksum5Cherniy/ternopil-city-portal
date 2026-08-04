export type ID = string;

export type UserRole = "guest" | "user" | "owner" | "moderator" | "admin";

export type PublishStatus = "draft" | "pending" | "published" | "archived";

export type ModerationStatus = "pending" | "approved" | "rejected" | "hidden" | "blocked";

export type ListingStatus =
  "draft" | "pending" | "active" | "rejected" | "sold" | "archived" | "deleted";

export type ListingCondition = "new" | "likeNew" | "used" | "needsRepair";

export interface TimestampedEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

export interface SeoFields {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

export interface MediaAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  sourceUrl?: string;
}

export interface UserProfile extends TimestampedEntity {
  displayName: string;
  email: string;
  photoUrl?: string;
  roles: UserRole[];
  isBlocked: boolean;
}

export interface NewsArticle extends TimestampedEntity, SeoFields {
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  authorId: ID;
  categoryId: ID;
  tags: string[];
  status: PublishStatus;
  isFeatured: boolean;
  publishedAt?: string;
  viewCount: number;
}

export interface Place extends TimestampedEntity, SeoFields {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: ID;
  subcategoryId?: ID;
  ownerId?: ID;
  logo?: MediaAsset;
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  phone?: string;
  email?: string;
  website?: string;
  telegram?: string;
  instagram?: string;
  facebook?: string;
  address: string;
  district?: string;
  latitude: number;
  longitude: number;
  workingHours?: Record<string, string>;
  averagePrice?: string;
  paymentMethods: string[];
  features: string[];
  menuFiles: MediaAsset[];
  rating: number;
  reviewsCount: number;
  status: PublishStatus;
  verificationStatus: ModerationStatus;
  isFeatured: boolean;
}

export interface CityLocation extends TimestampedEntity, SeoFields {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: ID;
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  address?: string;
  latitude: number;
  longitude: number;
  workingHours?: Record<string, string>;
  priceInfo?: string;
  features: string[];
  status: PublishStatus;
  isFeatured: boolean;
}

export interface CityEvent extends TimestampedEntity, SeoFields {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  categoryId: ID;
  organizer: string;
  placeId?: ID;
  address?: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  endDate?: string;
  startTime?: string;
  price?: string;
  ticketUrl?: string;
  contactPhone?: string;
  status: PublishStatus;
  isFeatured: boolean;
}

export interface Listing extends TimestampedEntity {
  slug: string;
  userId: ID;
  title: string;
  description: string;
  price: number;
  currency: "UAH" | "USD" | "EUR";
  categoryId: ID;
  subcategoryId?: ID;
  condition: ListingCondition;
  images: MediaAsset[];
  city: string;
  district?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  preferredContact: "phone" | "telegram" | "instagram" | "other";
  status: ListingStatus;
  moderationStatus: ModerationStatus;
  isFeatured: boolean;
  views: number;
  favoritesCount: number;
  expiresAt: string;
}

export interface Review extends TimestampedEntity {
  userId: ID;
  placeId: ID;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  ownerReply?: string;
  status: ModerationStatus;
}

export interface HomeCard {
  title: string;
  description: string;
  href: string;
  meta?: string;
  badge?: string;
}
