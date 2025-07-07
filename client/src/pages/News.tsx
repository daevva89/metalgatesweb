import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getNews } from "@/api/festival"
import { useToast } from "@/hooks/useToast"

interface NewsArticle {
  _id: string
  title: string
  excerpt: string
  image: string
  publishedAt: string
}

export function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("Fetching news articles...")
        const response = await getNews()
        setArticles((response as any).articles)
        console.log("News articles fetched successfully")
      } catch (error) {
        console.error("Error fetching news:", error)
        toast({
          title: "Error",
          description: "Failed to load news articles",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 space-y-12 pt-8">
      {/* Articles Grid */}
      <div className="space-y-8">
        {articles.map((article, index) => (
          <Card key={article._id} className="glass-card group hover:scale-[1.02] transition-transform duration-300">
            <div className={`grid ${index % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-6`}>
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''} aspect-video overflow-hidden rounded-lg`}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <CardContent className={`${index % 2 === 1 ? 'md:order-1' : ''} p-6 flex flex-col justify-center space-y-4`}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <h2 className="text-2xl font-bold line-clamp-2">{article.title}</h2>
                
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <Button asChild variant="ghost" className="self-start p-0 h-auto text-primary hover:text-primary/80">
                  <Link to={`/news/${article._id}`} className="flex items-center gap-2">
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}