import { useState, useEffect } from "react"
import { Save, ExternalLink, Code, Globe, Mail, Calendar, Upload, X, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/useToast"
import { getFestivals, createFestival, updateFestival, getSiteAssets, updateSiteAssets } from "@/api/festival"

export function AdminSettings() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentFestival, setCurrentFestival] = useState(null)
  const [siteAssets, setSiteAssets] = useState({ logo: null })
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    festival: {
      name: "",
      dates: "",
      description: "",
      location: "",
      ticketUrl: "",
      isActive: true
    },
    general: {
      contactEmail: "",
      phoneNumber: "",
      bannerText: ""
    },
    tracking: {
      googleAnalytics: "",
      metaPixel: ""
    },
    social: {
      facebook: "",
      instagram: "",
      youtube: ""
    }
  })

  useEffect(() => {
    loadFestivalSettings()
    loadSiteAssets()
  }, [])

  const loadFestivalSettings = async () => {
    try {
      setLoading(true)
      const data = await getFestivals()
      const festivals = data.festivals || []

      const activeFestival = festivals.find(f => f.isActive) || festivals[0]

      if (activeFestival) {
        setCurrentFestival(activeFestival)
        setSettings(prev => ({
          ...prev,
          festival: {
            name: activeFestival.name || "",
            dates: activeFestival.dates || "",
            description: activeFestival.description || "",
            location: activeFestival.location || "",
            ticketUrl: activeFestival.ticketUrl || "",
            isActive: activeFestival.isActive !== undefined ? activeFestival.isActive : true
          }
        }))
      }
    } catch (error) {
      console.error("Error loading festival settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSiteAssets = async () => {
    try {
      console.log("AdminSettings: Loading site assets...")
      const data = await getSiteAssets()
      console.log("AdminSettings: Raw data from getSiteAssets:", data)
      console.log("AdminSettings: Assets object:", data.assets)
      console.log("AdminSettings: General settings from API:", {
        bannerText: data.assets?.bannerText,
        contactEmail: data.assets?.contactEmail,
        phoneNumber: data.assets?.phoneNumber
      })
      
      setSiteAssets(data.assets || { logo: null })
      
      if (data.assets) {
        const newGeneralSettings = {
          contactEmail: data.assets.contactEmail || "",
          phoneNumber: data.assets.phoneNumber || "",
          bannerText: data.assets.bannerText || ""
        }
        
        console.log("AdminSettings: Setting general settings to:", newGeneralSettings)
        
        setSettings(prev => ({
          ...prev,
          general: newGeneralSettings
        }))
      }
    } catch (error) {
      console.error("AdminSettings: Error loading site assets:", error)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      if (section === 'festival') {
        if (currentFestival) {
          await updateFestival(currentFestival._id, settings.festival)
          toast({
            title: "Success",
            description: "Festival updated successfully"
          })
        } else {
          const newFestival = await createFestival(settings.festival)
          setCurrentFestival(newFestival.data.festival)
          toast({
            title: "Success",
            description: "Festival created successfully"
          })
        }
      } else if (section === 'general') {
        console.log("AdminSettings: Saving general settings...")
        console.log("AdminSettings: Current general settings state:", settings.general)
        
        const dataToSave = {
          bannerText: settings.general.bannerText,
          contactEmail: settings.general.contactEmail,
          phoneNumber: settings.general.phoneNumber
        }
        
        console.log("AdminSettings: Data being sent to API:", dataToSave)
        
        const response = await updateSiteAssets(dataToSave)
        
        console.log("AdminSettings: Response from updateSiteAssets:", response)
        console.log("AdminSettings: Response assets:", response.data.assets)
        
        setSiteAssets(response.data.assets)
        
        console.log("AdminSettings: General settings saved successfully")
        
        toast({
          title: "Success",
          description: "General settings updated successfully"
        })
      } else {
        console.log("Saving settings:", section)
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast({
          title: "Success",
          description: "Settings updated successfully"
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (file: string) => {
    try {
      console.log("AdminSettings: Starting logo upload, file length:", file ? file.length : 'undefined')
      console.log("AdminSettings: File starts with:", file ? file.substring(0, 50) : 'file is undefined')
      setSaving(true)
      const response = await updateSiteAssets({ logo: file })
      console.log("AdminSettings: Logo upload response:", response)
      setSiteAssets(response.data.assets)
      toast({
        title: "Success",
        description: "Logo updated successfully"
      })
    } catch (error) {
      console.error("AdminSettings: Error uploading logo:", error)
      console.error("AdminSettings: Error message:", error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }



  const handleRemoveLogo = async () => {
    try {
      setSaving(true)
      const response = await updateSiteAssets({ logo: null })
      setSiteAssets(response.data.assets)
      toast({
        title: "Success",
        description: "Logo removed successfully"
      })
    } catch (error) {
      console.error("Error removing logo:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove logo",
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure site settings and integrations</p>
      </div>

      <Tabs defaultValue="festival" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="festival">Festival</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="festival" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Festival Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading festival settings...</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="festivalName">Festival Name</Label>
                    <Input
                      id="festivalName"
                      value={settings.festival.name}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        festival: { ...prev.festival, name: e.target.value }
                      }))}
                      placeholder="Festival name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="festivalDates">Festival Dates</Label>
                    <Input
                      id="festivalDates"
                      value={settings.festival.dates}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        festival: { ...prev.festival, dates: e.target.value }
                      }))}
                      placeholder="Festival dates"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="festivalDescription">Description</Label>
                    <Textarea
                      id="festivalDescription"
                      rows={3}
                      value={settings.festival.description}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        festival: { ...prev.festival, description: e.target.value }
                      }))}
                      placeholder="Festival description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="festivalLocation">Location</Label>
                    <Input
                      id="festivalLocation"
                      value={settings.festival.location}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        festival: { ...prev.festival, location: e.target.value }
                      }))}
                      placeholder="Festival location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="festivalTicketUrl">Ticket URL</Label>
                    <Input
                      id="festivalTicketUrl"
                      value={settings.festival.ticketUrl}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        festival: { ...prev.festival, ticketUrl: e.target.value }
                      }))}
                      placeholder="Ticket purchase URL"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="festivalActive"
                      checked={settings.festival.isActive}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        festival: { ...prev.festival, isActive: checked }
                      }))}
                    />
                    <Label htmlFor="festivalActive">Festival Active</Label>
                    <span className="text-sm text-muted-foreground ml-2">
                      (When off, visitors will see a generic "coming soon" page)
                    </span>
                  </div>

                  <Button
                    onClick={() => handleSave('festival')}
                    disabled={saving || !settings.festival.name || !settings.festival.dates || !settings.festival.description || !settings.festival.location}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Festival Settings"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Site Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Section */}
              <div className="space-y-4">
                <div>
                  <Label>Site Logo</Label>
                  <p className="text-sm text-muted-foreground">Upload your festival logo (recommended: 200x60px, PNG format)</p>
                </div>
                
                {siteAssets.logo ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={siteAssets.logo} 
                        alt="Current Logo" 
                        className="h-12 max-w-48 object-contain"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Current Logo</p>
                        <p className="text-xs text-muted-foreground">Click to replace or remove</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                        disabled={saving}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <FileUpload
                      onFileSelect={handleLogoUpload}
                      accept="image/*"
                      maxSize={5}
                      description="Replace logo"
                    />
                  </div>
                ) : (
                  <FileUpload
                    onFileSelect={handleLogoUpload}
                    accept="image/*"
                    maxSize={5}
                    description="Upload your festival logo"
                  />
                )}
              </div>


            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, contactEmail: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={settings.general.phoneNumber}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, phoneNumber: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerText">Promotional Banner Text</Label>
                <Textarea
                  id="bannerText"
                  rows={3}
                  value={settings.general.bannerText}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, bannerText: e.target.value }
                  }))}
                  placeholder="🎸 Early Bird Tickets Available Now! Limited Time Offer 🎸"
                />
                <p className="text-sm text-muted-foreground">This banner appears at the top of all pages</p>
              </div>

              <Button onClick={() => handleSave('general')} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tracking Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalytics">Google Analytics Code</Label>
                <Textarea
                  id="googleAnalytics"
                  rows={4}
                  value={settings.tracking.googleAnalytics}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    tracking: { ...prev.tracking, googleAnalytics: e.target.value }
                  }))}
                  placeholder="<!-- Google Analytics code -->"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaPixel">Meta Pixel Code</Label>
                <Textarea
                  id="metaPixel"
                  rows={4}
                  value={settings.tracking.metaPixel}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    tracking: { ...prev.tracking, metaPixel: e.target.value }
                  }))}
                  placeholder="<!-- Meta Pixel code -->"
                />
              </div>

              <Button onClick={() => handleSave('tracking')} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={settings.social.facebook}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social: { ...prev.social, facebook: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={settings.social.instagram}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social: { ...prev.social, instagram: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={settings.social.youtube}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social: { ...prev.social, youtube: e.target.value }
                  }))}
                />
              </div>

              <Button onClick={() => handleSave('social')} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Backup</Label>
                <div className="flex gap-2">
                  <Button variant="outline">Download Backup</Button>
                  <Button variant="outline">Restore Backup</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cache Management</Label>
                <Button variant="outline">Clear Cache</Button>
              </div>

              <div className="space-y-2">
                <Label>Database</Label>
                <Button variant="outline">Export Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}