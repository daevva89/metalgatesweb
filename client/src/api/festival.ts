import api from './api';

// Description: Get festival information and settings
// Endpoint: GET /api/festivals/active
// Request: {}
// Response: { success: boolean, data: { festivalName: string, dates: string, location: string, ticketUrl: string, countdown: { days: number, hours: number, minutes: number, seconds: number } }, message: string }
export const getFestivalInfo = async () => {
  try {
    console.log("API: Making request to GET /api/festivals/active")
    const response = await api.get('/api/festivals/active');
    console.log("API: Received response from GET /api/festivals/active:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getFestivalInfo:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all festivals
// Endpoint: GET /api/festivals
// Request: {}
// Response: { success: boolean, data: { festivals: Array<{ _id: string, name: string, dates: string, description: string, location: string, ticketUrl: string, isActive: boolean }> }, message: string }
export const getFestivals = async () => {
  try {
    console.log("API: Making request to GET /api/festivals")
    const response = await api.get('/api/festivals');
    console.log("API: Received response from GET /api/festivals:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getFestivals:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get single festival by ID
// Endpoint: GET /api/festivals/:id
// Request: { id: string }
// Response: { success: boolean, data: { festival: { _id: string, name: string, dates: string, description: string, location: string, ticketUrl: string, isActive: boolean } }, message: string }
export const getFestival = async (id: string) => {
  try {
    console.log("API: Making request to GET /api/festivals/" + id)
    const response = await api.get(`/api/festivals/${id}`);
    console.log("API: Received response from GET /api/festivals/" + id + ":", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getFestival:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create new festival
// Endpoint: POST /api/festivals
// Request: { name: string, dates: string, description: string, location: string, ticketUrl?: string, isActive?: boolean }
// Response: { success: boolean, data: { festival: object }, message: string }
export const createFestival = async (festivalData: { name: string; dates: string; description: string; location: string; ticketUrl?: string; isActive?: boolean }) => {
  try {
    console.log("API: Making request to POST /api/festivals with data:", festivalData)
    const response = await api.post('/api/festivals', festivalData);
    console.log("API: Received response from POST /api/festivals:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in createFestival:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update existing festival
// Endpoint: PUT /api/festivals/:id
// Request: { name: string, dates: string, description: string, location: string, ticketUrl?: string, isActive?: boolean }
// Response: { success: boolean, data: { festival: object }, message: string }
export const updateFestival = async (festivalId: string, festivalData: { name: string; dates: string; description: string; location: string; ticketUrl?: string; isActive?: boolean }) => {
  try {
    console.log("API: Making request to PUT /api/festivals/" + festivalId + " with data:", festivalData)
    const response = await api.put(`/api/festivals/${festivalId}`, festivalData);
    console.log("API: Received response from PUT /api/festivals/" + festivalId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateFestival:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete festival
// Endpoint: DELETE /api/festivals/:id
// Request: {}
// Response: { success: boolean, data: { festival: object }, message: string }
export const deleteFestival = async (festivalId: string) => {
  try {
    console.log("API: Making request to DELETE /api/festivals/" + festivalId)
    const response = await api.delete(`/api/festivals/${festivalId}`);
    console.log("API: Received response from DELETE /api/festivals/" + festivalId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in deleteFestival:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get site assets (logo, hero image, and mobile hero image)
// Endpoint: GET /api/site-assets
// Request: {}
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null, mobileHeroImage: string | null } }, message: string }
export const getSiteAssets = async () => {
  try {
    console.log("API: Making request to GET /api/site-assets")
    const response = await api.get('/api/site-assets');
    console.log("API: Received response from GET /api/site-assets:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getSiteAssets:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update site assets (logo, hero image, mobile hero image, countdown date, and general settings)
// Endpoint: PUT /api/site-assets
// Request: { logo?: string, heroImage?: string, mobileHeroImage?: string, countdownDate?: string, bannerText?: string, contactEmails?: Array<{purpose: string, email: string}>, lineupTitle?: string, lineupDescription?: string }
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null, mobileHeroImage: string | null, countdownDate: string, bannerText: string, contactEmails: Array<{purpose: string, email: string}>, lineupTitle: string, lineupDescription: string } }, message: string }
export const updateSiteAssets = async (assetsData: { logo?: string; heroImage?: string; mobileHeroImage?: string; countdownDate?: string; bannerText?: string; contactEmails?: Array<{purpose: string, email: string}>; lineupTitle?: string; lineupDescription?: string }) => {
  try {
    console.log("API: Making request to PUT /api/site-assets with data:", {
      hasLogo: !!assetsData.logo,
      hasHeroImage: !!assetsData.heroImage,
      hasMobileHeroImage: !!assetsData.mobileHeroImage,
      hasCountdownDate: !!assetsData.countdownDate,
      hasBannerText: !!assetsData.bannerText,
      hasContactEmails: !!assetsData.contactEmails,
      hasLineupTitle: !!assetsData.lineupTitle,
      hasLineupDescription: !!assetsData.lineupDescription,
    });

    const response = await api.put('/api/site-assets', assetsData);
    console.log("API: Received response from PUT /api/site-assets:", response.data)
    console.log("API: Response assets data:", response.data.data?.assets)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateSiteAssets:", error)
    console.error("API: Error response:", error.response)
    console.error("API: Error response data:", error.response?.data)
    console.error("API: Error status:", error.response?.status)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update logo only
// Endpoint: PUT /api/site-assets/logo
// Request: { logo: string }
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const updateLogo = async (logo: string) => {
  try {
    console.log("API: Making request to PUT /api/site-assets/logo")
    const response = await api.put('/api/site-assets/logo', { logo });
    console.log("API: Received response from PUT /api/site-assets/logo:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateLogo:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update hero image only
// Endpoint: PUT /api/site-assets/hero
// Request: { heroImage: string }
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const updateHeroImage = async (heroImage: string) => {
  try {
    console.log("API: Making request to PUT /api/site-assets/hero")
    const response = await api.put('/api/site-assets/hero', { heroImage });
    console.log("API: Received response from PUT /api-site-assets/hero:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateHeroImage:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Remove logo
// Endpoint: DELETE /api/site-assets/logo
// Request: {}
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const removeLogo = async () => {
  try {
    console.log("API: Making request to DELETE /api/site-assets/logo")
    const response = await api.delete('/api/site-assets/logo');
    console.log("API: Received response from DELETE /api-site-assets/logo:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in removeLogo:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Remove hero image
// Endpoint: DELETE /api/site-assets/hero
// Request: {}
// Response: { success: boolean, data: { assets: { logo: string | null, heroImage: string | null } }, message: string }
export const removeHeroImage = async () => {
  try {
    console.log("API: Making request to DELETE /api/site-assets/hero")
    const response = await api.delete('/api/site-assets/hero');
    console.log("API: Received response from DELETE /api-site-assets/hero:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in removeHeroImage:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get lineup bands
// Endpoint: GET /api/lineup
// Request: {}
// Response: { success: boolean, data: { bands: Array<{ _id: string, name: string, country: string, image: string, biography: string, spotifyEmbed: string, socialLinks: object }> } }
export const getLineup = async () => {
  try {
    console.log("API: Making request to GET /api/lineup")
    const response = await api.get('/api/lineup');
    console.log("API: Received response from GET /api/lineup:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getLineup:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create new band
// Endpoint: POST /api/lineup
// Request: { name: string, country: string, genre: string, biography: string, spotifyEmbed: string, facebook: string, instagram: string, youtube: string, tiktok: string, bandcamp: string, website: string }
// Response: { success: boolean, data: { band: object }, message: string }
export const createBand = async (bandData: { name: string; country: string; genre: string; biography: string; spotifyEmbed: string; facebook: string; instagram: string; youtube: string; tiktok: string; bandcamp: string; website: string; image?: string }) => {
  try {
    console.log("API: Making request to POST /api/lineup with data:", {
      ...bandData,
      image: bandData.image ? `base64 data (${bandData.image.length} chars)` : "no image"
    })
    const response = await api.post('/api/lineup', bandData);
    console.log("API: Received response from POST /api/lineup:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in createBand:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update existing band
// Endpoint: PUT /api/lineup/:id
// Request: { name: string, country: string, genre: string, biography: string, spotifyEmbed: string, facebook: string, instagram: string, youtube: string, tiktok: string, bandcamp: string, website: string }
// Response: { success: boolean, data: { band: object }, message: string }
export const updateBand = async (bandId: string, bandData: { name: string; country: string; genre: string; biography: string; spotifyEmbed: string; facebook: string; instagram: string; youtube: string; tiktok: string; bandcamp: string; website: string; image?: string }) => {
  try {
    console.log("API: Making request to PUT /api/lineup/" + bandId + " with data:", {
      ...bandData,
      image: bandData.image ? `base64 data (${bandData.image.length} chars)` : "no image"
    })
    const response = await api.put(`/api/lineup/${bandId}`, bandData);
    console.log("API: Received response from PUT /api/lineup/" + bandId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateBand:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete band
// Endpoint: DELETE /api/lineup/:id
// Request: {}
// Response: { success: boolean, data: { band: object }, message: string }
export const deleteBand = async (bandId: string) => {
  try {
    console.log("API: Making request to DELETE /api/lineup/" + bandId)
    const response = await api.delete(`/api/lineup/${bandId}`);
    console.log("API: Received response from DELETE /api/lineup/" + bandId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in deleteBand:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get news articles
// Endpoint: GET /api/news
// Request: {}
// Response: { success: boolean, data: { articles: Array<{ _id: string, title: string, excerpt: string, content: string, image: string, publishedAt: string }> } }
export const getNews = async () => {
  try {
    console.log("API: Making request to GET /api/news")
    const response = await api.get('/api/news');
    console.log("API: Received response from GET /api/news:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getNews:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get single news article
// Endpoint: GET /api/news/:id
// Request: { id: string }
// Response: { success: boolean, data: { article: { _id: string, title: string, content: string, image: string, publishedAt: string } } }
export const getNewsArticle = async (id: string) => {
  try {
    console.log("API: Making request to GET /api/news/" + id)
    const response = await api.get(`/api/news/${id}`);
    console.log("API: Received response from GET /api/news/" + id + ":", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getNewsArticle:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create new news article
// Endpoint: POST /api/news
// Request: { title: string, excerpt: string, content: string, image?: string, publishedAt?: string }
// Response: { success: boolean, data: { article: object }, message: string }
export const createNewsArticle = async (articleData: { title: string; excerpt: string; content: string; image?: string; publishedAt?: string }) => {
  try {
    console.log("API: Making request to POST /api/news with data:", {
      ...articleData,
      image: articleData.image ? `base64 data (${articleData.image.length} chars)` : "no image"
    })
    const response = await api.post('/api/news', articleData);
    console.log("API: Received response from POST /api/news:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in createNewsArticle:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update existing news article
// Endpoint: PUT /api/news/:id
// Request: { title: string, excerpt: string, content: string, image?: string, publishedAt?: string }
// Response: { success: boolean, data: { article: object }, message: string }
export const updateNewsArticle = async (articleId: string, articleData: { title: string; excerpt: string; content: string; image?: string; publishedAt?: string }) => {
  try {
    console.log("API: Making request to PUT /api/news/" + articleId + " with data:", {
      ...articleData,
      image: articleData.image ? `base64 data (${articleData.image.length} chars)` : "no image"
    })
    const response = await api.put(`/api/news/${articleId}`, articleData);
    console.log("API: Received response from PUT /api/news/" + articleId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateNewsArticle:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete news article
// Endpoint: DELETE /api/news/:id
// Request: {}
// Response: { success: boolean, data: { article: object }, message: string }
export const deleteNewsArticle = async (articleId: string) => {
  try {
    console.log("API: Making request to DELETE /api/news/" + articleId)
    const response = await api.delete(`/api/news/${articleId}`);
    console.log("API: Received response from DELETE /api/news/" + articleId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in deleteNewsArticle:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get archive posters
// Endpoint: GET /api/archives
// Request: {}
// Response: { success: boolean, data: { archives: Array<{ _id: string, year: string, poster: string, lineup: string, description: string }> } }
export const getArchive = async () => {
  try {
    console.log("API: Making request to GET /api/archives")
    const response = await api.get('/api/archives');
    console.log("API: Received response from GET /api/archives:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getArchive:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create new archive entry
// Endpoint: POST /api/archives
// Request: { year: string, poster?: string, lineup: string, description: string }
// Response: { success: boolean, data: { archive: object }, message: string }
export const createArchive = async (archiveData: { year: string; poster?: string; lineup: string; description: string }) => {
  try {
    console.log("API: Making request to POST /api/archives with data:", {
      ...archiveData,
      poster: archiveData.poster ? `base64 data (${archiveData.poster.length} chars)` : "no poster"
    })
    const response = await api.post('/api/archives', archiveData);
    console.log("API: Received response from POST /api/archives:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in createArchive:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update existing archive entry
// Endpoint: PUT /api/archives/:id
// Request: { year: string, poster?: string, lineup: string, description: string }
// Response: { success: boolean, data: { archive: object }, message: string }
export const updateArchive = async (archiveId: string, archiveData: { year: string; poster?: string; lineup: string; description: string }) => {
  try {
    console.log("API: Making request to PUT /api/archives/" + archiveId + " with data:", {
      ...archiveData,
      poster: archiveData.poster ? `base64 data (${archiveData.poster.length} chars)` : "no poster"
    })
    const response = await api.put(`/api/archives/${archiveId}`, archiveData);
    console.log("API: Received response from PUT /api/archives/" + archiveId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateArchive:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete archive entry
// Endpoint: DELETE /api/archives/:id
// Request: {}
// Response: { success: boolean, data: { archive: object }, message: string }
export const deleteArchive = async (archiveId: string) => {
  try {
    console.log("API: Making request to DELETE /api/archives/" + archiveId)
    const response = await api.delete(`/api/archives/${archiveId}`);
    console.log("API: Received response from DELETE /api/archives/" + archiveId + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in deleteArchive:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Submit contact form
// Endpoint: POST /api/contact
// Request: { name: string, email: string, subject: string, message: string }
// Response: { success: boolean, data: { contact: { _id: string, name: string, email: string, subject: string, message: string, status: string, createdAt: string } }, message: string }
export const submitContactForm = async (data: { name: string; email: string; subject: string; message: string }) => {
  try {
    console.log("API: Making request to POST /api/contact with data:", data)
    const response = await api.post('/api/contact', data);
    console.log("API: Received response from POST /api/contact:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in submitContactForm:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all contact form submissions (admin only)
// Endpoint: GET /api/contact
// Request: {}
// Response: { success: boolean, data: { contacts: Array<{ _id: string, name: string, email: string, subject: string, message: string, status: string, createdAt: string, updatedAt: string }> }, message: string }
export const getContactSubmissions = async () => {
  try {
    console.log("API: Making request to GET /api/contact")
    const response = await api.get('/api/contact');
    console.log("API: Received response from GET /api/contact:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getContactSubmissions:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get single contact submission (admin only)
// Endpoint: GET /api/contact/:id
// Request: { id: string }
// Response: { success: boolean, data: { contact: { _id: string, name: string, email: string, subject: string, message: string, status: string, createdAt: string, updatedAt: string } }, message: string }
export const getContactSubmission = async (id: string) => {
  try {
    console.log("API: Making request to GET /api/contact/" + id)
    const response = await api.get(`/api/contact/${id}`);
    console.log("API: Received response from GET /api/contact/" + id + ":", response.data)
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getContactSubmission:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update contact submission status (admin only)
// Endpoint: PUT /api/contact/:id/status
// Request: { status: string }
// Response: { success: boolean, data: { contact: object }, message: string }
export const updateContactStatus = async (id: string, status: string) => {
  try {
    console.log("API: Making request to PUT /api/contact/" + id + "/status with status:", status)
    const response = await api.put(`/api/contact/${id}/status`, { status });
    console.log("API: Received response from PUT /api/contact/" + id + "/status:", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in updateContactStatus:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete contact submission (admin only)
// Endpoint: DELETE /api/contact/:id
// Request: {}
// Response: { success: boolean, data: { contact: object }, message: string }
export const deleteContactSubmission = async (id: string) => {
  try {
    console.log("API: Making request to DELETE /api/contact/" + id)
    const response = await api.delete(`/api/contact/${id}`);
    console.log("API: Received response from DELETE /api/contact/" + id + ":", response.data)
    return response.data;
  } catch (error) {
    console.error("API: Error in deleteContactSubmission:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get info page content
// Endpoint: GET /api/infopage
export const getInfoPage = async () => {
  try {
    const response = await api.get('/api/infopage');
    return response.data.data;
  } catch (error) {
    console.error("API: Error in getInfoPage:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update info page content
// Endpoint: PUT /api/infopage
export const updateInfoPage = async (infoPageData: any) => {
  try {
    const response = await api.put('/api/infopage', infoPageData);
    return response.data;
  } catch (error) {
    console.error("API: Error in updateInfoPage:", error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};