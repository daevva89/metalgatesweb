import { useEffect, useState, useCallback } from "react"
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaEye } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"
import { useForm } from "react-hook-form"
import { getNews, createNewsArticle, updateNewsArticle, deleteNewsArticle } from "@/api/festival"
import { useToast } from "@/hooks/useToast"

interface NewsArticle {
  _id: string
  title: string
  excerpt: string
  content: string
  image: string
  publishedAt: string
}

interface ArticleFormData {
  title: string
  excerpt: string
  content: string
  publishedAt?: string
}

interface GetNewsResponse {
  articles: NewsArticle[]
}

export function AdminNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const { register, handleSubmit, reset, setValue } = useForm<ArticleFormData>()
  const { toast } = useToast()

  const fetchArticles = useCallback(async () => {
    try {
      const response = await getNews()
      setArticles((response as GetNewsResponse).articles)
    } catch (error) {
      console.error("NEWS: Error fetching articles:", error)
      toast({
        title: "Error",
        description: "Failed to load articles",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article)
    setValue("title", article.title)
    setValue("excerpt", article.excerpt)
    setValue("content", article.content)
    setValue("publishedAt", article.publishedAt)
    setSelectedImageFile(null)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedArticle(null)
    reset()
    setSelectedImageFile(null)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const formData = new FormData();
      
      // Always append required fields, even if empty (let server validate)
      formData.append('title', data.title || '');
      formData.append('content', data.content || '');
      formData.append('excerpt', data.excerpt || '');
      formData.append('publishedAt', data.publishedAt || '');
      
      // Optional fields - only append if they have values
      if (data.author) formData.append('author', data.author);
      if (data.tags) formData.append('tags', data.tags);
      
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }

      if (selectedArticle) {
        await updateNewsArticle(selectedArticle._id, formData)
        toast({
          title: "Success",
          description: "Article updated successfully"
        })
      } else {
        await createNewsArticle(formData)
        toast({
          title: "Success", 
          description: "Article created successfully"
        })
      }

      setIsDialogOpen(false)
      fetchArticles()
      reset()
      setSelectedImageFile(null)
    } catch (error) {
      console.error("NEWS: Error saving article:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save article",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (articleId: string) => {
    try {
      await deleteNewsArticle(articleId)
      toast({
        title: "Success",
        description: "Article deleted successfully"
      })
      fetchArticles()
    } catch (error) {
      console.error("NEWS: Error deleting article:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete article",
        variant: "destructive"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">Create and manage news articles</p>
        </div>
        <Button onClick={handleAdd}>
          <FaPlus className="mr-2 h-4 w-4" />
          Create Article
        </Button>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article._id} className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {article.image && (
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={article.image?.startsWith('/api/') ? article.image : `/api/${article.image}`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <FaCalendarAlt className="h-4 w-4" />
                      Published: {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/news/${article._id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <FaEye className="mr-2 h-4 w-4" />
                      View
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(article._id)}>
                    <FaTrash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>
              {selectedArticle ? "Edit Article" : "Create New Article"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <FileUpload
                onFileSelect={setSelectedImageFile}
                description="Upload featured image for article"
                currentImage={
                  selectedArticle?.image
                    ? (selectedArticle.image.startsWith('/api/') ? selectedArticle.image : `/api/${selectedArticle.image}`)
                    : null
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={3}
                {...register("excerpt", { required: true })}
                placeholder="Brief summary of the article..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                rows={12}
                {...register("content", { required: true })}
                placeholder="Full article content..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input
                type="date"
                id="publishedAt"
                {...register("publishedAt", { required: true })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {selectedArticle ? "Update Article" : "Create Article"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}