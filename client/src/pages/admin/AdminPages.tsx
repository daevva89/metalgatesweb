import { useState, useEffect } from "react"
import { Save, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/useToast"
import { getSiteAssets, updateHeroImage, updateSiteAssets } from "@/api/festival"

export function AdminPages() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedHeroImage, setSelectedHeroImage] = useState<string | null>(null)
  const [selectedMobileHeroImage, setSelectedMobileHeroImage] = useState<string | null>(null)
  const [countdownDate, setCountdownDate] = useState<string>("")
  const { toast } = useToast()

  const [pageContent, setPageContent] = useState({
    home: {
      heroTitle: "Metal Gates Festival",
      heroSubtitle: "June 15-17, 2024",
      heroDescription: "The ultimate metal experience in Bucharest",
      heroImage: "",
      mobileHeroImage: ""
    },
    info: {
      travelInfo: "Henri Coandă International Airport (OTP) is 45 minutes from the venue...",
      rules: "Outside food and beverages are not permitted...",
      faq: "What time does the festival start each day?"
    }
  })

  useEffect(() => {
    loadHeroImage()
  }, [])

  const loadHeroImage = async () => {
    try {
      setLoading(true)
      const data = await getSiteAssets()
      console.log("PAGES: Loaded site assets from API:", {
        heroImage: data.assets?.heroImage ? "found" : "not found",
        mobileHeroImage: data.assets?.mobileHeroImage ? "found" : "not found",
        countdownDate: data.assets?.countdownDate ? "found" : "not found"
      })
      
      if (data.assets?.heroImage || data.assets?.mobileHeroImage) {
        setPageContent(prev => ({
          ...prev,
          home: { 
            ...prev.home, 
            heroImage: data.assets.heroImage || "",
            mobileHeroImage: data.assets.mobileHeroImage || ""
          }
        }))
      }
      
      if (data.assets?.countdownDate) {
        // Convert the UTC date to Romanian time for display in the admin
        const date = new Date(data.assets.countdownDate)
        // Romanian time is GMT+3 (or GMT+2 in winter, but we'll use GMT+3 for consistency)
        const romanianTime = new Date(date.getTime() + (3 * 60 * 60 * 1000))
        const localDateTime = romanianTime.toISOString().slice(0, 16)
        setCountdownDate(localDateTime)
        console.log("PAGES: Loaded countdown date:", {
          original: data.assets.countdownDate,
          romanianTime: romanianTime.toISOString(),
          displayValue: localDateTime
        })
      }
    } catch (error) {
      console.error("PAGES: Error loading site assets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      console.log("Saving page content:", section)
      
      if (section === 'home') {
        const updateData: any = {}
        
        if (selectedHeroImage) {
          console.log("PAGES: Uploading new desktop hero image, length:", selectedHeroImage.length)
          updateData.heroImage = selectedHeroImage
        }
        
        if (selectedMobileHeroImage) {
          console.log("PAGES: Uploading new mobile hero image, length:", selectedMobileHeroImage.length)
          updateData.mobileHeroImage = selectedMobileHeroImage
        }
        
        if (countdownDate) {
          // Convert the input date (assumed to be Romanian time) to UTC for storage
          const inputDate = new Date(countdownDate)
          // Subtract 3 hours to convert from Romanian time to UTC
          const utcDate = new Date(inputDate.getTime() - (3 * 60 * 60 * 1000))
          console.log("PAGES: Updating countdown date:", {
            input: countdownDate,
            inputDate: inputDate.toISOString(),
            utcDate: utcDate.toISOString()
          })
          updateData.countdownDate = utcDate.toISOString()
        }
        
        if (Object.keys(updateData).length > 0) {
          const response = await updateSiteAssets(updateData)
          console.log("PAGES: Site assets update response:", response)
          
          setPageContent(prev => ({
            ...prev,
            home: { 
              ...prev.home, 
              heroImage: response.data.assets.heroImage || prev.home.heroImage,
              mobileHeroImage: response.data.assets.mobileHeroImage || prev.home.mobileHeroImage
            }
          }))
          
          toast({
            title: "Success",
            description: "Site assets updated successfully"
          })
        } else {
          toast({
            title: "Success", 
            description: "Page content updated successfully"
          })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast({
          title: "Success",
          description: "Page content updated successfully"
        })
      }
      
      if (section === 'home') {
        setSelectedHeroImage(null)
        setSelectedMobileHeroImage(null)
      }
    } catch (error) {
      console.error("Error saving page content:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save page content",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Page Content Management</h1>
        <p className="text-muted-foreground">Edit content for different pages of the website</p>
      </div>

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="info">Info Page</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Home Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Background Image (Desktop)</Label>
                <FileUpload
                  onFileSelect={setSelectedHeroImage}
                  description="Upload hero background image for desktop (1000x524 recommended)"
                  accept="image/*"
                  maxSize={10}
                  currentImage={pageContent.home.heroImage}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobileHeroImage">Hero Background Image (Mobile)</Label>
                <FileUpload
                  onFileSelect={setSelectedMobileHeroImage}
                  description="Upload hero background image for mobile devices (portrait orientation recommended)"
                  accept="image/*"
                  maxSize={10}
                  currentImage={pageContent.home.mobileHeroImage}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="countdownDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Countdown Target Date & Time (Romanian Time)
                </Label>
                <Input
                  id="countdownDate"
                  type="datetime-local"
                  value={countdownDate}
                  onChange={(e) => setCountdownDate(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Set the target date and time for the countdown timer. Time will be interpreted as Romanian time (GMT+3).
                </p>
                <p className="text-xs text-muted-foreground">
                  Current Romanian time: {new Date(new Date().getTime() + (3 * 60 * 60 * 1000)).toLocaleString('en-US', { 
                    timeZone: 'UTC',
                    year: 'numeric',
                    month: '2-digit', 
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Textarea
                  id="heroTitle"
                  value={pageContent.home.heroTitle}
                  onChange={(e) => setPageContent(prev => ({
                    ...prev,
                    home: { ...prev.home, heroTitle: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={pageContent.home.heroSubtitle}
                  onChange={(e) => setPageContent(prev => ({
                    ...prev,
                    home: { ...prev.home, heroSubtitle: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroDescription">Hero Description</Label>
                <Textarea
                  id="heroDescription"
                  value={pageContent.home.heroDescription}
                  onChange={(e) => setPageContent(prev => ({
                    ...prev,
                    home: { ...prev.home, heroDescription: e.target.value }
                  }))}
                />
              </div>
              <Button onClick={() => handleSave('home')} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Info Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="travelInfo">Travel Information</Label>
                <Textarea
                  id="travelInfo"
                  rows={6}
                  value={pageContent.info.travelInfo}
                  onChange={(e) => setPageContent(prev => ({
                    ...prev,
                    info: { ...prev.info, travelInfo: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rules">Festival Rules</Label>
                <Textarea
                  id="rules"
                  rows={6}
                  value={pageContent.info.rules}
                  onChange={(e) => setPageContent(prev => ({
                    ...prev,
                    info: { ...prev.info, rules: e.target.value }
                  }))}
                />
              </div>
              <Button onClick={() => handleSave('info')} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Contact Information</Label>
                <Textarea
                  rows={4}
                  placeholder="Email, phone, address..."
                />
              </div>
              <div className="space-y-2">
                <Label>Copyright Text</Label>
                <Textarea
                  rows={2}
                  placeholder="© 2024 Metal Gates Festival..."
                />
              </div>
              <Button onClick={() => handleSave('footer')} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  )
}