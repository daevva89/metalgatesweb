import { useEffect, useState } from "react"
import { Music, MapPin, ExternalLink, Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getLineup } from "@/api/festival"
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

export function Lineup() {
  const [bands, setBands] = useState<Band[]>([])
  const [selectedBand, setSelectedBand] = useState<Band | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLineup = async () => {
      try {
        console.log("Fetching lineup...")
        const response = await getLineup()
        setBands((response as any).bands)
        console.log("Lineup fetched successfully")
      } catch (error) {
        console.error("Error fetching lineup:", error)
        toast({
          title: "Error",
          description: "Failed to load lineup",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLineup()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gradient">Lineup 2024</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get ready for an incredible lineup of metal legends and rising stars that will make this festival unforgettable
        </p>
      </div>

      {/* Band Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bands.map((band) => (
          <Card
            key={band._id}
            className="glass-card group cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => setSelectedBand(band)}
          >
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={band.image}
                alt={band.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-1">{band.name}</h3>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="h-3 w-3" />
                {band.country}
              </div>
              {band.genre && (
                <div className="text-sm text-muted-foreground italic">
                  {band.genre}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Band Detail Modal */}
      <Dialog open={!!selectedBand} onOpenChange={() => setSelectedBand(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
          {selectedBand && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedBand.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Band Image */}
                <div className="space-y-4">
                  <img
                    src={selectedBand.image}
                    alt={selectedBand.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    {selectedBand.socialLinks.facebook && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {selectedBand.socialLinks.instagram && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {selectedBand.socialLinks.youtube && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Band Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedBand.country}
                  </div>
                  
                  {selectedBand.genre && (
                    <div className="text-muted-foreground">
                      <span className="font-medium">Genre:</span> {selectedBand.genre}
                    </div>
                  )}
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed">{selectedBand.biography}</p>
                  </div>

                  {/* Spotify Embed */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Listen on Spotify
                    </h4>
                    <div className="aspect-[4/5] bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Spotify Player Embed</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}