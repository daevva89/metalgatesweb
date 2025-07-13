import { useState, useEffect } from "react";
import { FaMapPin, FaShieldAlt, FaQuestionCircle, FaCar, FaPlane, FaHotel } from "react-icons/fa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getInfoPage } from "@/api/festival";
import { getSiteAssets } from "@/api/festival";
import { Helmet } from "react-helmet";

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
    importantGuidelines: string[];
    allowedItems: string[];
    prohibitedItems: string[];
    securityNote: string;
  };
  faq: FaqItem[];
}

export function Info() {
  const [infoPageData, setInfoPageData] = useState<InfoPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteAssets, setSiteAssets] = useState<any>({});

  useEffect(() => {
    const loadInfoPageData = async () => {
      try {
        const data = await getInfoPage();
        setInfoPageData(data);
      } catch (error) {
        console.error("Failed to load info page data", error);
      } finally {
        setLoading(false);
      }
    };
    loadInfoPageData();
    getSiteAssets().then(data => setSiteAssets(data.assets || {}));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!infoPageData) {
    return <div>Info not available.</div>;
  }

  const title = siteAssets.seoTitles?.info || "Info - Metal Gates Festival";
  const description = siteAssets.seoDescriptions?.info || "Find all the information you need about Metal Gates Festival.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="container mx-auto px-4 space-y-12 pt-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Location & Map */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Location</h2>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaMapPin className="h-5 w-5 text-primary" />
                  {infoPageData.location.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {infoPageData.location.address}
                </p>
                {infoPageData.location.mapEmbedUrl ? (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src={infoPageData.location.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <FaMapPin className="h-12 w-12 text-primary mx-auto" />
                      <p className="text-muted-foreground">Map will be available soon</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Travel Information */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Travel Information</h2>
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaPlane className="h-5 w-5 text-primary" />
                    By Air
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {infoPageData.travel.byAir}
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaCar className="h-5 w-5 text-primary" />
                    By Car
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {infoPageData.travel.byCar}
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaHotel className="h-5 w-5 text-primary" />
                    Accommodation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {infoPageData.travel.accommodation}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Festival Rules */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Festival Rules</h2>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaShieldAlt className="h-5 w-5 text-primary" />
                Festival Rules & Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {infoPageData.rules.importantGuidelines && infoPageData.rules.importantGuidelines.length > 0 && (
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-primary">Important Guidelines</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    {infoPageData.rules.importantGuidelines.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">✓ Allowed Items</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {infoPageData.rules.allowedItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-400 mb-2">✗ Prohibited Items</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {infoPageData.rules.prohibitedItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {infoPageData.rules.securityNote}
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
                <FaQuestionCircle className="h-5 w-5 text-primary" />
                Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {infoPageData.faq.map((item, index) => (
                  <AccordionItem key={item._id || index} value={`item-${index}`}>
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
    </>
  )
}