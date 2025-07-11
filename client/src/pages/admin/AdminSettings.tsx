
import { useState, useEffect } from "react"
import {
  FaSave,
  FaExternalLinkAlt,
  FaCode,
  FaGlobe,
  FaCalendarAlt,
  FaTimes,
  FaImage,
  FaPlus,
  FaTrash
} from "react-icons/fa";
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

interface Festival {
  _id: string;
  name: string;
  dates: string;
  description: string;
  location: string;
  ticketUrl: string;
  isActive: boolean;
}

interface ContactEmail {
  purpose: string;
  email: string;
}

interface SiteAssets {
  logo: string | null;
  heroImage: string | null;
  mobileHeroImage: string | null;
  bannerText: string;
  contactEmails: ContactEmail[];
  copyright: string;
  gtmId: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

interface Settings {
  festival: {
    name: string;
    dates: string;
    description: string;
    location: string;
    ticketUrl: string;
    isActive: boolean;
  };
  general: {
    bannerText: string;
    contactEmails: ContactEmail[];
    copyright: string;
  };
  tracking: {
    gtmId: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export function AdminSettings() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentFestival, setCurrentFestival] = useState<Festival | null>(null)
  const [siteAssets, setSiteAssets] = useState<Partial<SiteAssets>>({})
  const { toast } = useToast()

  const [settings, setSettings] = useState<Settings>({
    festival: {
      name: "",
      dates: "",
      description: "",
      location: "",
      ticketUrl: "",
      isActive: true
    },
    general: {
      bannerText: "",
      contactEmails: [],
      copyright: ""
    },
    tracking: {
      gtmId: ""
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

      const activeFestival = festivals.find((f: Festival) => f.isActive) || festivals[0]

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
      const data = await getSiteAssets()
      setSiteAssets(data.assets || {})
      
      if (data.assets) {
        setSettings(prev => ({
          ...prev,
          general: {
            contactEmails: data.assets.contactEmails || [],
            bannerText: data.assets.bannerText || "",
            copyright: data.assets.copyright || "© 2024 Metal Gates Festival. All rights reserved."
          },
          tracking: {
            gtmId: data.assets.gtmId || ""
          },
          social: {
            facebook: data.assets.facebook || "",
            instagram: data.assets.instagram || "",
            youtube: data.assets.youtube || "",
          }
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
        } else {
          const newFestival = await createFestival(settings.festival)
          setCurrentFestival(newFestival.data.festival)
        }
        toast({ title: "Success", description: "Festival settings updated." })
        await loadFestivalSettings()
      } else {
        let dataToSave = {}
        if (section === 'general') dataToSave = settings.general
        if (section === 'tracking') dataToSave = settings.tracking
        if (section === 'social') dataToSave = settings.social
        
        await updateSiteAssets(dataToSave)
        toast({ title: "Success", description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated.` })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpdate = async (section: 'logo' | 'heroImage' | 'mobileHeroImage', file: File | null) => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append(section, file);
      } else {
        // Handle image removal
        formData.append(section, '');
      }
      
      await updateSiteAssets(formData);
      
      toast({
        title: "Success",
        description: `${section.replace(/([A-Z])/g, ' $1')} updated successfully.`,
      });
      await loadSiteAssets();
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${section.replace(/([A-Z])/g, ' $1')}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    section: keyof Settings,
    field: string,
    value: string | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }))
  }

  const handleEmailChange = (
    index: number,
    field: "purpose" | "email",
    value: string
  ) => {
    const updatedEmails = [...settings.general.contactEmails]
    updatedEmails[index][field] = value
    handleInputChange("general", "contactEmails", updatedEmails as any)
  }

  const addEmail = () => {
    const updatedEmails = [...settings.general.contactEmails, { purpose: "", email: "" }]
    handleInputChange("general", "contactEmails", updatedEmails as any)
  }

  const removeEmail = (index: number) => {
    const updatedEmails = settings.general.contactEmails.filter((_, i) => i !== index)
    handleInputChange("general", "contactEmails", updatedEmails as any)
  }

  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Tabs defaultValue="festival">
        <TabsList>
          <TabsTrigger value="festival">Festival</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="festival">
          <Card>
            <CardHeader>
              <CardTitle>Festival Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="festivalName">Festival Name</Label>
                <Input
                  id="festivalName"
                  value={settings.festival.name}
                  onChange={(e) =>
                    handleInputChange("festival", "name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dates">Dates</Label>
                <Input
                  id="dates"
                  value={settings.festival.dates}
                  onChange={(e) =>
                    handleInputChange("festival", "dates", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.festival.description}
                  onChange={(e) =>
                    handleInputChange("festival", "description", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={settings.festival.location}
                  onChange={(e) =>
                    handleInputChange("festival", "location", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketUrl">Ticket URL</Label>
                <Input
                  id="ticketUrl"
                  value={settings.festival.ticketUrl}
                  onChange={(e) =>
                    handleInputChange("festival", "ticketUrl", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={settings.festival.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("festival", "isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Set as Active Festival</Label>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSave('festival')} disabled={saving}>
                <FaSave className="mr-2" />
                {saving ? "Saving..." : "Save Festival Settings"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bannerText">Banner Text</Label>
                <Input
                  id="bannerText"
                  value={settings.general.bannerText}
                  onChange={(e) => handleInputChange("general", "bannerText", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Emails</Label>
                {settings.general.contactEmails.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Purpose"
                      value={contact.purpose}
                      onChange={(e) => handleEmailChange(index, "purpose", e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={contact.email}
                      onChange={(e) => handleEmailChange(index, "email", e.target.value)}
                    />
                    <Button variant="destructive" size="sm" onClick={() => removeEmail(index)}>
                      <FaTrash />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEmail}>
                  <FaPlus className="mr-2" />
                  Add Email
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                  id="copyright"
                  value={settings.general.copyright}
                  onChange={(e) => handleInputChange("general", "copyright", e.target.value)}
                />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSave('general')} disabled={saving}>
                <FaSave className="mr-2" />
                {saving ? "Saving..." : "Save General Settings"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Image Assets</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Logo</Label>
                <FileUpload
                  onFileSelect={(file) => handleFileUpdate("logo", file)}
                  currentImage={siteAssets.logo}
                  description="Upload Logo"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Image</Label>
                <FileUpload
                  onFileSelect={(file) => handleFileUpdate("heroImage", file)}
                  currentImage={siteAssets.heroImage}
                  description="Upload Hero Image"
                />
              </div>
              <div className="space-y-2">
                <Label>Mobile Hero Image</Label>
                <FileUpload
                  onFileSelect={(file) => handleFileUpdate("mobileHeroImage", file)}
                  currentImage={siteAssets.mobileHeroImage}
                  description="Upload Mobile Hero"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Tracking & SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gtmId">Google Tag Manager ID</Label>
                <Input
                  id="gtmId"
                  value={settings.tracking.gtmId}
                  onChange={(e) =>
                    handleInputChange("tracking", "gtmId", e.target.value)
                  }
                  placeholder="e.g., GTM-XXXXXXX"
                />
                <p className="text-sm text-muted-foreground">
                  Enter your Google Tag Manager ID.
                </p>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSave('tracking')} disabled={saving}>
                <FaSave className="mr-2" />
                {saving ? "Saving..." : "Save Tracking Settings"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={settings.social.facebook}
                  onChange={(e) => handleInputChange("social", "facebook", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={settings.social.instagram}
                  onChange={(e) => handleInputChange("social", "instagram", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={settings.social.youtube}
                  onChange={(e) => handleInputChange("social", "youtube", e.target.value)}
                />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSave('social')} disabled={saving}>
                <FaSave className="mr-2" />
                {saving ? "Saving..." : "Save Social Media Links"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}