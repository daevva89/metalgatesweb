import { useState, useEffect } from "react"
import { FaCalendarAlt, FaEnvelope, FaPhone } from "react-icons/fa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteAssets } from "@/api/festival"

export function ComingSoon() {
  const [contactInfo, setContactInfo] = useState({
    contactEmail: "",
    phoneNumber: ""
  })

  useEffect(() => {
    loadContactInfo()
  }, [])

  const loadContactInfo = async () => {
    try {
      const data = await getSiteAssets()
      setContactInfo({
        contactEmail: data.assets?.contactEmail || "",
        phoneNumber: data.assets?.phoneNumber || ""
      })
    } catch (error) {
      console.error("ComingSoon: Error loading contact info:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
            <FaCalendarAlt className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-white">
            Coming Soon
          </CardTitle>
          <p className="text-xl text-purple-200">
            We're preparing something amazing for you!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-300">
            Our next festival edition is currently being planned. 
            Stay tuned for updates on dates, lineup, and tickets.
          </p>
          
          {(contactInfo.contactEmail || contactInfo.phoneNumber) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Get in Touch</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {contactInfo.contactEmail && (
                  <div className="flex items-center gap-2 text-purple-200">
                    <FaEnvelope className="h-5 w-5" />
                    <span>{contactInfo.contactEmail}</span>
                  </div>
                )}
                {contactInfo.phoneNumber && (
                  <div className="flex items-center gap-2 text-purple-200">
                    <FaPhone className="h-5 w-5" />
                    <span>{contactInfo.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-6">
            <p className="text-sm text-gray-400">
              Follow us on social media for the latest updates
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}