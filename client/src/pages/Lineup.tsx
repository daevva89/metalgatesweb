import { useEffect, useState } from "react"
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa"
import { SiSpotify, SiFacebook, SiInstagram, SiYoutube, SiTiktok, SiBandcamp } from "react-icons/si"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getLineup } from "@/api/festival"
import { useToast } from "@/hooks/useToast"
import { Helmet } from "react-helmet";
import { getSiteAssets } from "@/api/festival";
import { SiteAssets } from "@/types/SiteAssets";

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

interface GetLineupResponse {
  bands: Band[]
}

export function Lineup() {
  const [bands, setBands] = useState<Band[]>([])
  const [selectedBand, setSelectedBand] = useState<Band | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [siteAssets, setSiteAssets] = useState<SiteAssets>({});

  useEffect(() => {
    const fetchLineup = async () => {
      try {
        const response = await getLineup()
        setBands((response as GetLineupResponse).bands)
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
    getSiteAssets().then(data => setSiteAssets(data.assets || {}));
  }, [toast])

  const title = siteAssets.seoTitles?.lineup || "Lineup - Metal Gates Festival";
  const description = siteAssets.seoDescriptions?.lineup || "See the full lineup for Metal Gates Festival.";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    <div className="container mx-auto px-4 space-y-8 pt-8">
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
                <FaMapMarkerAlt className="h-3 w-3" />
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
                  <div className="flex justify-center gap-4 flex-wrap">
                    {selectedBand.socialLinks.facebook && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                          <SiFacebook className="h-4 w-4 text-blue-600" />
                        </a>
                      </Button>
                    )}
                    {selectedBand.socialLinks.instagram && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <SiInstagram className="h-4 w-4 text-pink-500" />
                        </a>
                      </Button>
                    )}
                    {selectedBand.socialLinks.youtube && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                          <SiYoutube className="h-4 w-4 text-red-600" />
                        </a>
                      </Button>
                    )}
                    {selectedBand.socialLinks.tiktok && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                          <SiTiktok className="h-4 w-4 text-black dark:text-white" />
                        </a>
                      </Button>
                    )}
                    {selectedBand.socialLinks.bandcamp && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.bandcamp} target="_blank" rel="noopener noreferrer">
                          <SiBandcamp className="h-4 w-4 text-cyan-400" />
                        </a>
                      </Button>
                    )}
                    {selectedBand.socialLinks.website && (
                      <Button asChild variant="outline" size="icon">
                        <a href={selectedBand.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <FaGlobe className="h-4 w-4 text-gray-600" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Band Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FaMapMarkerAlt className="h-4 w-4" />
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
                  {selectedBand.spotifyEmbed && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <SiSpotify className="h-4 w-4 text-green-500" />
                        Listen on Spotify
                      </h4>
                      <div className="aspect-[5/2] bg-muted rounded-lg overflow-hidden">
                        <iframe
                          src={selectedBand.spotifyEmbed.replace('open.spotify.com/', 'open.spotify.com/embed/')}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title={`${selectedBand.name} on Spotify`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  )
}