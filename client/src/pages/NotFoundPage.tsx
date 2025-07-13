import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { getSiteAssets } from "@/api/festival";

export function NotFoundPage() {
  const navigate = useNavigate()
  const [siteAssets, setSiteAssets] = useState<any>({});
  useEffect(() => {
    getSiteAssets().then(data => setSiteAssets(data.assets || {}));
  }, []);
  const title = siteAssets.seoTitles?.notFound || "404 - Page Not Found - Metal Gates Festival";
  const description = siteAssets.seoDescriptions?.notFound || "Page not found on Metal Gates Festival website.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl glass-card text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-red-600 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-white">
              404 - Page Not Found
            </CardTitle>
            <p className="text-xl text-red-200">
              Oops! The page you are looking for does not exist.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-300">
              It might have been moved or deleted. Please check the URL or go back to the homepage.
            </p>
            
            <div className="pt-6">
              <Button 
                onClick={() => navigate("/")} 
                className="bg-primary hover:bg-primary/90"
                size="lg"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Go Back Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 