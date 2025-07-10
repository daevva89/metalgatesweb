import { useState, useEffect } from "react"
import { FaSave, FaFileAlt, FaCalendarAlt } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/useToast"
import { getSiteAssets, updateSiteAssets, getInfoPage, updateInfoPage } from "@/api/festival"
import { FaPlus, FaTrash } from "react-icons/fa"

interface UpdateData {
  heroImage?: File
  mobileHeroImage?: File
  countdownDate?: string
}

interface FaqItem {
  question: string;
  answer: string;
  _id?: string;
}

interface InfoPageData {
  location: {
    title: string;
    address: string;
    mapEmbedUrl: string;
  };
  travel: {
    byAir: string;
    byCar: string;
    accommodation: string;
  };
  rules: {
    allowedItems: string[];
    prohibitedItems: string[];
    securityNote: string;
  };
  faq: FaqItem[];
}


export function AdminPages() {
  const [saving, setSaving] = useState(false)
  const [selectedHeroImage, setSelectedHeroImage] = useState<File | null>(null)
  const [selectedMobileHeroImage, setSelectedMobileHeroImage] = useState<File | null>(null)
  const [countdownDate, setCountdownDate] = useState<string>("")
  const { toast } = useToast()

  const [infoPageData, setInfoPageData] = useState<InfoPageData | null>(null);

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
    loadInfoPageData()
  }, [])

  const loadInfoPageData = async () => {
    try {
      const data = await getInfoPage();
      setInfoPageData(data);
    } catch (error) {
      console.error("PAGES: Error loading info page data:", error);
      toast({
        title: "Error",
        description: "Failed to load info page content.",
        variant: "destructive",
      });
    }
  }

  const loadHeroImage = async () => {
    try {
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
      // setLoading(false) // Removed as per edit hint
    }
  }

  const handleInfoPageChange = (section: keyof InfoPageData, field: string, value: any) => {
    if (!infoPageData) return;
    
    setInfoPageData(prev => {
      if (!prev) return null;
      
      const newInfoPageData = { ...prev };
      (newInfoPageData[section] as any)[field] = value;
      return newInfoPageData;
    });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    if (!infoPageData) return;
    
    const newFaq = [...infoPageData.faq];
    newFaq[index][field] = value;
    setInfoPageData({ ...infoPageData, faq: newFaq });
  };

  const addFaqItem = () => {
    if (!infoPageData) return;

    const newFaq = [...infoPageData.faq, { question: '', answer: '' }];
    setInfoPageData({ ...infoPageData, faq: newFaq });
  };

  const removeFaqItem = (index: number) => {
    if (!infoPageData) return;

    const newFaq = infoPageData.faq.filter((_, i) => i !== index);
    setInfoPageData({ ...infoPageData, faq: newFaq });
  };


  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      console.log("Saving page content:", section)
      
      if (section === 'home') {
        const formData = new FormData()
        
        if (selectedHeroImage) {
          console.log("PAGES: Uploading new desktop hero image")
          formData.append("heroImage", selectedHeroImage)
        }
        
        if (selectedMobileHeroImage) {
          console.log("PAGES: Uploading new mobile hero image")
          formData.append("mobileHeroImage", selectedMobileHeroImage)
        }
        
        if (countdownDate) {
          const inputDate = new Date(countdownDate)
          const utcDate = new Date(inputDate.getTime() - (3 * 60 * 60 * 1000))
          console.log("PAGES: Updating countdown date:", {
            input: countdownDate,
            utcDate: utcDate.toISOString()
          })
          formData.append("countdownDate", utcDate.toISOString())
        }
        
        if (formData.has("heroImage") || formData.has("mobileHeroImage") || formData.has("countdownDate")) {
          const response = await updateSiteAssets(formData)
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
            title: "No Changes", 
            description: "No new images or countdown date to save."
          })
        }
      } else if (section === 'info') {
        if (!infoPageData) {
          toast({
            title: "Error",
            description: "Info page data not loaded yet.",
            variant: "destructive",
          });
          return;
        }
        await updateInfoPage(infoPageData);
        toast({
          title: "Success",
          description: "Info page content updated successfully"
        });
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="info">Info Page</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaFileAlt className="h-5 w-5" />
                Home Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Background Image (Desktop)</Label>
                <FileUpload
                  onFileSelect={setSelectedHeroImage}
                  currentImage={pageContent.home.heroImage}
                  description="Upload desktop hero image"
                  accept="image/*"
                  maxSize={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobileHeroImage">Hero Background Image (Mobile)</Label>
                <FileUpload
                  onFileSelect={setSelectedMobileHeroImage}
                  currentImage={pageContent.home.mobileHeroImage}
                  description="Upload mobile hero image"
                  accept="image/*"
                  maxSize={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="countdownDate" className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4" />
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
                <FaSave className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          {infoPageData ? (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Info Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location Section */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="text-xl font-semibold">Location</h3>
                  <div className="space-y-2">
                    <Label htmlFor="locationTitle">Title</Label>
                    <Input id="locationTitle" value={infoPageData.location.title} onChange={(e) => handleInfoPageChange('location', 'title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locationAddress">Address</Label>
                    <Input id="locationAddress" value={infoPageData.location.address} onChange={(e) => handleInfoPageChange('location', 'address', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                    <Input id="mapEmbedUrl" value={infoPageData.location.mapEmbedUrl} onChange={(e) => handleInfoPageChange('location', 'mapEmbedUrl', e.target.value)} />
                  </div>
                </div>

                {/* Travel Section */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="text-xl font-semibold">Travel Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="travelByAir">By Air</Label>
                    <Textarea id="travelByAir" value={infoPageData.travel.byAir} onChange={(e) => handleInfoPageChange('travel', 'byAir', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelByCar">By Car</Label>
                    <Textarea id="travelByCar" value={infoPageData.travel.byCar} onChange={(e) => handleInfoPageChange('travel', 'byCar', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelAccommodation">Accommodation</Label>
                    <Textarea id="travelAccommodation" value={infoPageData.travel.accommodation} onChange={(e) => handleInfoPageChange('travel', 'accommodation', e.target.value)} />
                  </div>
                </div>

                {/* Rules Section */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="text-xl font-semibold">Festival Rules</h3>
                  <div className="space-y-2">
                    <Label htmlFor="allowedItems">Allowed Items (one per line)</Label>
                    <Textarea id="allowedItems" value={infoPageData.rules.allowedItems.join('\n')} onChange={(e) => handleInfoPageChange('rules', 'allowedItems', e.target.value.split('\n'))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prohibitedItems">Prohibited Items (one per line)</Label>
                    <Textarea id="prohibitedItems" value={infoPageData.rules.prohibitedItems.join('\n')} onChange={(e) => handleInfoPageChange('rules', 'prohibitedItems', e.target.value.split('\n'))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="securityNote">Security Note</Label>
                    <Input id="securityNote" value={infoPageData.rules.securityNote} onChange={(e) => handleInfoPageChange('rules', 'securityNote', e.target.value)} />
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">FAQ</h3>
                  {infoPageData.faq.map((item, index) => (
                    <div key={item._id || index} className="space-y-2 border p-4 rounded-md">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => removeFaqItem(index)}>
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`faqQuestion-${index}`}>Question</Label>
                        <Input id={`faqQuestion-${index}`} value={item.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`faqAnswer-${index}`}>Answer</Label>
                        <Textarea id={`faqAnswer-${index}`} value={item.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} />
                      </div>
                    </div>
                  ))}
                  <Button onClick={addFaqItem}>
                    <FaPlus className="mr-2 h-4 w-4" />
                    Add FAQ Item
                  </Button>
                </div>

                <Button onClick={() => handleSave('info')} disabled={saving}>
                  <FaSave className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>Loading...</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}