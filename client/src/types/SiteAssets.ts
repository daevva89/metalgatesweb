export interface SiteAssets {
  logo?: string | null;
  heroImage?: string | null;
  mobileHeroImage?: string | null;
  bannerText?: string;
  contactEmails?: { purpose: string; email: string }[];
  copyright?: string;
  gtmId?: string;
  cookiebotId?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  seoTitles?: { [key: string]: string };
  seoDescriptions?: { [key: string]: string };
  countdownDate?: string;
  // Add other fields to SiteAssets as needed for future expansion
} 