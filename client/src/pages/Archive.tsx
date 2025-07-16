import { useEffect, useState } from "react"
import { FaCalendarAlt, FaUsers } from "react-icons/fa"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getArchive } from "@/api/festival"
import { useToast } from "@/hooks/useToast"
import { Helmet } from "react-helmet";
import { getSiteAssets } from "@/api/festival";
import { SiteAssets } from "@/types/SiteAssets";

interface ArchiveItem {
  _id: string
  year: string
  poster: string
  lineup: string
  description: string
}

interface GetArchiveResponse {
  archives: ArchiveItem[]
}

export function Archive() {
  const [archives, setArchives] = useState<ArchiveItem[]>([])
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [siteAssets, setSiteAssets] = useState<SiteAssets>({});

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        console.log("Fetching archive...")
        const response = await getArchive()
        setArchives((response as GetArchiveResponse).archives)
        console.log("Archive fetched successfully")
      } catch (error) {
        console.error("Error fetching archive:", error)
        toast({
          title: "Error",
          description: "Failed to load archive",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchArchive()
    getSiteAssets().then(data => setSiteAssets(data.assets || {}));
  }, [toast])

  const title = siteAssets.seoTitles?.archive || "Archive - Metal Gates Festival";
  const description = siteAssets.seoDescriptions?.archive || "Explore the archive of past Metal Gates Festival events.";

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
    <div className="container mx-auto px-4 space-y-12 pt-8">
      {/* Archive Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {archives.map((archive) => (
          <Card
            key={archive._id}
            className="glass-card group cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => setSelectedArchive(archive)}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-black flex items-center justify-center">
              <img
                src={archive.poster}
                alt={`Metal Gates ${archive.year}`}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaCalendarAlt className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-primary">{archive.year}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {archive.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Archive Detail Modal */}
      <Dialog open={!!selectedArchive} onOpenChange={() => setSelectedArchive(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
          {selectedArchive && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-center">
                  Metal Gates Festival {selectedArchive.year}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Poster */}
                <div className="space-y-4 bg-black rounded-lg flex items-center justify-center">
                  <img
                    src={selectedArchive.poster}
                    alt={`Metal Gates ${selectedArchive.year}`}
                    className="w-full aspect-[3/4] object-contain rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <FaCalendarAlt className="h-5 w-5" />
                      <span className="text-xl font-semibold">{selectedArchive.year}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedArchive.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaUsers className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Lineup</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-foreground leading-relaxed">
                        {selectedArchive.lineup}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground italic">
                      "Another incredible year of metal music and unforgettable memories at Metal Gates Festival."
                    </p>
                  </div>
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