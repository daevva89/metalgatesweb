import { useState } from "react"
import { Save, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/useToast"

export function AdminPages() {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [pageContent, setPageContent] = useState({
    home: {
      heroTitle: "Metal Gates Festival",
      heroSubtitle: "June 15-17, 2024",
      heroDescription: "The ultimate metal experience in Bucharest"
    },
    info: {
      travelInfo: "Henri Coandă International Airport (OTP) is 45 minutes from the venue...",
      rules: "Outside food and beverages are not permitted...",
      faq: "What time does the festival start each day?"
    }
  })

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      console.log("Saving page content:", section)
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Page content updated successfully"
      })
    } catch (error) {
      console.error("Error saving page content:", error)
      toast({
        title: "Error",
        description: "Failed to save page content",
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="info">Info Page</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="banner">Banner</TabsTrigger>
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

        <TabsContent value="banner" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Promotional Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Banner Text</Label>
                <Textarea
                  rows={3}
                  placeholder="🎸 Early Bird Tickets Available Now..."
                />
              </div>
              <Button onClick={() => handleSave('banner')} disabled={saving}>
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