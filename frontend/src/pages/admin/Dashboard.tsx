import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { Building2, MessageSquare, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  totalProperties: number;
  totalInquiries: number;
  activeListings: number;
  newInquiries: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/dashboard/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Properties",
      value: stats?.totalProperties || 0,
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      label: "Total Inquiries",
      value: stats?.totalInquiries || 0,
      icon: MessageSquare,
      color: "bg-gold",
    },
    {
      label: "Active Listings",
      value: stats?.activeListings || 0,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "New Inquiries",
      value: stats?.newInquiries || 0,
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground font-body">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-body font-medium">
              {stat.label}
            </p>
            <h2 className="font-display text-2xl font-bold mt-1">
              {loading ? "..." : stat.value}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for more complex components */}
      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-background rounded-xl p-6 shadow-sm border border-border min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-muted/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              Views & Performance Chart coming soon
            </p>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 shadow-sm border border-border min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-muted/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              Recent Inquiries and Activity Feed coming soon
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
