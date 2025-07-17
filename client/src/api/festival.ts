import api from './api';
import { ApiResponse, Festival, InfoPageData } from "@/types/api";
import { SiteAssets } from "@/types/SiteAssets";

// Description: Get festival information and settings
// Endpoint: GET /api/festivals/active
// Request: {}
// Response: { success: boolean, data: { festivalName: string, dates: string, location: string, ticketUrl: string, countdown: { days: number, hours: number, minutes: number, seconds: number } }, message: string }
export const getFestivalInfo = async (): Promise<Festival> => {
  try {
    const response = await api.get('/api/festivals/active');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get all festivals
// Endpoint: GET /api/festivals
// Request: {}
// Response: { success: boolean, data: { festivals: Array<{ _id: string, name: string, dates: string, description: string, location: string, ticketUrl: string, isActive: boolean }> }, message: string }
export const getFestivals = async (): Promise<{ festivals: Festival[] }> => {
  try {
    const response = await api.get('/api/festivals');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get single festival by ID
// Endpoint: GET /api/festivals/:id
// Request: { id: string }
// Response: { success: boolean, data: { festival: { _id: string, name: string, dates: string, description: string, location: string, ticketUrl: string, isActive: boolean } }, message: string }
export const getFestival = async (id: string): Promise<{ festival: Festival }> => {
  try {
    const response = await api.get(`/api/festivals/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Create new festival
// Endpoint: POST /api/festivals
// Request: { name: string, dates: string, description: string, location: string, ticketUrl?: string, isActive?: boolean }
// Response: { success: boolean, data: { festival: object }, message: string }
export const createFestival = async (festivalData: { name: string; dates: string; description: string; location: string; ticketUrl?: string; isActive?: boolean }): Promise<ApiResponse<{ festival: Festival }>> => {
  try {
    const response = await api.post('/api/festivals', festivalData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update existing festival
// Endpoint: PUT /api/festivals/:id
// Request: { name: string, dates: string, description: string, location: string, ticketUrl?: string, isActive?: boolean }
// Response: { success: boolean, data: { festival: object }, message: string }
export const updateFestival = async (festivalId: string, festivalData: { name: string; dates: string; description: string; location: string; ticketUrl?: string; isActive?: boolean }): Promise<ApiResponse<{ festival: Festival }>> => {
  try {
    const response = await api.put(`/api/festivals/${festivalId}`, festivalData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Delete festival
// Endpoint: DELETE /api/festivals/:id
// Request: {}
// Response: { success: boolean, data: { festival: object }, message: string }
export const deleteFestival = async (festivalId: string): Promise<ApiResponse<{ festival: Festival }>> => {
  try {
    const response = await api.delete(`/api/festivals/${festivalId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get site assets (logo, hero image, and mobile hero image)
// Endpoint: GET /api/site-assets
// Request: {}
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null, mobileHeroImage: string | null } }, message: string }
export const getSiteAssets = async (): Promise<{ assets: SiteAssets }> => {
  try {
    const response = await api.get('/api/site-assets');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update site assets (logo, hero image, mobile hero image, countdown date, and general settings)
// Endpoint: PUT /api/site-assets
// Request: FormData containing assets data
// Response: { success: boolean, data: { assets: object }, message: string }
export const updateSiteAssets = async (assetsData: FormData | object) => {
  try {
    const isFormData = assetsData instanceof FormData;
    const response = await api.put('/api/site-assets', assetsData, {
      headers: {
        ...(isFormData && { 'Content-Type': 'multipart/form-data' }),
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update logo only
// Endpoint: PUT /api/site-assets/logo
// Request: { logo: string }
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const updateLogo = async (logo: string) => {
  try {
    const response = await api.put('/api/site-assets/logo', { logo });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update hero image only
// Endpoint: PUT /api/site-assets/hero
// Request: { heroImage: string }
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const updateHeroImage = async (heroImage: string) => {
  try {
    const response = await api.put('/api/site-assets/hero', { heroImage });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Remove logo
// Endpoint: DELETE /api/site-assets/logo
// Request: {}
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const removeLogo = async () => {
  try {
    const response = await api.delete('/api/site-assets/logo');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Remove hero image
// Endpoint: DELETE /api/site-assets/hero
// Request: {}
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const removeHeroImage = async () => {
  try {
    const response = await api.delete('/api/site-assets/hero');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get lineup bands
// Endpoint: GET /api/lineup
// Request: {}
// Response: { success: boolean, data: { bands: Array<{ _id: string, name: string, country: string, image: string, biography: string, spotifyEmbed: string, socialLinks: object }> } }
export const getLineup = async () => {
  try {
    const response = await api.get('/api/lineup');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Create new band
// Endpoint: POST /api/lineup
// Request: { name: string, country: string, genre: string, biography: string, spotifyEmbed?: string, socialLinks?: object, image?: File }
// Response: { success: boolean, data: { band: object }, message: string }
export const createBand = async (bandData: FormData) => {
  try {
    const response = await api.post('/api/lineup', bandData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update band
// Endpoint: PUT /api/lineup/:id
// Request: { name: string, country: string, genre: string, biography: string, spotifyEmbed?: string, socialLinks?: object, image?: File | 'null' }
// Response: { success: boolean, data: { band: object }, message: string }
export const updateBand = async (id: string, bandData: FormData) => {
  try {
    const response = await api.put(`/api/lineup/${id}`, bandData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Delete band
// Endpoint: DELETE /api/lineup/:id
// Request: {}
// Response: { success: boolean, data: { band: object }, message: string }
export const deleteBand = async (bandId: string) => {
  try {
    const response = await api.delete(`/api/lineup/${bandId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get news articles
// Endpoint: GET /api/news
// Request: {}
// Response: { success: boolean, data: { articles: Array<{ _id: string, title: string, excerpt: string, content: string, image: string, publishedAt: string }> } }
export const getNews = async () => {
  try {
    const response = await api.get('/api/news');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get single news article
// Endpoint: GET /api/news/:id
// Request: { id: string }
// Response: { success: boolean, data: { article: { _id: string, title: string, content: string, image: string, publishedAt: string } } }
export const getNewsArticle = async (id: string) => {
  try {
    const response = await api.get(`/api/news/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Create news article
// Endpoint: POST /api/news
// Request: FormData containing article data and optional image
// Response: { success: boolean, data: { article: object }, message: string }
export const createNewsArticle = async (articleData: FormData) => {
  try {
    const response = await api.post('/api/news', articleData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update news article
// Endpoint: PUT /api/news/:id
// Request: FormData containing article data and optional image
// Response: { success: boolean, data: { article: object }, message: string }
export const updateNewsArticle = async (articleId: string, articleData: FormData) => {
  try {
    const response = await api.put(`/api/news/${articleId}`, articleData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Delete news article
// Endpoint: DELETE /api/news/:id
// Request: {}
// Response: { success: boolean, data: { article: object }, message: string }
export const deleteNewsArticle = async (articleId: string) => {
  try {
    const response = await api.delete(`/api/news/${articleId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get archive posters
// Endpoint: GET /api/archives
// Request: {}
// Response: { success: boolean, data: { archives: Array<{ _id: string, year: string, poster: string, lineup: string, description: string }> } }
export const getArchive = async () => {
  try {
    const response = await api.get('/api/archives');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Create new archive entry
// Endpoint: POST /api/archives
// Request: { year: string, poster?: string, lineup: string, description: string }
// Response: { success: boolean, data: { archive: object }, message: string }
export const createArchive = async (archiveData: FormData) => {
  try {
    const response = await api.post('/api/archives', archiveData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update existing archive entry
// Endpoint: PUT /api/archives/:id
// Request: { year: string, poster?: string, lineup: string, description: string }
// Response: { success: boolean, data: { archive: object }, message: string }
export const updateArchive = async (archiveId: string, archiveData: FormData) => {
  try {
    const response = await api.put(`/api/archives/${archiveId}`, archiveData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Delete archive entry
// Endpoint: DELETE /api/archives/:id
// Request: {}
// Response: { success: boolean, data: { archive: object }, message: string }
export const deleteArchive = async (archiveId: string) => {
  try {
    const response = await api.delete(`/api/archives/${archiveId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Submit contact form
// Endpoint: POST /api/contact
// Request: { name: string, email: string, subject: string, message: string }
// Response: { success: boolean, data: { contact: { _id: string, name: string, email: string, subject: string, message: string, status: string, createdAt: string } }, message: string }
export const submitContactForm = async (data: { name: string; email: string; subject: string; message: string }) => {
  try {
    const response = await api.post('/api/contact', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get all contact form submissions (admin only)
// Endpoint: GET /api/contact
// Request: {}
// Response: { success: boolean, data: { contacts: Array<{ _id: string, name: string, email: string, subject: string, message: string, status: string, createdAt: string, updatedAt: string }> }, message: string }
export const getContactSubmissions = async () => {
  try {
    const response = await api.get('/api/contact');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get single contact submission (admin only)
// Endpoint: GET /api/contact/:id
// Request: { id: string }
// Response: { success: boolean, data: { contact: { _id: string, name: string, email: string, subject: string, message: string, status: string, createdAt: string, updatedAt: string } }, message: string }
export const getContactSubmission = async (id: string) => {
  try {
    const response = await api.get(`/api/contact/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update contact submission status (admin only)
// Endpoint: PUT /api/contact/:id/status
// Request: { status: string }
// Response: { success: boolean, data: { contact: object }, message: string }
export const updateContactStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/api/contact/${id}/status`, { status });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Delete contact submission (admin only)
// Endpoint: DELETE /api/contact/:id
// Request: {}
// Response: { success: boolean, data: { contact: object }, message: string }
export const deleteContactSubmission = async (id: string) => {
  try {
    const response = await api.delete(`/api/contact/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get info page content
// Endpoint: GET /api/infopage
export const getInfoPage = async (): Promise<InfoPageData> => {
  try {
    const response = await api.get('/api/infopage');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Update info page content
// Endpoint: PUT /api/infopage
// Request: InfoPageData object
// Response: { success: boolean, data: object, message: string }
export const updateInfoPage = async (infoPageData: InfoPageData): Promise<ApiResponse<InfoPageData>> => {
  try {
    const response = await api.put('/api/infopage', infoPageData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// --- Visitor Tracking ---

// Description: Log a new site visit
// Endpoint: POST /api/visits/log
export const logVisit = async () => {
  try {
    await api.post('/api/visits');
  } catch (error: unknown) {
    // Fail silently so it doesn't impact user experience
  }
};

// Description: Get visitor statistics (admin only)
// Endpoint: GET /api/visits/stats
export const getVisitorStats = async () => {
  try {
    const response = await api.get('/api/visits/stats');
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};