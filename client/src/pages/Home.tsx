import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getFestivalInfo, getNews, getSiteAssets } from "@/api/festival"
import { useToast } from "@/hooks/useToast"
import { Helmet } from "react-helmet-async";
import { SiteAssets } from "@/types/SiteAssets";

interface FestivalInfo {
  ticketUrl: string
}

interface NewsArticle {
  _id: string
  title: string
  excerpt: string
  image: string
  publishedAt: string
}

export function Home() {
  const [festivalInfo, setFestivalInfo] = useState<FestivalInfo | null>(null)
  const [news, setNews] = useState<NewsArticle[]>([])
  const [siteAssets, setSiteAssets] = useState<SiteAssets>({});
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadData = useCallback(async () => {
    try {
      const [festivalData, newsData] = await Promise.all([
        getFestivalInfo(),
        getNews()
      ])

      setFestivalInfo(festivalData)
      setNews(newsData.articles?.slice(0, 4) || [])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load festival information",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const loadSiteAssets = useCallback(async () => {
    try {
      const data = await getSiteAssets()
      setSiteAssets(data.assets || {});
    } catch (error) {
      console.error("Error loading site assets:", error)
    }
  }, [])

  const updateCountdown = useCallback(() => {
    const targetDate = siteAssets.countdownDate 
      ? new Date(siteAssets.countdownDate)
      : new Date("2025-09-26T14:00:00.000Z")
    
    const now = new Date()
    const difference = targetDate.getTime() - now.getTime()

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    } else {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    }
  }, [siteAssets.countdownDate])

  useEffect(() => {
    loadData()
    loadSiteAssets()
  }, [loadData, loadSiteAssets])

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [updateCountdown])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const title = siteAssets.seoTitles?.home || "Metal Gates Festival";
  const description = siteAssets.seoDescriptions?.home || "Official website for Metal Gates Festival. Get the latest news, lineup, tickets, and info.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    <div className="min-h-screen w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full aspect-[6580/9212] md:aspect-[1000/524] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Hero Background Image */}
        {siteAssets.heroImage && (
          <>
            <img
              src={siteAssets.heroImage}
              alt="Festival Background"
              className="absolute inset-0 w-full h-full object-contain z-0 hidden md:block"
            />
            <div className="absolute inset-0 bg-black/60 z-10 hidden md:block"></div>
          </>
        )}
        
        {/* Mobile Hero Background Image */}
        {siteAssets.mobileHeroImage && (
          <>
            <img
              src={siteAssets.mobileHeroImage}
              alt="Festival Background Mobile"
              className="absolute inset-0 w-full h-full object-contain z-0 block md:hidden"
            />
            <div className="absolute inset-0 bg-black/60 z-10 block md:hidden"></div>
          </>
        )}
        
        {/* Gradient Background (fallback when no hero image) */}
        {!siteAssets.heroImage && !siteAssets.mobileHeroImage && (
          <div className="absolute inset-0 gradient-bg z-0"></div>
        )}
        
        {/* Gradient Background for mobile when no mobile image but desktop image exists */}
        {!siteAssets.mobileHeroImage && siteAssets.heroImage && (
          <div className="absolute inset-0 gradient-bg z-0 block md:hidden"></div>
        )}
        
        {/* Gradient Background for desktop when no desktop image but mobile image exists */}
        {!siteAssets.heroImage && siteAssets.mobileHeroImage && (
          <div className="absolute inset-0 gradient-bg z-0 hidden md:block"></div>
        )}

        <div className="container mx-auto px-4 z-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Countdown */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds }
              ].map((item) => (
                <Card key={item.label} className="glass-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{item.value}</div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/lineup">
                  View Lineup
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <a href={festivalInfo?.ticketUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Buy Tickets
                  <FaExternalLinkAlt className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Latest News</h2>
          <p className="text-xl text-muted-foreground">Stay updated with the latest festival announcements</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((article) => (
            <Card key={article._id} className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={article.image?.startsWith('/api/') ? article.image : `/api/${article.image}`}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-semibold line-clamp-2">{article.title}</h3>
                  <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  <Button asChild variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                    <Link to={`/news/${article._id}`}>
                      Read More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/news">
              View All News
            </Link>
          </Button>
        </div>
      </section>
    </div>
    </>
  )
}