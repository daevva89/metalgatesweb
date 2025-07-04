import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNewsArticle } from "@/api/festival"
import { useToast } from "@/hooks/useToast"

interface Article {
  _id: string
  title: string
  content: string
  image: string
  publishedAt: string
}

export function NewsArticle() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return

      try {
        console.log("Fetching news article:", id)
        const response = await getNewsArticle(id)
        setArticle((response as any).article)
        console.log("News article fetched successfully")
      } catch (error) {
        console.error("Error fetching news article:", error)
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id, toast])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Button asChild>
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
        
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{article.title}</h1>
      </div>

      {/* Featured Image */}
      <div className="aspect-video overflow-hidden rounded-lg">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg prose-invert max-w-none">
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed text-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Social Share */}
      <div className="border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Share this article:</p>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Article
          </Button>
        </div>
      </div>
    </div>
  )
}