import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Music, MapPin, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"
import { useForm } from "react-hook-form"
import { getLineup, createBand, updateBand, deleteBand } from "@/api/festival"
import { useToast } from "@/hooks/useToast"

interface Band {
  _id: string
  name: string
  country: string
  genre: string
  image: string
  biography: string
  spotifyEmbed: string
  socialLinks: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

interface BandFormData {
  name: string
  country: string
  genre: string
  biography: string
  spotifyEmbed: string
  facebook: string
  instagram: string
  youtube: string
}

export function AdminLineup() {
  const [bands, setBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBand, setSelectedBand] = useState<Band | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { register, handleSubmit, reset, setValue } = useForm<BandFormData>()
  const { toast } = useToast()

  useEffect(() => {
    fetchBands()
  }, [])

  const fetchBands = async () => {
    try {
      console.log("LINEUP: Fetching bands for admin...")
      const response = await getLineup()
      console.log("LINEUP: Raw response from getLineup:", response)
      console.log("LINEUP: Bands array:", response.bands)
      
      if (response.bands && response.bands.length > 0) {
        response.bands.forEach((band: any, index: number) => {
          console.log(`LINEUP: Band ${index + 1} (${band.name}):`, {
            _id: band._id,
            name: band.name,
            hasImage: !!band.image,
            imageLength: band.image ? band.image.length : 0,
            imagePreview: band.image ? band.image.substring(0, 50) + "..." : "no image"
          })
        })
      }
      
      setBands(response.bands)
      console.log("LINEUP: Bands set in state successfully")
    } catch (error) {
      console.error("LINEUP: Error fetching bands:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to load bands",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (band: Band) => {
    console.log("LINEUP: Editing band:", {
      name: band.name,
      hasImage: !!band.image,
      imageLength: band.image ? band.image.length : 0
    })
    setSelectedBand(band)
    setValue("name", band.name)
    setValue("country", band.country)
    setValue("genre", band.genre || "")
    setValue("biography", band.biography)
    setValue("spotifyEmbed", band.spotifyEmbed)
    setValue("facebook", band.socialLinks.facebook || "")
    setValue("instagram", band.socialLinks.instagram || "")
    setValue("youtube", band.socialLinks.youtube || "")
    setSelectedImage(null)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    console.log("LINEUP: Adding new band")
    setSelectedBand(null)
    reset()
    setSelectedImage(null)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: BandFormData) => {
    try {
      console.log("LINEUP: Starting form submission")
      console.log("LINEUP: Form data:", data)
      console.log("LINEUP: Selected image (base64):", selectedImage ? {
        isBase64: selectedImage.startsWith('data:'),
        length: selectedImage.length
      } : "No image selected")
      console.log("LINEUP: Selected band for editing:", selectedBand ? {
        name: selectedBand.name,
        hasExistingImage: !!selectedBand.image
      } : "No band selected (creating new)")

      let imageUrl = ""

      if (selectedImage) {
        console.log("LINEUP: Using uploaded image (already base64), length:", selectedImage.length)
        imageUrl = selectedImage
      } else if (selectedBand && selectedBand.image && !selectedImage) {
        imageUrl = selectedBand.image
        console.log("LINEUP: Keeping existing band image, path:", imageUrl)
      } else {
        imageUrl = ""
        console.log("LINEUP: No image to process")
      }

      const bandData = {
        ...data,
        ...(imageUrl ? { image: imageUrl } : {})
      }

      console.log("LINEUP: Final band data to save:", {
        ...bandData,
        image: imageUrl ? (imageUrl.startsWith('data:') ? `base64 data (${imageUrl.length} chars)` : `file path: ${imageUrl}`) : "no image"
      })

      let result
      if (selectedBand) {
        console.log("LINEUP: Updating existing band with ID:", selectedBand._id)
        result = await updateBand(selectedBand._id, bandData)
        console.log("LINEUP: Update result:", result)
        toast({
          title: "Success",
          description: "Band updated successfully"
        })
      } else {
        console.log("LINEUP: Creating new band")
        result = await createBand(bandData)
        console.log("LINEUP: Create result:", result)
        toast({
          title: "Success",
          description: "Band added successfully"
        })
      }

      setIsDialogOpen(false)
      console.log("LINEUP: Refreshing bands list...")
      await fetchBands()
    } catch (error) {
      console.error("LINEUP: Error saving band:", error)
      console.error("LINEUP: Error stack:", (error as Error).stack)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save band",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (bandId: string) => {
    try {
      console.log("LINEUP: Deleting band:", bandId)
      await deleteBand(bandId)
      toast({
        title: "Success",
        description: "Band deleted successfully"
      })
      fetchBands()
    } catch (error) {
      console.error("LINEUP: Error deleting band:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete band",
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
          <h1 className="text-3xl font-bold">Lineup Management</h1>
          <p className="text-muted-foreground">Manage festival bands and lineup</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Band
        </Button>
      </div>

      {/* Bands Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bands.map((band) => {
          return (
            <Card key={band._id} className="glass-card">
              <div className="aspect-square overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                {band.image ? (
                  <img
                    src={band.image}
                    alt={band.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{band.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {band.country}
                  </div>
                  {band.genre && (
                    <div className="text-sm text-muted-foreground">
                      {band.genre}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(band)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(band._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>
              {selectedBand ? "Edit Band" : "Add New Band"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Band Image</Label>
              <FileUpload
                onFileSelect={setSelectedImage}
                description="Upload band image"
                accept="image/*"
                maxSize={5}
                currentImage={selectedBand?.image}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Band Name</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country", { required: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" {...register("genre")} placeholder="e.g. Black Metal, Death Metal, Thrash Metal" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                rows={4}
                {...register("biography", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spotifyEmbed">Spotify Embed URL</Label>
              <Input id="spotifyEmbed" {...register("spotifyEmbed")} />
            </div>

            <div className="space-y-4">
              <Label>Social Media Links</Label>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" {...register("facebook")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" {...register("instagram")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input id="youtube" {...register("youtube")} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {selectedBand ? "Update Band" : "Add Band"}
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