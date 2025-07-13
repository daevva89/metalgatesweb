export interface Festival {
  _id: string;
  name: string;
  dates: string;
  description: string;
  location: string;
  ticketUrl: string;
  isActive: boolean;
}

export interface Band {
  _id: string;
  name: string;
  country: string;
  genre: string;
  image: string;
  biography: string;
  spotifyEmbed: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    bandcamp?: string;
    website?: string;
  };
}

export interface NewsArticle {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
}

export interface ArchiveItem {
  _id: string;
  year: string;
  poster: string;
  lineup: string;
  description: string;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  _id?: string;
}

export interface InfoPageData {
  location: {
    title: string;
    address: string;
    mapEmbedUrl: string;
  };
  travel: {
    byAir: string;
    byCar: string;
    accommodation: string;
  };
  rules: {
    importantGuidelines: string[];
    allowedItems: string[];
    prohibitedItems: string[];
    securityNote: string;
  };
  faq: FaqItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Example: ApiResponse<{ festivals: Festival[] }> 