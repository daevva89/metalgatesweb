import { MapPin, Clock, Shield, HelpCircle, Car, Plane, Hotel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Info() {
  const faqItems = [
    {
      question: "What time does the festival start each day?",
      answer: "Gates open at 4:00 PM each day, with the first band starting at 5:00 PM. The festival runs until 2:00 AM."
    },
    {
      question: "Can I bring my own food and drinks?",
      answer: "Outside food and beverages are not permitted. We have a variety of food vendors and bars available inside the venue."
    },
    {
      question: "Is there parking available?",
      answer: "Yes, there are several parking options near Quantic Club. We recommend arriving early as spaces fill up quickly."
    },
    {
      question: "What items are prohibited?",
      answer: "Prohibited items include weapons, illegal substances, professional cameras, outside food/drinks, and glass containers. Full list available on your ticket."
    },
    {
      question: "Is the festival accessible for people with disabilities?",
      answer: "Yes, Quantic Club is fully accessible. Please contact us in advance if you need special accommodations."
    },
    {
      question: "What happens if it rains?",
      answer: "The festival is held indoors at Quantic Club, so weather will not affect the event."
    }
  ]

  return (
    <div className="container mx-auto px-4 space-y-12 pt-8">
      {/* Location Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Location</h2>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Quantic Club, Bucharest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Strada Blanari 14, Bucharest 030167, Romania
            </p>

            {/* Map Placeholder */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-primary mx-auto" />
                <p className="text-muted-foreground">Interactive Google Maps</p>
                <p className="text-sm text-muted-foreground">Quantic Club, Bucharest</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Travel Information */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Travel Information</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" />
                By Air
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Henri Coandă International Airport (OTP) is 45 minutes from the venue.
                Take the express bus or taxi to reach the city center.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                By Car
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Multiple parking options available near the venue.
                We recommend using public parking lots as street parking is limited.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-primary" />
                Accommodation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Many hotels within walking distance of the venue.
                Book early as accommodation fills up quickly during the festival.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Festival Rules */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Festival Rules</h2>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Important Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">✓ Allowed Items</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Small personal bags</li>
                  <li>• Mobile phones</li>
                  <li>• Medication (with prescription)</li>
                  <li>• Earplugs</li>
                  <li>• Cash and cards</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-red-400 mb-2">✗ Prohibited Items</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Outside food and beverages</li>
                  <li>• Professional cameras</li>
                  <li>• Glass containers</li>
                  <li>• Weapons of any kind</li>
                  <li>• Illegal substances</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                All attendees are subject to security screening. Please arrive early to allow time for entry procedures.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}