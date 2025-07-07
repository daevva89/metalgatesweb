import { FaUsers, FaCalendarAlt, FaCommentDots, FaChartLine, FaPlus, FaEdit, FaEye } from "react-icons/fa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getContactSubmissions,
  getNews,
  getLineup,
  getVisitorStats
} from "@/api/festival";

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface NewsArticle {
  _id: string;
  title: string;
  publishedAt: string;
}

interface Band {
  _id: string;
  name: string;
  createdAt: string;
}

type Activity = {
  type: "contact" | "news" | "band";
  date: Date;
  content: string;
};

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    contactMessages: 0,
    ticketsSold: 1847, // This can be made dynamic later
    visitorChange: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [
          contactData,
          newsData,
          lineupData,
          visitorStats
        ] = await Promise.all([
          getContactSubmissions(),
          getNews(),
          getLineup(),
          getVisitorStats()
        ]);

        const contactActivities: Activity[] = (contactData.contacts || []).map(
          (c: ContactSubmission) => ({
            type: "contact",
            date: new Date(c.createdAt),
            content: `New message from ${c.name}: "${c.subject}"`
          })
        );

        const newsActivities: Activity[] = (newsData.articles || []).map(
          (a: NewsArticle) => ({
            type: "news",
            date: new Date(a.publishedAt),
            content: `News article published: "${a.title}"`
          })
        );

        const bandActivities: Activity[] = (lineupData.bands || []).map(
          (b: Band) => ({
            type: "band",
            date: new Date(b.createdAt),
            content: `New band added to lineup: ${b.name}`
          })
        );

        const allActivities = [
          ...contactActivities,
          ...newsActivities,
          ...bandActivities
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        setActivities(allActivities);
        setStats(prev => ({
          ...prev,
          contactMessages: contactData.contacts?.length || 0,
          totalVisitors: visitorStats.totalVisitors || 0,
          visitorChange: visitorStats.percentageChange || 0
        }));
      } catch (error) {
        console.error("Failed to fetch dashboard activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "contact":
        return <FaCommentDots className="h-4 w-4 text-blue-500" />;
      case "news":
        return <FaEdit className="h-4 w-4 text-green-500" />;
      case "band":
        return <FaUsers className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with Metal Gates Festival.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <FaUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.visitorChange >= 0 ? "+" : ""}
              {stats.visitorChange}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            <FaCommentDots className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contactMessages}</div>
            <p className="text-xs text-muted-foreground">View in activity feed</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <FaChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ticketsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading activities...</p>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent activity.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to="/admin/lineup">
                  <FaPlus className="mr-2 h-4 w-4" />
                  Add New Band
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/news">
                  <FaEdit className="mr-2 h-4 w-4" />
                  Create News Article
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/">
                  <FaEye className="mr-2 h-4 w-4" />
                  View Live Site
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}