import { useEffect, useState, useCallback } from "react"
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaImage } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"
import { useForm } from "react-hook-form"
import { getArchive, createArchive, updateArchive, deleteArchive } from "@/api/festival"
import { useToast } from "@/hooks/useToast"
import { GetArchiveResponse } from "@/types/festival"

interface ArchiveItem {
  _id: string
  year: string
  poster: string
  lineup: string
  description: string
}

interface ArchiveFormData {
  year: string
  lineup: string
  description: string
}

export function AdminArchive() {
  const [archives, setArchives] = useState<ArchiveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null) 
  const { register, handleSubmit, reset, setValue } = useForm<ArchiveFormData>()
  const { toast } = useToast()

  const fetchArchives = useCallback(async () => {
    try {
      const response = await getArchive()
      setArchives((response as GetArchiveResponse).archives)
    } catch (error) {
      console.error("Error fetching archives:", error)
      toast({
        title: "Error",
        description: "Failed to load archives",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchArchives()
  }, [fetchArchives])

  const handleEdit = (archive: ArchiveItem) => {
    setSelectedArchive(archive)
    setValue("year", archive.year)
    setValue("lineup", archive.lineup)
    setValue("description", archive.description)
    setSelectedImage(null)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedArchive(null)
    reset()
    setSelectedImage(null)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: ArchiveFormData) => {
    try {
      const formData = new FormData()
      formData.append("year", data.year)
      formData.append("lineup", data.lineup)
      formData.append("description", data.description)

      if (selectedImage) {
        formData.append("poster", selectedImage)
      } else if (selectedArchive && selectedArchive.poster) {
        // This indicates we want to keep the existing poster.
        // The service needs to know not to overwrite it with null.
        // We can send the existing URL, and the backend can check if it's a new file or an existing path.
        // Or, we can just not append 'poster' if there's no new image.
        // The backend logic will handle "no new image" correctly.
      }
      
      if (selectedArchive) {
        await updateArchive(selectedArchive._id, formData)
        toast({
          title: "Success",
          description: "Archive updated successfully"
        })
      } else {
        await createArchive(formData)
        toast({
          title: "Success",
          description: "Archive created successfully"
        })
      }

      setIsDialogOpen(false)
      fetchArchives()
      reset()
      setSelectedImage(null)
    } catch (error) {
      console.error("ARCHIVE: Error saving archive:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save archive",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (archiveId: string) => {
    try {
      await deleteArchive(archiveId)
      await fetchArchives()
      toast({
        title: "Success",
        description: "Archive deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting archive:", error)
      toast({
        title: "Error",
        description: "Failed to delete archive",
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
          <h1 className="text-3xl font-bold">Archive Management</h1>
          <p className="text-muted-foreground">Manage festival archive and past editions</p>
        </div>
        <Button onClick={handleAdd}>
          <FaPlus className="mr-2 h-4 w-4" />
          Add Archive
        </Button>
      </div>

      {/* Archives Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archives.map((archive) => (
          <Card key={archive._id} className="glass-card">
            <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-black flex items-center justify-center">
              {archive.poster ? (
                <img
                  src={archive.poster}
                  alt={`Festival ${archive.year}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <FaImage className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{archive.year}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {archive.description}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(archive)}>
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(archive._id)}>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>
              {selectedArchive ? "Edit Archive" : "Add New Archive"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poster" className="flex items-center gap-2">
                <FaImage className="h-4 w-4" />
                Festival Poster
              </Label>
              <FileUpload
                onFileSelect={(file) => setSelectedImage(file)}
                description="Upload festival poster"
                accept="image/*"
                maxSize={5}
                currentImage={selectedArchive?.poster} // Show existing image when editing
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center gap-2">
                <FaCalendarAlt className="h-4 w-4" />
                Year
              </Label>
              <Input
                id="year"
                {...register("year", { required: true })}
                placeholder="2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                {...register("description", { required: true })}
                placeholder="Brief description of this festival edition..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lineup">Lineup</Label>
              <Textarea
                id="lineup"
                rows={4}
                {...register("lineup", { required: true })}
                placeholder="Band 1, Band 2, Band 3..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {selectedArchive ? "Update Archive" : "Add Archive"}
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