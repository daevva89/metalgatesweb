import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEnvelope, FaPaperPlane } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitContactForm, getSiteAssets } from "@/api/festival"
import { useToast } from "@/hooks/useToast"
import { useEffect } from "react"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface SubmitContactFormResponse {
  message: string
}

interface ContactEmail {
  purpose: string
  email: string
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactEmails, setContactEmails] = useState<ContactEmail[]>([])
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>()

  useEffect(() => {
    loadContactInfo()
  }, [])

  const loadContactInfo = async () => {
    try {
      const data = await getSiteAssets()
      setContactEmails(data.assets?.contactEmails || [])
    } catch (error) {
      console.error("Contact: Error loading contact info:", error)
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      console.log("Submitting contact form:", data)
      const response = await submitContactForm(data)
      toast({
        title: "Message sent!",
        description: (response as SubmitContactFormResponse).message,
      })
      reset()
      console.log("Contact form submitted successfully")
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 space-y-12 pt-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Get in Touch</h2>

          <div className="space-y-4">
            {contactEmails.map((contact, index) => (
              <Card key={index} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <FaEnvelope className="h-6 w-6 text-primary mt-1" />
                  <div>
                      <h3 className="font-semibold mb-1">{contact.purpose}</h3>
                      <p className="text-muted-foreground">{contact.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Send us a Message</h2>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      className="bg-background/50"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="bg-background/50"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    {...register("subject", { required: "Subject is required" })}
                    className="bg-background/50"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-400">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    {...register("message", { required: "Message is required" })}
                    className="bg-background/50 resize-none"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}