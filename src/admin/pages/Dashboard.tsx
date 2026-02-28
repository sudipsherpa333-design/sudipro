import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, FolderKanban, FileText, MessageSquare } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  if (isLoading) return <div className="text-white">Loading stats...</div>;

  const stats = [
    {
      title: "Total Visitors",
      value: data?.totalVisitors || 0,
      icon: <Users size={24} />,
      color: "text-blue-400",
    },
    {
      title: "Projects",
      value: data?.totalProjects || 0,
      icon: <FolderKanban size={24} />,
      color: "text-accent",
    },
    {
      title: "Blog Posts",
      value: data?.totalBlogs || 0,
      icon: <FileText size={24} />,
      color: "text-purple-400",
    },
    {
      title: "Contacts",
      value: data?.totalContacts || 0,
      icon: <MessageSquare size={24} />,
      color: "text-success",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-full bg-dark-surface ${stat.color}`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-400">Activity feed will be displayed here.</p>
      </div>
    </div>
  );
}
