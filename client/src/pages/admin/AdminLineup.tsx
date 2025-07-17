import { useEffect, useState, useCallback } from "react"
import { FaPlus, FaEdit, FaTrash, FaMusic, FaMapMarkerAlt, FaImage } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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
    tiktok?: string
    bandcamp?: string
    website?: string
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
  tiktok: string
  bandcamp: string
  website: string
}

export function AdminLineup() {
  const [bands, setBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBand, setSelectedBand] = useState<Band | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const { register, handleSubmit, reset, setValue } = useForm<BandFormData>()
  const { toast } = useToast()

  const fetchBands = async () => {
    try {
      const response = await getLineup()
      
      if (!response.bands || !Array.isArray(response.bands)) {
        throw new Error('Invalid response format: expected bands array')
      }

      setBands(response.bands)
    } catch (error) {
      console.error("LINEUP: Error fetching bands:", error)
      toast({
        title: "Error",
        description: "Failed to load lineup",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBands()
  }, [fetchBands])

  const handleEdit = (band: Band) => {
    setSelectedBand(band)
    setValue("name", band.name)
    setValue("country", band.country)
    setValue("genre", band.genre || "")
    setValue("biography", band.biography)
    setValue("spotifyEmbed", band.spotifyEmbed)
    setValue("facebook", band.socialLinks.facebook || "")
    setValue("instagram", band.socialLinks.instagram || "")
    setValue("youtube", band.socialLinks.youtube || "")
    setValue("tiktok", band.socialLinks.tiktok || "")
    setValue("bandcamp", band.socialLinks.bandcamp || "")
    setValue("website", band.socialLinks.website || "")
    setSelectedImageFile(null)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedBand(null)
    reset()
    setSelectedImageFile(null)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: BandFormData) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof BandFormData]);
      });

      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }

      if (selectedBand) {
        await updateBand(selectedBand._id, formData);
        toast({
          title: "Success",
          description: "Band updated successfully"
        });
      } else {
        await createBand(formData);
        toast({
          title: "Success",
          description: "Band added successfully"
        });
      }

      setIsDialogOpen(false);
      await fetchBands();
    } catch (error) {
      console.error("LINEUP: Error saving band:", error);
      console.error("LINEUP: Error stack:", (error as Error).stack);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save band",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (bandId: string) => {
    try {
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
          <p className="text-muted-foreground">Add, edit, and remove bands from the festival lineup</p>
        </div>
        <Button onClick={handleAdd}>
          <FaPlus className="mr-2 h-4 w-4" />
          Add Band
        </Button>
      </div>

      {/* Bands List */}
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
                  <FaImage className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{band.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaMusic className="h-4 w-4" />
                    {band.genre || "No genre specified"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaMapMarkerAlt className="h-4 w-4" />
                    {band.country}
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center gap-2 p-4 border-t border-muted">
                <Button variant="outline" size="sm" onClick={() => handleEdit(band)}>
                  <FaEdit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(band._id)}>
                  <FaTrash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
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
            <DialogDescription>
              {selectedBand
                ? "Update the details for this band."
                : "Fill in the form to add a new band to the lineup."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Band Image</Label>
              <FileUpload
                onFileSelect={setSelectedImageFile}
                currentImage={
                  selectedBand?.image
                    ? selectedBand.image
                    : null
                }
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input id="tiktok" {...register("tiktok")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bandcamp">Bandcamp</Label>
                  <Input id="bandcamp" {...register("bandcamp")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register("website")} />
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