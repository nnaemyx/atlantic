import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IListing extends Document {
  listingId: string;
  title: string;
  developer: string;
  developerLogo?: string;
  location: string;
  priceRange: string;
  image?: string;
  images: string[];
  type: 'Nigeria' | 'UK';
  overview: string;
  order: number;
  featured: boolean;
  createdAt: Date;
}

const ListingSchema: Schema = new Schema({
  listingId: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  developer: { type: String, required: true },
  developerLogo: { type: String },
  location: { type: String, required: true },
  priceRange: { type: String, required: true },
  image: { type: String, default: '' },
  images: [{ type: String }],
  type: { type: String, enum: ['Nigeria', 'UK'], required: true },
  overview: { type: String, required: true },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Listing: Model<IListing> = mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  location?: string;
  budget?: string;
  intent?: string;
  type: 'Nigeria' | 'UK';
  score: number;
  data?: Record<string, any>;
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String },
  budget: { type: String },
  intent: { type: String },
  type: { type: String, enum: ['Nigeria', 'UK'], required: true },
  score: { type: Number, default: 0 },
  data: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  category: string;
  published: boolean;
  createdAt: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: { type: String, default: 'Atlantic Property Admin' },
  category: { type: String, default: 'Investment' },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

const AdminSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
